import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '@guards/pending-checkin.guard';
import { CheckinPage } from './checkin.page';

const routes: Routes = [
  {
    path: '',
    component: CheckinPage,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckinPageRoutingModule {}
