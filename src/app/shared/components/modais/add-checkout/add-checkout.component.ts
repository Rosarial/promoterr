import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { IonModal, ModalController } from '@ionic/angular';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
import { ICheckin, IStoreData } from '@shared/interfaces/cliente';
import { CameraService, CheckinService, OverlayService, StorageService } from '@shared/services';
import { ProductService } from '@shared/services/products.service';

@Component({
  selector: 'app-add-checkout',
  templateUrl: './add-checkout.component.html',
  styleUrls: ['./add-checkout.component.scss']
})
export class AddCheckoutComponent implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  @Input() store?: IStoreData;
  @Input() checkinData?: ICheckin;
  afterImage: any = null;
  isModalOpen = { isOpen: false, data: null };
  stockForm!: FormGroup;
  products: any[] = []; // Adicione aqui a lista de produtos
  imagesDamages: { base64Data: string; index: number }[] = [];

  constructor(
    private overlayService: OverlayService,
    private modalCtrl: ModalController,
    private cameraService: CameraService,
    private checkinService: CheckinService,
    private fb: FormBuilder,
    private productsService: ProductService,
    private storageService: StorageService
  ) {
    this.stockForm = this.fb.group({
      needRestock: [false, Validators.required],
      restockProducts: this.fb.array([this.newProduct()]),
      hasDamage: [false, Validators.required],
      damageProducts: this.fb.array([this.newDamageProduct()])
    });
  }

  ionViewDidEnter() {}
  async ngOnInit() {
    this.productsService.getAll().subscribe(response => {
      if (response && response?.data?.length > 0) {
        this.products = response.data;
      }
    });

    console.log(this.checkinData);
    if (this.checkinData) {
    }
  }
  deletaAfterPhoto(data: any) {
    this.afterImage = '';
    this.cameraService.removeStorage(data?.id);
  }

  /**
   * Takes a photo After and returns its base64 string representation.
   *
   * @return {Promise<ImgStorage|Error>} The base64 string of the taken photo or an error if one occurred.
   */
  async takeAfterPhoto() {
    try {
      const response = await this.cameraService.takeAfterPhoto();
      if (response && response?.base64Data) {
        this.afterImage = response;
      }
      return this.afterImage;
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async submitForm() {
    const loading = await this.overlayService.loading({ message: 'Aguarde...' });
    // Lógica para enviar o formulário
    const { value } = this.stockForm;
    let payloadCheckin = null;
    if (this.store) {
      payloadCheckin = this.store.checkin;
    }

    let imageBeafore = '';

    const data = {
      imageAfter: this.afterImage,
      storeId: payloadCheckin?.storeId,
      checkin: {
        isDone: true,
        ...payloadCheckin
      },
      ...value
    };

    if (!this.afterImage) {
      loading.dismiss();
      this.overlayService
        .toast({
          header: 'Ops.!',
          message: 'é necessario adicionar uma foto depois da organização e arrumação.',
          duration: 3000,
          color: 'danger',

          icon: 'alert-circle-outline',
          cssClass: 'toast-danger'
        })
        .finally(() => {});
    }
    console.log(data);
    if (data.imageAfter) {
      data.checkin.isDone = true;
      this.checkinService.setCheckinData(data);

      this.checkinService.checkout(data).subscribe({
        next: async res => {
          this.overlayService
            .toast({
              header: 'Formulário Enviado',
              message: 'Os dados foram enviados com sucesso!',
              duration: 3000
            })
            .finally(() => {
              loading.dismiss();
            });
          console.log(res);
          if ('data' in res) {
            this.close(res['data']);
            console.log('damage', this.cameraService.loadDatStorage('damage'));
            console.log('after', this.cameraService.loadDatStorage('after'));
            console.log('before', this.cameraService.loadDatStorage('before'));
            const imageDamage = await this.cameraService.loadDatStorage('damage');
            const imageAfter = await this.cameraService.loadDatStorage('after');
            const imageBefore = await this.cameraService.loadDatStorage('before');

            if (imageDamage) {
              this.deletaAfterPhoto(imageDamage);
            }
            if (imageAfter) {
              this.deletaAfterPhoto(imageAfter);
            }
            if (imageBefore) {
              this.deletaAfterPhoto(imageBefore);
            }
            this.storageService.removeData(KEY_VALUE.storageCheckinData);
            this.storageService.removeData(KEY_VALUE.storagePhotosImageDir);
            this.storageService.removeData(KEY_VALUE.checkiISDone);
            this.deletaAfterPhoto(this.afterImage);
          }
        },
        error: err => {
          console.log(err);
          loading.dismiss();
          this.overlayService
            .toast({
              header: 'Ops.!',
              message:
                'Erro ao enviar o formulário. Tente novamente ou entre em contato com o administrador!',
              duration: 3000,
              color: 'danger',
              icon: 'alert-circle-outline',
              cssClass: 'toast-danger'
            })
            .finally(() => {
              loading.dismiss();
            });
        }
      });
    }
  }
  async close(data?: any) {
    this.modalCtrl.dismiss(data, data ? 'confirm' : 'cancel');
    this.isModalOpen = { isOpen: false, data: null };
    Capacitor.isNativePlatform() ? await ScreenOrientation.unlock() : null;
  }

  async setOpen(isOpen: boolean, data: any) {
    Capacitor.isNativePlatform()
      ? await ScreenOrientation.lock({ orientation: 'landscape' })
      : null;
    console.log(isOpen, data);
    this.isModalOpen = { isOpen, data };
  }

  takePhoto(index: number) {
    // Implementar lógica para tirar foto e salvar a URL da foto no formulário

    this.cameraService.takeAfterPhoto('damage').then(res => {
      console.log(res);
      const imagesDamages = [];
      // this.afterImage = res;
      if (res?.base64Data) {
        this.damageProducts().at(index)?.get('damagePhoto')?.setValue(res);
        imagesDamages.push({ res, index });
      }
    });
  }
  restockProducts(): FormArray {
    return this.stockForm.get('restockProducts') as FormArray;
  }

  damageProducts(): FormArray {
    return this.stockForm.get('damageProducts') as FormArray;
  }

  newProduct(): FormGroup {
    return this.fb.group({
      product: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  newDamageProduct(): FormGroup {
    return this.fb.group({
      product: [null, Validators.required],
      damageDescription: [null, Validators.required],
      damagePhoto: [null]
    });
  }

  async tryAddRestockProduct() {
    const newProduct = this.newProduct();
    const duplicateIndex = this.findDuplicateProductIndex(newProduct, 'restock');
    if (duplicateIndex === -1) {
      this.addRestockProduct();
    } else {
      const alert = await this.overlayService.alert({
        header: 'Produto Duplicado',
        message: 'Este produto já foi adicionado. Deseja incrementar a quantidade?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Incrementar',
            handler: () => {
              this.incrementProductQuantity(duplicateIndex);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  addRestockProduct() {
    this.restockProducts().push(this.newProduct());
  }

  addDamageProduct() {
    this.damageProducts().push(this.newDamageProduct());
  }

  removeRestockProduct(index: number) {
    this.restockProducts().removeAt(index);
  }

  removeDamageProduct(index: number) {
    this.damageProducts().removeAt(index);
  }

  toggleRestock(event: any) {
    if (event.detail.checked && this.restockProducts().length === 0) {
      this.addRestockProduct();
    }
  }

  toggleDamage(event: any) {
    if (event.detail.checked && this.damageProducts().length === 0) {
      this.addDamageProduct();
    }
  }

  async checkDuplicateProduct(index: number) {
    const selectedProduct = this.restockProducts().at(index).get('product')?.value;

    const isDuplicate = this.restockProducts().controls.some(
      (control, i) => i !== index && control.get('product')?.value?.id === selectedProduct?.id
    );

    if (isDuplicate) {
      const alert = await this.overlayService.alert({
        header: 'Produto Duplicado',
        message: 'Este produto já foi adicionado na lista de estoque.',
        buttons: ['OK']
      });
      await alert.present();

      this.restockProducts().at(index).get('product')?.setValue(null);
    }
  }

  async checkQuantity(index: number) {
    const productControl = this.restockProducts().at(index).get('product');
    const quantityControl = this.restockProducts().at(index).get('quantity');

    if (productControl && quantityControl) {
      const selectedProduct = productControl.value;
      const enteredQuantity = quantityControl.value;

      const product = this.products.find(p => p?.id === selectedProduct?.id);

      if (product && enteredQuantity > product.availableQuantity) {
        const alert = await this.overlayService.alert({
          header: 'Quantidade Excedida',
          message: `A quantidade inserida é maior que a disponível (${product.availableQuantity}).`,
          buttons: ['OK']
        });
        await alert.present();

        // quantityControl.setValue(product.availableQuantity);
      }
    }
  }

  findDuplicateProductIndex(newProduct: FormGroup, type: string): number {
    const productControl = newProduct.get('product');
    return this.restockProducts().controls.findIndex(
      control => control.get('product')?.value?.id === productControl?.value?.id
    );
  }

  incrementProductQuantity(index: number) {
    const productControl = this.restockProducts().at(index).get('quantity');
    const currentQuantity = productControl?.value;
    productControl?.setValue(currentQuantity + 1);
  }
}
