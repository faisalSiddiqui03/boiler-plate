import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailsWidgetModule } from '@cap-widget/order-details-widget';
import { IonicModule } from '@ionic/angular';

import { SuccessPage } from './success.page';
import { HeaderModule } from '../../../components/header/header.module';
import { TranslateModule } from '@capillarytech/pwa-framework';

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
    HeaderModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [SuccessPage]
})
export class SuccessPageModule {}
