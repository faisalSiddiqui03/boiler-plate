import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeliverySlotSelectionPage } from './delivery-slot-selection.page';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { DeliverySlotsWidgetModule } from '@cap-widget/delivery-slots';
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
    TranslateModule
  ],
  declarations: [DeliverySlotSelectionPage]
})
export class DeliverySlotSelectionModule {
}
