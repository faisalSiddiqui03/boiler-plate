import { HttpClient } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { CartComponent } from './cart.component';

import { CartWidgetModule, VoucherWidgetModule, ImagePreloadModule, EventTrackModule } from '@capillarytech/pwa-framework';
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService, DebounceClickDirective } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { ProductDetailsComponentModule } from '../../components/product-details/product-details.module';
import { PizzaComponentModule } from '../../components/pizza/pizza.module';
import { PizzaComponent } from '../../components/pizza/pizza.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartWidgetModule,
    VoucherWidgetModule,
    ImagePreloadModule,
    EventTrackModule,
    DebounceClickDirective,
    ProductDetailsComponentModule,
    PizzaComponentModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    CartComponent,
  ],
  providers: [
    AlertService,
    LoaderService,
  ],
  exports: [
    CartComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ProductDetailsComponent,
    PizzaComponent,
  ]
})

export class CartComponentModule {
}
