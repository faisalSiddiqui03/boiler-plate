import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { StoreSelectionModalModule } from '../store-selection-modal/store-selection-modal.module';
import { DealComponent } from './deal.component';
import { ImagePreloadModule, EventTrackServiceModule} from '@capillarytech/pwa-framework';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { DealShowcaseComponentModule } from '../deal-showcase/deal-showcase.module';
import { DealShowcaseComponent } from '../deal-showcase/deal-showcase.component';
import { HeaderModule } from '../header/header.module';
import { SubHeaderModule } from '../sub-header/sub-header.module';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { TrioComponent } from '../trio/trio.component';
import { TrioComponentModule } from '../trio/trio.module';
import { ProductDetailsWidgetModule } from '@cap-widget/product-details';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EventTrackServiceModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    SkeletonModule,
    HeaderModule,
    SubHeaderModule,
    DealShowcaseComponentModule,
    TrioComponentModule,
    StoreSelectionModalModule,
    TranslateModule
  ],
  declarations: [DealComponent],
  exports: [DealComponent],
  entryComponents: [
    DealShowcaseComponent,
    ProductDetailsComponent,
    TrioComponent,
    StoreSelectionModalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DealComponentModule {}
