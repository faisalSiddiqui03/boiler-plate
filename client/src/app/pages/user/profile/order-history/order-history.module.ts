import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrderHistoryPage } from './order-history.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { OrderWidgetModule } from '@cap-widget/order-widget';

const routes: Routes = [
  {
    path: '',
    component: OrderHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SubHeaderModule,
    OrderWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [OrderHistoryPage]
})
export class OrderHistoryPageModule {}
