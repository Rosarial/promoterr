import { Injectable } from '@angular/core';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
  ImageOptions,
  Photo
} from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
import { StorageService } from './storage.service';
import { UtilsService } from './utils.service';
const IMAGE_DIR = KEY_VALUE.storagePhotosImageDir;
let _captured_image: Photo;
let _camera_check_timeout: ReturnType<typeof setTimeout>;
@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor(
    private plt: Platform,
    private storageService: StorageService,
    private utilsService: UtilsService
  ) {}

  /**
   * Takes a photo before and returns its base64 string representation. (antes)
   * If the platform is hybrid, ensures filesystem and camera permissions.
   * Antes
   *
   * @return {Promise<ImgStorage|Error>} The base64 string of the taken photo or an error if one occurred.
   */
  async takeBeforePhoto(): Promise<ImgStorage | null> {
    try {
      if (this.plt.is('hybrid')) {
        await this.ensureFilesystemPermissions();
        await this.ensureCameraPermissions();
      }

      this._checkCameraOpen();
      const photo = await this.takePicture(CameraSource.Camera);
      let resutl = null;
      if (photo?.base64String) {
        resutl = await this.saveStorage({ name: 'before', base64Data: photo.base64String });
      }
      return resutl;
    } catch (error: any) {
      throw error;
    }
  }

  _checkCameraOpen() {
    if (_camera_check_timeout || _captured_image) clearTimeout(_camera_check_timeout);

    let style = document.createElement('style');
    style.innerHTML = '.pick-image { display: none !important; }';

    let $this = this;
    _camera_check_timeout = setTimeout(() => {
      let camera_instances = document.querySelectorAll('pwa-camera-modal-instance');
      if (camera_instances.length) {
        let is_found = false;
        camera_instances.forEach(e => {
          let c = e.shadowRoot?.querySelector('pwa-camera');
          if (c) {
            c.shadowRoot?.appendChild(style);
            is_found = true;
          }
        });
        if (!is_found) {
          $this._checkCameraOpen();
        }
      } else {
        $this._checkCameraOpen();
      }
    }, 10);
  }

  async takePhotoOrChangePhoto(arg0: string) {
    try {
      if (this.plt.is('hybrid')) {
        await this.ensureFilesystemPermissions();
        await this.ensureCameraPermissions();
        await this.ensurePhotosPermissions();
      }
      const photo = await this.takePicture(CameraSource.Prompt);
      const base64Data = photo.base64String;
      const result = `data:image/jpeg;base64,${base64Data}`;
      return {
        ...photo,
        base64Data: result
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Takes a photo After and returns its base64 string representation. (depois)
   * If the platform is hybrid, ensures filesystem and camera permissions.
   * Depois
   *
   * @return {Promise<ImgStorage|Error>} The base64 string of the taken photo or an error if one occurred.
   */
  async takeAfterPhoto(name: 'before' | 'after' | 'damage' = 'after'): Promise<ImgStorage | null> {
    try {
      if (this.plt.is('hybrid')) {
        await this.ensureFilesystemPermissions();
        await this.ensureCameraPermissions();
      }
      this._checkCameraOpen();
      const photo = await this.takePicture(CameraSource.Camera);
      if (photo?.base64String) {
      }
      let resutl = null;
      if (photo?.base64String) {
        resutl = await this.saveStorage({ name, base64Data: photo.base64String });
      }
      return resutl;
    } catch (error: any) {
      throw error;
    }
  }

  private async ensureFilesystemPermissions() {
    const checkPermissions = await Filesystem.checkPermissions();
    if (checkPermissions.publicStorage !== 'granted') {
      const requestPermissions = await Filesystem.requestPermissions();
      if (requestPermissions.publicStorage !== 'granted') {
        throw new Error('Filesystem permissions not granted');
      }
    }
  }

  private async ensureCameraPermissions() {
    const checkPermissions = await Camera.checkPermissions();
    if (checkPermissions.camera !== 'granted') {
      const requestPermissions = await Camera.requestPermissions();
      if (requestPermissions.camera !== 'granted') {
        throw new Error('Camera permissions not granted');
      }
    }
  }

  private async ensurePhotosPermissions() {
    const checkPermissions = await Camera.checkPermissions();
    if (checkPermissions.photos !== 'granted') {
      const requestPermissions = await Camera.requestPermissions();
      if (requestPermissions.photos !== 'granted') {
        throw new Error('Photos permissions not granted');
      }
    }
  }

  private async takePicture(
    source: CameraSource,
    direction: CameraDirection = CameraDirection.Rear
  ): Promise<Photo> {
    const options: ImageOptions = {
      quality: 50,
      resultType: CameraResultType.Base64,
      correctOrientation: true,
      allowEditing: true,
      direction,
      saveToGallery: true,
      source
    };

    try {
      const resultPhoto = await Camera.getPhoto(options);
      return resultPhoto;
    } catch (error: any) {
      throw error;
    }
  }

  public async loadDatStorage(name: 'before' | 'after' | 'damage'): Promise<ImgStorage | null> {
    const key = `${KEY_VALUE.storagePhotosImageDir}_${name}`;
    const dataStorage = await this.storageService.getData<ImgStorage>(key);
    return dataStorage;
  }
  public removeStorage(data: ImgStorage) {
    if (!data || !data?.id) return;
    const key = `${KEY_VALUE.storagePhotosImageDir}_${data.name}`;
    this.loadDatStorage(data.name).then(res => {
      if (res?.id === data?.id) {
        console.log('removed, ', res);
        this.storageService.removeData(key);
      }

      console.log();
    });
  }

  private saveStorage(data: { name: 'before' | 'after' | 'damage'; base64Data: string }) {
    const payload = {
      ...data,
      base64Data: `data:image/jpeg;base64,${data.base64Data}`,
      id: this.utilsService.generateUUID(),
      date: new Date()
    };

    if (!data || !data?.base64Data) return null;

    const key = `${KEY_VALUE.storagePhotosImageDir}_${data.name}`;
    this.storageService.setData(key, payload);
    return this.loadDatStorage(data.name);
  }
}
export interface ImgStorage {
  name: 'before' | 'after';
  base64Data: string;
  id: string;
  date: Date;
}
