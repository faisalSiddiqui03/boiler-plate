import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StoreSelectionComponent } from './store-selection.component';
import { BannerWidgetModule, CartWidgetModule, EventTrackModule, ImagePreloadModule, FulfilmentModeModule, LocationWidgetModule, StoreLocatorWidgetModule } from '@capillarytech/pwa-framework';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { LoaderServiceModule } from '@capillarytech/pwa-ui-helpers';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BannerWidgetModule,
    FulfilmentModeModule,
    LocationWidgetModule,
    StoreLocatorWidgetModule,
    EventTrackModule,
    FormsModule,
    CartWidgetModule,
    ImagePreloadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    StoreSelectionComponent,
  ],
  exports: [
    StoreSelectionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AppStoreSelectionModule {
}
