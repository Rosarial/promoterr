import { NgModule } from '@angular/core';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { ProfilePage } from './profile.page';

@NgModule({
  imports: [SharedModule, ComponentsModule, ProfilePageRoutingModule],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
