import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPage } from './order-details.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { OrderDetailsWidgetModule } from '@cap-widget/order-details-widget';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    OrderDetailsWidgetModule,
    TranslateModule
  ],
  declarations: [OrderDetailsPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderDetailsPageModule {}
