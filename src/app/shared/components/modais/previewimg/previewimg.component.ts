import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-previewimg',
  templateUrl: './previewimg.component.html',
  styleUrls: ['./previewimg.component.scss']
})
export class PreviewimgComponent {
  @Input() props: {
    img: string;
    title: string;
    description: string;
  } = {
    img: '',
    title: '',
    description: ''
  };

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
