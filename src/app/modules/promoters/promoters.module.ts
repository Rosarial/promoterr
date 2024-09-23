import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromotersPageRoutingModule } from './promoters-routing.module';

import { PromotersPage } from './promoters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromotersPageRoutingModule
  ],
  declarations: [PromotersPage]
})
export class PromotersPageModule {}
