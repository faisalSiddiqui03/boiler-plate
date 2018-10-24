import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StoreListComponent } from '../store-list/store-list.component';
import { StoreSelectionComponent } from './store-selection.component';
import {
  BannerWidgetModule,
  CartWidgetModule,
  EventTrackServiceModule,
  ImagePreloadModule,
  FulfilmentModeModule,
  LocationWidgetModule,
  StoreLocatorWidgetModule
} from '@capillarytech/pwa-framework';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { StoreListModule } from '../store-list/store-list.module';
import { BannerModule } from '../banner/banner.module';

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
    TranslateModule,
  ],
  declarations: [
    StoreSelectionComponent,
  ],
  exports: [
    StoreSelectionComponent
  ],
  entryComponents: [
    StoreListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppStoreSelectionModule {
}
