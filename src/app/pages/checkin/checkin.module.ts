import { NgModule } from '@angular/core';

import { CheckinPageRoutingModule } from './checkin-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { CheckinPage } from './checkin.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, CheckinPageRoutingModule],
  declarations: [CheckinPage]
})
export class CheckinPageModule {}
