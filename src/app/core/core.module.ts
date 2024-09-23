import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { httpInterceptorProviders } from './interceptors';

@NgModule({
  imports: [
    BrowserModule,
    // BrowserAnimationsModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),

    HttpClientModule,
    SharedModule
  ],
  providers: [
    ...httpInterceptorProviders,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  exports: [BrowserModule, IonicModule, SharedModule]
})
export class CoreModule {}
