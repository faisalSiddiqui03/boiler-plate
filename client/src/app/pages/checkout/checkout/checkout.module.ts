import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {
  DeliverySlotsWidgetModule,
  PaymentOptionsWidgetModule,
  CheckoutWidgetModule,
  EventTrackServiceModule,
  EventTrackWidgetModule,
  CapRouterServiceModule
} from '@capillarytech/pwa-framework';
import { UserAddressWidgetModule } from '@cap-widget/user-address';
import { CheckoutPage } from './checkout.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from '../../../components/header/header.module';
import { SubHeaderModule } from '../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckoutWidgetModule,
    EventTrackServiceModule,
    EventTrackWidgetModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    DeliverySlotsWidgetModule,
    PaymentOptionsWidgetModule,
    UserAddressWidgetModule,
    CapRouterServiceModule,
    TranslateModule
  ],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
