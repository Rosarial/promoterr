import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AlertOptions, LoadingOptions, ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private isToastPresent = false;
  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async alert(options?: AlertOptions): Promise<HTMLIonAlertElement> {
    const alert = await this.alertCtrl.create(options);
    await alert.present();
    return alert;
  }

  async loading(options?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
      duration: 35000,
      ...options
    });
    await loading.present();
    return loading;
  }

  async toast(options?: ToastOptions) {
    try {
      if (!this.isToastPresent) {
        const toast = await this.toastCtrl.create({
          position: 'bottom',
          duration: 3000,
          ...options
        });
        await toast.present();
        toast.onDidDismiss().then(() => {
          this.isToastPresent = false;
        });
        return toast;
      }
      return;
    } catch (error) {
      return error;
    }
  }
}
