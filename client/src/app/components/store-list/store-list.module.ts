import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StoreListComponent } from './store-list.component';
import { BannerWidgetModule, CartWidgetModule, EventTrackServiceModule, ImagePreloadModule, FulfilmentModeModule, LocationWidgetModule, StoreLocatorWidgetModule } from '@capillarytech/pwa-framework';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { HeaderModule } from '../header/header.module';
import { SubHeaderModule } from '../sub-header/sub-header.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BannerWidgetModule,
    FulfilmentModeModule,
    LocationWidgetModule,
    StoreLocatorWidgetModule,
    HeaderModule,
    EventTrackServiceModule,
    FormsModule,
    CartWidgetModule,
    ImagePreloadModule,
    SubHeaderModule,
    TranslateModule,
  ],
  declarations: [
    StoreListComponent,
  ],
  exports: [
    StoreListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class StoreListModule {
}
