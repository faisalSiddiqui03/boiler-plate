import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DealShowcaseComponent } from './deal-showcase.component';

import { ProductDetailsWidgetModule, ImagePreloadModule } from "@capillarytech/pwa-framework";
import { PizzaComponentModule } from '../pizza/pizza.module';
import { PizzaComponent } from '../pizza/pizza.component';
import { ProductDetailsComponentModule } from '../product-details/product-details.module';
import { ProductDetailsComponent } from '../product-details/product-details.component';

import { AlertServiceModule } from '@capillarytech/pwa-ui-helpers';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { HeaderModule } from '../header/header.module';
import { SubHeaderModule } from '../sub-header/sub-header.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    AlertServiceModule,
    HeaderModule,
    SubHeaderModule,
    PizzaComponentModule,
    ProductDetailsComponentModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [DealShowcaseComponent],
  exports: [DealShowcaseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    PizzaComponent,
    ProductDetailsComponent,
  ]
})
export class DealShowcaseComponentModule {}
