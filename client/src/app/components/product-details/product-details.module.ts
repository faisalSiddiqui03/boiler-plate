import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { ProductDetailsComponent } from './product-details.component';
import { ImagePreloadModule, EventTrackServiceModule} from '@capillarytech/pwa-framework';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { StoreSelectionModalModule } from '../store-selection-modal/store-selection-modal.module';
import {
    ProductDetailsWidgetModule,
} from '@cap-widget/product-details';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    StoreSelectionModalModule,
    EventTrackServiceModule,
    SkeletonModule,
    TranslateModule
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
