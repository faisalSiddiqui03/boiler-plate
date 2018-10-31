import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {
  EventTrackServiceModule,
  EventTrackWidgetModule,
  CapRouterServiceModule
} from '@capillarytech/pwa-framework';
import { CheckoutWidgetModule } from '@cap-widget/dummy-checkout-widget';
import { PaymentOptionsWidgetModule } from '@cap-widget/payment-options';

import { UserAddressWidgetModule } from '@cap-widget/user-address';
import { CheckoutPage } from './checkout.page';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { HeaderModule } from '../../../components/header/header.module';
import { SubHeaderModule } from '../../../components/sub-header/sub-header.module';
import { DeliverySlotsWidgetModule } from '@cap-widget/delivery-slots';
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
