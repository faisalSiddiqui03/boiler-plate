import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeliverySlotSelectionPage } from './delivery-slot-selection.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { DeliverySlotsWidgetModule } from "@capillarytech/pwa-framework";
import { SkeletonModule } from '../../../helpers/skeleton/skeleton.module';

const routes: Routes = [
  {
    path: '',
    component: DeliverySlotSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkeletonModule,
    DeliverySlotsWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [DeliverySlotSelectionPage]
})
export class DeliverySlotSelectionModule {
}
