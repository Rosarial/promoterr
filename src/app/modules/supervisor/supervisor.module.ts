import { NgModule } from '@angular/core';

import { SupervisorPageRoutingModule } from './supervisor-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { SupervisorPage } from './supervisor.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, SupervisorPageRoutingModule],
  declarations: [SupervisorPage]
})
export class SupervisorPageModule {}
