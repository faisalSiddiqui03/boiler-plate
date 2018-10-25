import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NavigationWidgetModule } from '@cap-widget/navigation-widget';
import {
  ImagePreloadModule,
  DeliverySlotsWidgetModule,
  EventTrackServiceModule,
  SeoInfoWidgetModule
} from '@capillarytech/pwa-framework';
import { CartComponentModule } from '../../../components/cart/cart.component.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryListingPage } from './category-listing.page';
import { HeaderModule } from '../../../components/header/header.module';

import { SkeletonModule } from '../../../helpers/skeleton/skeleton.module';
import { ProductShowcaseWidgetModule } from '@cap-widget/product-showcase';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    SkeletonModule,
    ImagePreloadModule,
    EventTrackServiceModule,
    NavigationWidgetModule,
    RouterModule.forChild(routes),
    CartComponentModule,
    ProductShowcaseWidgetModule,
    DeliverySlotsWidgetModule,
    SeoInfoWidgetModule,
    TranslateModule,
    IonicModule,
  ],
  declarations: [CategoryListingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryListingPageModule {
}
