import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DealPage } from './deal.page';

import { ImagePreloadModule, EventTrackServiceModule} from '@capillarytech/pwa-framework';
import { ProductDetailsWidgetModule } from '@cap-widget/product-details';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { DealComponentModule } from '../../../components/deal/deal.module';

const routes: Routes = [
  {
    path: '',
    component: DealPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventTrackServiceModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    DealComponentModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [DealPage],
})
export class DealPageModule {}
