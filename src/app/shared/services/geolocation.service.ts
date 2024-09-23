import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { OverlayService } from './overlay.service';
import { PermissionService } from './permission.service';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Position {
  coords: Coordinates;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(
    private permissionService: PermissionService,
    private overlayService: OverlayService
  ) {}

  async getCurrentPosition(): Promise<Position> {
    if (this.isWeb()) {
      return this.getCurrentPositionWeb();
    } else {
      await this.permissionService.requestPermissions('gps');
      return this.getCurrentPositionNative();
    }
  }

  private async getCurrentPositionNative(): Promise<Position> {
    try {
      const { coords, timestamp } = await Geolocation.getCurrentPosition();
      return { coords, timestamp };
    } catch (error: any) {
      console.log('Error (native):', error);
      this.showToast(error);
      throw error;
    }
  }

  private async getCurrentPositionWeb(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              timestamp: position.timestamp,
            });
          },
          (error) => {
            console.log('Error (web):', error);
            this.showToast(error);
            reject(error);
          }
        );
      } else {
        const error = { code: 2, message: 'Geolocation não suportada' };
        this.showToast(error);
        reject(error);
      }
    });
  }

  private isWeb(): boolean {
    return window && window.location && window.location.protocol === 'http:';
  }

  private showToast(error: any): void {
    let message =
      'Não foi possível obter a localização do dispositivo. Verifique se o GPS está habilitado!';
    if (error?.code === 1) {
      message = 'A permissão para uso do GPS foi negada. Por favor, habilite e tente novamente.';
    }

    this.overlayService.toast({
      header: 'Erro de localização!',
      message,
      color: 'danger',
      icon: 'compass-outline',
      cssClass: 'toast-danger',
      duration: 20000
    });
  }
}
