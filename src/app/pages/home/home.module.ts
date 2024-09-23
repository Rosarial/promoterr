import { NgModule } from '@angular/core';

import { HomePageRoutingModule } from './home-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, HomePageRoutingModule],
  declarations: [HomePage]
})
export class HomePageModule {}
