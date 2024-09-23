import { Component, OnInit } from '@angular/core';
import { BatteryInfo, DeviceId, DeviceInfo } from '@capacitor/device';
import { CanComponentDeactivate } from '@guards/pending-checkin.guard';
import { CheckboxChangeEventDetail, ModalController, NavController } from '@ionic/angular';
import { IonCheckboxCustomEvent } from '@ionic/core';
import { AddCheckoutComponent, PreviewimgComponent } from '@shared/components/modais';
import { DataRouter } from '@shared/enums/data.router.enum';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
import { ICheckinStart } from '@shared/interfaces/checkinstart';
import { ICheckoutDetatils } from '@shared/interfaces/checkout.details';
import { IStoreData } from '@shared/interfaces/cliente';
import { IProfile } from '@shared/interfaces/profile';
import {
  CameraService,
  CheckinService,
  DeviceInfoService,
  GeolocationService,
  ImgStorage,
  OverlayService,
  StorageService
} from '@shared/services';
import { CheckoutDetailsService } from '@shared/services/checkout.details.service';
import { DataRouterService } from '@shared/services/data.router.service';
import { UserService } from '@shared/services/user.service';
import { finalize, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss']
})
export class CheckinPage implements OnInit, CanComponentDeactivate {
  public store!: IStoreData;
  public errorCoords = false;
  public currentPosition!: { latitude: number; longitude: number };
  isInAllowedArea = false;
  distanceInKilometers!: string;
  allowedArea: { latitude: number; longitude: number }[] = [];
  checkinData: unknown[] = [];
  disableButtonAddCheckin = false;
  dayNow = new Date();
  imageCheckin!: ImgStorage | null;
  checkedInitialCheckin = false;
  userInfo?: IProfile;
  public deviceInfo?: {
    info: DeviceInfo;
    infoBattery: BatteryInfo;
    uuID: DeviceId;
  };
  localDataCheckin: unknown;
  checkinISDone?: { timestamp: Date; clientID: any };
  loadingCheckingLocationFinish = false;
  outOfAllowedArea = false;
  public finishedCheckinInitialSendRemote = false;
  public storeCheckoutDetails!: ICheckoutDetatils;
  private loadingSendCheckin!: HTMLIonLoadingElement;

  constructor(
    private dataRouterService: DataRouterService,
    private geolocationService: GeolocationService,
    private overlayService: OverlayService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private checkinService: CheckinService,
    private cameraService: CameraService,
    private userService: UserService,
    private deviceInfoService: DeviceInfoService,
    private storageService: StorageService,
    private checkoutDetailsService: CheckoutDetailsService
  ) {
    this.infoDevice();
  }

  onBackButton(force = false) {
    if (force) {
      this.navCtrl.back();

      return;
    }
    if (this.finishedCheckinInitialSendRemote || this.store?.checkin?.initialCheckin) {
      return;
    }
    this.navCtrl.back();
  }
  canDeactivate() {
    if (!this.store) {
      return true;
    }

    if (this.store.checkin?.isDone) {
      return true;
    }
    if (this.finishedCheckinInitialSendRemote || this.store?.checkin?.initialCheckin) {
      return false;
    }
    return true;
  }

  async ngOnInit() {
    this.store = this.dataRouterService.getData(DataRouter.CLIENTE);
    this.getCurrentLocation().then(async () => {
      const loading = await this.overlayService.loading({
        message: 'Verificando a cerca geográfica, por favor, aguarde!'
      });
      this.checkLocation(loading);
    });

    if (this.store?.checkin?.id && this.store?.checkin?.isDone) {
      return this.getCheckoutDetails({
        storeId: this.store?.checkin?.storeId,
        checkinId: this.store?.checkin?.id
      });
    }

    if (this.store?.checkin?.initialCheckin && !this.store?.checkin?.isDone) {
      this.checkedInitialCheckin = true;
    }

    if (this.store?.checkin?.initialCheckin && this.store?.checkin?.isDone) {
      this.finishedCheckinInitialSendRemote = true;
    }

    if (!this.store?.checkin?.initialCheckinDate) {
      this.checkinData = (await this.checkinService.getCheckinData()) as any[];
      if (!this.store) {
        this.navCtrl.back();
      }
      const photoStorage = await this.cameraService.loadDatStorage('before');
      if (photoStorage) {
        this.imageCheckin = photoStorage;
      }
    }

    this.userService.currentUser().subscribe(user => {
      this.userInfo = user;
    });
  }
  async getCheckoutDetails(data: { storeId: number; checkinId: number }) {
    const loading = await this.overlayService.loading({
      message: 'Carregando dados, por favor, aguarde!'
    });
    this.checkoutDetailsService
      .getDetails(data)
      .pipe(
        take(1),
        finalize(() => {
          loading?.dismiss();
        })
      )
      .subscribe({
        next: res => {
          const response = {
            ...res
          };

          this.store.checkin = {
            ...res.checkin
            // photoUrls: JSON.parse(res.checkin.photoUrls)
          };
          if (response?.id === undefined) {
            this.storeCheckoutDetails = {
              ...response,
              checkinId: response?.checkin?.id,
              damageProducts: [],
              hasDamage: false,
              needRestock: false,
              restockProducts: [],
              storeId: this.store?.checkin?.storeId
            };
          } else {
            this.storeCheckoutDetails = response;
          }
          console.log(this.storeCheckoutDetails);
        },
        error: err => console.log(err)
      });
  }

  /**
   * Takes a photo before and returns its base64 string representation.
   *
   * @return {Promise<ImgStorage | null>} The base64 string of the taken photo or null if no photo taken.
   */
  async takeBeforePhoto() {
    const photo = await this.cameraService.takeBeforePhoto();
    photo?.date;
    photo?.base64Data;
    if (photo && photo?.base64Data) {
      this.imageCheckin = photo;
      return this.imageCheckin;
    }
    this.imageCheckin = this.imageCheckin ?? null;
    return this.imageCheckin;
  }
  deleteImage() {
    if (this.imageCheckin?.base64Data) {
      this.cameraService.removeStorage(this.imageCheckin);
      this.imageCheckin = null;
    }
  }
  async onSubmit() {
    const loading = await this.overlayService.loading({ message: 'Aguarde...' });

    const timestamp = this.dayNow.toISOString();

    let payload: ICheckinStart = {} as ICheckinStart;
    if (this.userInfo && this.userInfo.role) {
      const userID = this.userInfo.userId;
      const clientID = this.store?.id;
      const imageCheckin = this.imageCheckin as any;
      const initialCheckin = this.checkedInitialCheckin;
      payload = {
        timestamp,
        userID,
        clientID,
        imageCheckin,
        initialCheckin: initialCheckin,
        deviceInfo: this.deviceInfo as any
      };
    }

    console.log('data', payload);
    loading
      .dismiss()
      .then(() => {})
      .finally(() => {
        this.storageService
          .setData(KEY_VALUE.storageCheckinData, payload)
          .then(() => {
            this.overlayService.toast({
              header: 'Backup concluído',
              message: `Fazendo backup do check-in`
            });
          })
          .finally(async () => {
            this.loadingSendCheckin = await this.overlayService.loading({
              message: 'Enviando para o servidor por favor, Aguarde...'
            });
            this.sendCheckinStart(payload);
          });
      });
  }

  async openPreviewImage(props: { img: string; title: string; description: string }) {
    const modal = await this.modalCtrl.create({
      component: PreviewimgComponent,
      componentProps: { props }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
  }
  onChangeCheckBoxInitialCheckin(event: IonCheckboxCustomEvent<CheckboxChangeEventDetail<any>>) {
    console.log(event?.detail.checked);
    this.checkedInitialCheckin = event?.detail.checked;
  }
  public async checkoutAdd(checkinData?: any) {
    if (this.store.checkin && !checkinData) {
      checkinData = this.store.checkin;
    }
    const modal = await this.modalCtrl.create({
      component: AddCheckoutComponent,
      componentProps: {
        store: this.store,
        checkinData: checkinData ? checkinData : null
      },
      cssClass: 'add-checkin'
    });
    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (data && role == 'confirm') {
      const payload = {
        ...data,
        photosURL: JSON.parse(data?.photosURLs || '[]')
      };
      this.store.checkin = payload;
      this.onBackButton(true);
    }
  }
  private async getCurrentLocation() {
    try {
      const { coords } = await this.geolocationService.getCurrentPosition();
      this.errorCoords = false;
      return coords;
    } catch (error: any) {
      this.errorCoords = true;
      throw error;
    }
  }

  private async checkLocation(loading: any): Promise<void> {
    try {
      if (!this.store?.latitude || !this.store?.longitude) {
        throw new Error('Localização do cliente não está disponível');
      }

      const { coords } = await this.geolocationService.getCurrentPosition();

      const companyLocation = {
        latitude: +this.store.latitude,
        longitude: +this.store.longitude
      };

      this.currentPosition = {
        latitude: coords.latitude,
        longitude: coords.longitude
      };

      this.allowedArea.push(companyLocation);
      console.log('this.allowedArea', this.allowedArea);

      const resultCalcDistance = this.checkinService.calculateDistance(
        this.currentPosition,
        companyLocation
      );
      this.distanceInKilometers = resultCalcDistance?.distanceInKilometers ?? null;

      if (this.allowedArea.length === 1) {
        this.checkSinglePointArea(resultCalcDistance?.distance, loading);
      } else {
        this.checkPolygonArea(loading);
      }
    } catch (error) {
      console.log(error);
      this.showLocationErrorToast();
    } finally {
      loading.dismiss();
      this.loadingCheckingLocationFinish = true;
    }
  }

  private checkSinglePointArea(distance: number | undefined, loading: any): void {
    if (distance !== undefined && distance > environment.distancePermited) {
      this.handleOutOfAllowedArea(loading);
    } else {
      loading.dismiss();
    }
  }

  private checkPolygonArea(loading: any): void {
    this.isInAllowedArea = this.checkinService.isPointInPolygon(
      this.currentPosition,
      this.allowedArea
    );

    if (!this.isInAllowedArea) {
      this.handleOutOfAllowedArea(loading);
    } else {
      loading.dismiss();
    }
  }

  private handleOutOfAllowedArea(loading: any): void {
    this.outOfAllowedArea = true;
    loading.dismiss();
    this.overlayService.toast({
      header: 'Cerca geográfica',
      color: 'danger',
      cssClass: 'toast-danger',
      duration: 30000,
      buttons: [
        {
          text: 'Voltar depois',
          handler: () => {
            // this.navCtrl.back();
          }
        }
      ],
      message: 'Você não está dentro da área permitida pela cerca geográfica da empresa!'
    });
  }

  private showLocationErrorToast(): void {
    this.overlayService.toast({
      header: 'Erro de Localização',
      color: 'danger',
      cssClass: 'toast-danger',
      duration: 30000,
      swipeGesture: 'vertical',
      buttons: [
        {
          text: 'Voltar depois',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ],
      message:
        'Não foi possível obter a localização do store. Por favor, verifique se o GPS está habilitado!'
    });
  }

  private async infoDevice() {
    this.deviceInfo = await this.deviceInfoService.infoFullDevice();
  }

  private async sendCheckinStart(checkinStartData: ICheckinStart): Promise<void> {
    const payloadISDone = {
      timestamp: Date.now(),
      clientID: checkinStartData.clientID
    };
    this.storageService.setData(KEY_VALUE.checkiISDone, payloadISDone);

    this.checkinService
      .sendCheckinStartToServer(checkinStartData)
      .pipe(
        finalize(() => {
          this.loadingSendCheckin.dismiss();
        })
      )
      .subscribe({
        next: this.handleSuccessCheckinStart.bind(this),
        error: this.handleErrorCheckinStart.bind(this)
      });
  }
  handleErrorCheckinStart(error: any) {
    this.overlayService.toast({
      header: 'Ops!',
      color: 'danger',

      cssClass: 'toast-dager',
      duration: 30000,
      message: 'Tente novamente ou entre em contato com o administrador!'
    });
    console.log('%c' + JSON.stringify(error), 'color:' + 'red' + ';font-weight:bold;');
  }
  handleSuccessCheckinStart(response: any) {
    console.log('%c' + JSON.stringify(response), 'color:' + 'green' + ';font-weight:bold;');
    const checkinData = response['data'];
    this.store.checkin = checkinData;
    this.storageService.setData(KEY_VALUE.storageCheckinData, response['data']);
    this.overlayService.toast({
      header: 'Sucesso',
      color: 'success',

      cssClass: 'toast-success',
      duration: 30000,
      buttons: [
        {
          text: 'Fazer Checkout agora?',
          handler: () => {
            this.checkoutAdd(checkinData);
          }
        }
      ],
      message: 'Check-in enviado para o servidor com sucesso!'
    });

    if (this.imageCheckin) {
      this.cameraService.removeStorage(this.imageCheckin);
    }

    this.storageService.removeData(KEY_VALUE.storageCheckinData);
    this.storageService.removeData(KEY_VALUE.storagePhotosImageDir);
    this.storageService.removeData(KEY_VALUE.checkiISDone);
    this.finishedCheckinInitialSendRemote = true;
    console.log('%c' + JSON.stringify(response), 'color:' + 'green' + ';font-weight:bold;');
  }
}
