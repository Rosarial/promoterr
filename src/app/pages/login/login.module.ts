import { NgModule } from '@angular/core';

import { LoginPageRoutingModule } from './login-routing.module';

import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared/shared.module';
import { LoginPage } from './login.page';

@NgModule({
  imports: [SharedModule, LoginPageRoutingModule, ComponentsModule],
  declarations: [LoginPage]
})
export class LoginPageModule {}
