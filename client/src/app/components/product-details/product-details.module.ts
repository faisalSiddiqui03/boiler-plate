import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { ProductDetailsComponent } from './product-details.component';
import { ProductDetailsWidgetModule, ImagePreloadModule, EventTrackServiceModule} from "@capillarytech/pwa-framework";
import { AlertServiceModule, HardWareServiceModule } from '@capillarytech/pwa-ui-helpers';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { StoreSelectionModalModule } from '../store-selection-modal/store-selection-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    AlertServiceModule,
    HardWareServiceModule,
    StoreSelectionModalModule,
    EventTrackServiceModule,
    SkeletonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
    StoreSelectionModalComponent,
  ],
  declarations: [ProductDetailsComponent],
  exports: [ProductDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponentModule {
}
