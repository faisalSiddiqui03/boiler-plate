import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DealComponent } from './deal.component';

import { ProductDetailsWidgetModule, ImagePreloadModule, EventTrackModule } from "@capillarytech/pwa-framework";

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { DealShowcaseComponentModule } from '../../components/deal-showcase/deal-showcase.module';
import { DealShowcaseComponent } from '../../components/deal-showcase/deal-showcase.component';
import { HeaderModule } from '../../components/header/header.module';
import { SubHeaderModule } from '../../components/sub-header/sub-header.module';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { TrioComponent } from '../../components/trio/trio.component';
import { TrioComponentModule } from '../../components/trio/trio.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventTrackModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    SkeletonModule,
    HeaderModule,
    SubHeaderModule,
    DealShowcaseComponentModule,
    TrioComponentModule,
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
  ]
})
export class DealComponentModule {}
