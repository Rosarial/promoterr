import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatetimeChangeEventDetail, MenuController, ModalController } from '@ionic/angular';
import { IonDatetimeCustomEvent } from '@ionic/core';
import { AddCheckoutComponent } from '@shared/components/modais';
import { DataRouter } from '@shared/enums/data.router.enum';
import { IStoreData } from '@shared/interfaces/cliente';
import { IProfile, UserRole } from '@shared/interfaces/profile';
import { GeolocationService, OverlayService, StoreService } from '@shared/services';
import { DataRouterService } from '@shared/services/data.router.service';
import { UserService } from '@shared/services/user.service';
import * as moment from 'moment';
import { finalize, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  public userInfo!: IProfile;

  public view;
  public stores: IStoreData[] = [];
  public loading = true;
  date = null;
  now = moment().format('YYYY-MM-DD');
  chosenDate: any;
  data: any;
  suscriptions$: Subscription[] = [];

  constructor(
    private menuCtrl: MenuController,
    private geolocationService: GeolocationService,
    private userService: UserService,
    private ngZone: NgZone,
    private dataRouterService: DataRouterService,
    private storeService: StoreService,
    private router: Router,
    private overlayService: OverlayService,
    private modalController: ModalController
  ) {
    this.view = 'calendar';
  }
  ngOnDestroy(): void {
    this.suscriptions$.forEach(sub => sub.unsubscribe());
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
    const sub = this.userService
      .currentUser()

      .subscribe({
        next: userinfo => {
          if (userinfo) {
            this.userInfo = userinfo;
          }
        },
        error: error => {
          console.log(error);
        }
      });

    console.log(this.userInfo);
    this.obterLojas().then(() => {
      this.updateUserInfo();
    });
    this.suscriptions$.push(sub);
  }
  async ngOnInit() {
    // this.teste();
    console.log('ngOnInit');
  }

  changeDate(event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>) {
    event?.detail?.value;
    console.log(event?.detail?.value);
    const dateChoose = moment(event?.detail?.value).format('YYYY-MM-DD');
    this.obterLojas(dateChoose);
  }
  segmentChanged(event: any) {
    console.log(event?.detail?.value);

    this.ngZone.run(() => {
      this.view = event?.detail?.value;
    });
  }

  profile() {
    this.router.navigate(['/profile']);
  }
  public navagateCheckin(client: any, userInfo: IProfile) {
    if (client?.checkin?.deviceInfo) {
      client.checkin.deviceInfo = JSON.stringify(client.checkin.deviceInfo);
    }
    const payload = {
      ...client
    };
    this.dataRouterService.setData(DataRouter.CLIENTE, payload);
    if (userInfo && userInfo.role === UserRole.PROMOTER) {
      this.router.navigate(['/checkin']);
    } else if (userInfo && userInfo.role === UserRole.ADMIN) {
      this.router.navigate(['/admin']);
    } else if (userInfo && userInfo.role === UserRole.SUPERVISOR) {
      this.router.navigate(['/supervisor']);
    }
  }
  private async updateUserInfo() {
    const { latitude, longitude } = await this.getCurrentLocation();
    const payload = {
      ...this.userInfo,
      currentPosition:
        latitude && longitude ? { lat: latitude, lng: longitude } : this.userInfo.currentPosition
    };

    this.userService.updateDataUser(payload);
  }
  private async getCurrentLocation() {
    try {
      const { coords } = await this.geolocationService.getCurrentPosition();
      return coords;
    } catch (error) {
      throw error;
    }
  }
  private async obterLojas(date?: string) {
    this.loading = true;
    const loading = await this.overlayService.loading({ message: 'Carregando...' });
    const { latitude, longitude } = await this.getCurrentLocation();
    this.storeService
      .obterLojas(date, { latitude, longitude, maxDistance: environment.distanceStoresPermitted })
      .pipe(
        finalize(() => {
          this.loading = false;
          loading.dismiss();
        })
      )
      .subscribe({
        next: result => {
          this.stores = result;
        },
        error: error => {
          console.log(error);
        }
      });
  }
  private async teste() {
    const modal = await this.modalController.create({
      component: AddCheckoutComponent,
      componentProps: {
        cliente: mocmmmmmm[0],
        checkinData: {}
      }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    console.log(data);
    console.log(role);
  }
  // private isCheckinDoneToday(lastCheckinDate: string): boolean {
  //   if (!lastCheckinDate) return false;
  //   const today = new Date();
  //   const checkinDate = new Date(lastCheckinDate);
  //   return (
  //     checkinDate.getDate() === today.getDate() &&
  //     checkinDate.getMonth() === today.getMonth() &&
  //     checkinDate.getFullYear() === today.getFullYear()
  //   );
  // }
}
const mocmmmmmm = [
  {
    id: '2',
    nome: 'atacadista',
    telefone: '(11) 11111-1111',
    email: 'empresa1@hotmail.com',
    cpf: '111.111.111-11',
    cnpj: '11.111.111/1111-11',
    ativo: 'Sim',
    data_cad: '2022-12-19',
    data_pgto: '2022-09-25',
    valor: '250.00',
    endereco: 'rua Dr Jose Osorio Oliveira Azevedo',
    latitude: '-47.126028',
    longitude: '-23.517607'
  },
  {
    id: '8',
    nome: 'assai',
    telefone: '(11) 99342-4754',
    email: 'assai@gmail.com',
    cpf: '726.838.768-77',
    cnpj: '89.787.575/4567-56',
    ativo: 'Sim',
    data_cad: '2023-04-06',
    data_pgto: '2023-02-19',
    valor: '270.00',
    endereco: '701 W Oakland Avenue',
    latitude: null,
    longitude: null
  },
  {
    id: '9',
    nome: 'carrefour',
    telefone: '',
    email: 'empresa123@galaxy.com',
    cpf: '213.425.534-32',
    cnpj: '23.458.492/3048-54',
    ativo: 'Sim',
    data_cad: '2023-04-06',
    data_pgto: '2023-03-13',
    valor: '400.00',
    endereco: 'internacional drive',
    latitude: null,
    longitude: null
  }
];
