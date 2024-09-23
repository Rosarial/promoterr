import { NgModule } from '@angular/core';

import { NotificationPageRoutingModule } from './notifications-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { NotificationPage } from './notifications.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, NotificationPageRoutingModule],
  declarations: [NotificationPage]
})
export class NotificationPageModule {}
