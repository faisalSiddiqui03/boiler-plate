import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailsWidgetModule } from "@capillarytech/pwa-framework";
import { IonicModule } from '@ionic/angular';

import { SuccessPage } from './success.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsWidgetModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessPage]
})
export class SuccessPageModule {}
