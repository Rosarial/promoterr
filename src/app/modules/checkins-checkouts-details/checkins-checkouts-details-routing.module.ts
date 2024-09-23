import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinsCheckoutsDetailsPage } from './checkins-checkouts-details.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinsCheckoutsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinsCheckoutsDetailsPageRoutingModule {}
