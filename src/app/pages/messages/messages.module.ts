import { NgModule } from '@angular/core';

import { MessagePageRoutingModule } from './messages-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { MessagePage } from './messages.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, MessagePageRoutingModule],
  declarations: [MessagePage]
})
export class MessagePageModule {}
