import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StoreListComponent } from '../store-list/store-list.component';
import { SelectionComponent } from './store-selection.component';
import {
  EventTrackServiceModule,
  ImagePreloadModule,
  FulfilmentModeModule,
} from '@capillarytech/pwa-framework';
import { CartWidgetModule } from '@cap-widget/cart';
import { LocationWidgetModule } from '@cap-widget/location';
import { BannerWidgetModule } from '@cap-widget/banner-widget';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { StoreListModule } from '../store-list/store-list.module';
import { BannerModule } from '../banner/banner.module';
import { StoreLocatorWidgetModule } from '@cap-widget/store-locator';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BannerWidgetModule,
    FulfilmentModeModule,
    StoreListModule,
    LocationWidgetModule,
    StoreLocatorWidgetModule,
    EventTrackServiceModule,
    FormsModule,
    CartWidgetModule,
    ImagePreloadModule,
    SkeletonModule,
    BannerModule,
    TranslateModule
  ],
  declarations: [
    SelectionComponent,
  ],
  exports: [
    SelectionComponent
  ],
  entryComponents: [
    StoreListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppStoreSelectionModule {
}
