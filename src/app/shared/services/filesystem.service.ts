import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { KEY_VALUE } from '@shared/enums/storage.key.enum';
const IMAGE_DIR = KEY_VALUE.storagePhotosImageDir;
@Injectable({ providedIn: 'root' })
export class FilesystemService {
  constructor(private plt: Platform) {}

  private async loadFileData(fileNames: any[]) {
    const images: any[] = [];
    for (let f of fileNames) {
      console.log('For of ', f);
      const filePath = `${IMAGE_DIR ?? 'storagePhotosImageDir'}/${f}`;
      try {
        const readFile = await Filesystem.readFile({
          directory: Directory.Data,
          path: filePath
        });

        images.push({
          name: f,
          path: filePath,
          data: `data:image/jpeg;base64,${readFile.data}`
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path ?? ''
      });

      return file.data;
    } else {
      let tobase64 = '';
      let response: any;
      let blob: any;
      if (photo?.webPath) {
        response = await fetch(photo.webPath);
        blob = await response.blob();
      }

      if (blob) {
        tobase64 = (await this.convertBlobToBase64(blob)) as string;
        return tobase64;
      }
      return '';
    }
  }
  private async saveImage(photo: Photo, type: 'before' | 'after') {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);
    const fileName = `${type}_${new Date().getTime()}.jpeg`;
    const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      directory: Directory.Data,
      data: base64Data
    });
    console.log('save file', savedFile);
  }

  public async loadFiles() {
    try {
      const readFiles = await Filesystem.readdir({
        directory: Directory.Data,
        path: IMAGE_DIR ?? 'storagePhotosImageDir'
      });
      console.log('loadFiles', readFiles);
      await this.loadFileData(readFiles.files);
    } catch (error) {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR ?? 'storagePhotosImageDir'
      });
    }
  }
  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      if (reader.error) {
        reject(reader.error);
      } else {
        reader.readAsDataURL(blob);
        reader.onload = () => {
          resolve(reader.result);
        };
      }
    });
}
