import { Injectable } from '@angular/core';
import { Camera, CameraPluginPermissions } from '@capacitor/camera';
import { Geolocation, GeolocationPluginPermissions } from '@capacitor/geolocation';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor() {}

  requestPermissions(permission: IPermission) {
    switch (permission) {
      case 'camera':
        return this.getPermissionsPhotos();
      case 'gps':
        return this.getPermissionGPS();

      default:
        return true;
    }
  }

  private async getPermissionsPhotos() {
    const { photos } = await Camera.checkPermissions();
    let value = null;
    if (photos === 'prompt' || photos === 'prompt-with-rationale') {
      const permissions: CameraPluginPermissions = {
        permissions: ['camera', 'photos']
      };
      const data = await Camera.requestPermissions(permissions);
      value = data?.photos;
    }
    if (value == 'granted') {
      return true;
    } else {
      return false;
    }
  }

  private async getPermissionGPS() {
    const { coarseLocation, location } = await Geolocation.checkPermissions();

    let prompotCoarse = coarseLocation === 'prompt' || coarseLocation === 'prompt-with-rationale';
    let prompotLocation = location === 'prompt' || location === 'prompt-with-rationale';

    let valueLocation = null;
    let valueCoarse = null;

    if (prompotCoarse || prompotLocation) {
      const permissions: GeolocationPluginPermissions = {
        permissions: ['coarseLocation', 'location']
      };
      const { coarseLocation, location } = await Geolocation.requestPermissions(permissions);
      valueCoarse = coarseLocation;
      valueLocation = location;
    }

    if (valueLocation === 'granted' || valueCoarse === 'granted') {
      return true;
    } else {
      return false;
    }
  }
}
export type IPermission = 'camera' | 'gps' | 'storage';
