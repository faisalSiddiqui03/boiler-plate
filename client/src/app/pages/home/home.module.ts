import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { BannerModule } from '../../components/banner/banner.module';
import { FooterModule } from '../../components/footer/footer.module';
import { HeaderModule } from '../../components/header/header.module';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  LocationWidgetModule,
  FulfilmentModeModule,
  StoreLocatorWidgetModule,
  CartWidgetModule, SEOModule,
} from '@capillarytech/pwa-framework';
import { EventTrackServiceModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { BannerWidgetModule } from '@cap-widget/banner-widget';
import { AppStoreSelectionModule } from '../../components/store-selection/store-selection.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BannerModule,
    IonicModule,
    RouterModule.forChild(routes),
    FooterModule,
    HeaderModule,
    SkeletonModule,
    LocationWidgetModule,
    BannerWidgetModule,
    EventTrackServiceModule,
    ImagePreloadModule,
    AppStoreSelectionModule,
    FulfilmentModeModule,
    StoreLocatorWidgetModule,
    CartWidgetModule,
    SEOModule,
    TranslateModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {
}
