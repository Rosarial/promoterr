import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MessagePage } from './messages.page';

const routes: Routes = [
  {
    path: '',
    component: MessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagePageRoutingModule {}
