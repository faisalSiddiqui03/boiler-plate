import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { StoreSelectionModalModule } from '../store-selection-modal/store-selection-modal.module';

import { DealComponent } from './deal.component';

import { ProductDetailsWidgetModule, ImagePreloadModule, EventTrackServiceModule} from "@capillarytech/pwa-framework";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { DealShowcaseComponentModule } from '../deal-showcase/deal-showcase.module';
import { DealShowcaseComponent } from '../deal-showcase/deal-showcase.component';
import { HeaderModule } from '../header/header.module';
import { SubHeaderModule } from '../sub-header/sub-header.module';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { TrioComponent } from '../trio/trio.component';
import { TrioComponentModule } from '../trio/trio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [DealComponent],
  exports: [DealComponent],
  entryComponents: [
    DealShowcaseComponent,
    ProductDetailsComponent,
    TrioComponent,
    StoreSelectionModalComponent,
  ]
})
export class DealComponentModule {}
