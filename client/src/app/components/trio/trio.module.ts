import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { StoreSelectionModalModule } from '../store-selection-modal/store-selection-modal.module';
import { TrioComponent } from './trio.component';
import { ProductDetailsWidgetModule, ImagePreloadModule, EventTrackModule } from "@capillarytech/pwa-framework";
import { AlertServiceModule } from '@capillarytech/pwa-ui-helpers';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventTrackModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    AlertServiceModule,
    StoreSelectionModalModule,
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
  declarations: [TrioComponent],
  exports: [TrioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrioComponentModule {}
