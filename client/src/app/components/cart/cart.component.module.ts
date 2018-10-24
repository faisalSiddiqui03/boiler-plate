import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CartComponent } from './cart.component';

import { CartWidgetModule, VoucherWidgetModule, ImagePreloadModule, EventTrackServiceModule,
    SuggestionsWidgetModule } from '@capillarytech/pwa-framework';
import { DebounceClickDirective } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { ProductDetailsComponentModule } from '../../components/product-details/product-details.module';
import { PizzaComponentModule } from '../../components/pizza/pizza.module';
import { PizzaComponent } from '../../components/pizza/pizza.component';
import { DealComponentModule } from '../../components/deal/deal.module';
import { DealComponent } from '../../components/deal/deal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartWidgetModule,
    VoucherWidgetModule,
    ImagePreloadModule,
    EventTrackServiceModule,
    DebounceClickDirective,
    ProductDetailsComponentModule,
    PizzaComponentModule,
    DealComponentModule,
    SuggestionsWidgetModule,
    TranslateModule
  ],
  declarations: [
    CartComponent,
  ],
  exports: [
    CartComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ProductDetailsComponent,
    PizzaComponent,
    DealComponent,
  ]
})

export class CartComponentModule {
}
