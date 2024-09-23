import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ButtonsCalcComponent } from './buttons-calc/buttons-calc.component';
import { CalcComponent } from './calc/calc.component';
import { DisplayComponent } from './display/display.component';
import { HeaderCustomComponent } from './header-custom/header-custom.component';
import { LogoComponent } from './logo/logo.component';
import { AddCheckoutComponent, AlertModalCustomComponent, PreviewimgComponent } from './modais';
import { UserinfoComponent } from './userinfo/userinfo.component';

const components = [
  HeaderCustomComponent,
  AlertModalCustomComponent,
  AddCheckoutComponent,
  LogoComponent,
  CalcComponent,
  DisplayComponent,
  ButtonsCalcComponent,
  PreviewimgComponent,
  UserinfoComponent
];
@NgModule({
  declarations: [...components],
  imports: [SharedModule],
  exports: [...components]
})
export class ComponentsModule {}
