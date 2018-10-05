import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsComponent } from './product-details.component';

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
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    AlertServiceModule,
    EventTrackModule,
    SkeletonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [ProductDetailsComponent],
  exports: [ProductDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailsComponentModule {}
