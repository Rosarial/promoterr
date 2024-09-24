import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LocalFile } from '@shared/interfaces/localfile';
import { finalize } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class UploadServiceService {
  constructor(private http: HttpClient) {}
  // Add one more import

  // Convert the base64 to blob data
  // and create  formData with it
  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    this.uploadData(formData);
  }

  // Upload the formData to our API
  async uploadData(formData: FormData) {
    // const loading = await this.loadingCtrl.create({
    //     message: 'Uploading image...',
    // });
    // await loading.present();

    // Use your own API!
    const url = 'http://localhost:8888/images/upload.php';

    this.https
      .post(url, formData)
      .pipe(
        finalize(() => {
          // loading.dismiss();
        })
      )
      .subscribe((res: any) => {
        if (res?.success) {
          return res;
          // this.presentToast('File upload complete.');
        } else {
          return null;
          // this.presentToast('File upload failed.');
        }
      });
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path
    });
    // this.loadFiles();
    // this.presentToast('File removed.');
  }
}
