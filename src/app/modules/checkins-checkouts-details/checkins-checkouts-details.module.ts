import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckinsCheckoutsDetailsPageRoutingModule } from './checkins-checkouts-details-routing.module';

import { CheckinsCheckoutsDetailsPage } from './checkins-checkouts-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckinsCheckoutsDetailsPageRoutingModule
  ],
  declarations: [CheckinsCheckoutsDetailsPage]
})
export class CheckinsCheckoutsDetailsPageModule {}
