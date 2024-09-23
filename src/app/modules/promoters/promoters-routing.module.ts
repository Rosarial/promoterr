import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotersPage } from './promoters.page';

const routes: Routes = [
  {
    path: '',
    component: PromotersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotersPageRoutingModule {}
