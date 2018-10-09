import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import {
  DeliverySlotsWidgetModule,
  PaymentOptionsWidgetModule,
  CheckoutWidgetModule,
  UserAddressWidgetModule,
  EventTrackModule,
  CapRouterServiceModule
} from "@capillarytech/pwa-framework";
import { HardWareServiceModule } from "@capillarytech/pwa-ui-helpers"
import { CheckoutPage } from './checkout.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
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
    EventTrackModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    DeliverySlotsWidgetModule,
    PaymentOptionsWidgetModule,
    UserAddressWidgetModule,
    CapRouterServiceModule,
    HardWareServiceModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}