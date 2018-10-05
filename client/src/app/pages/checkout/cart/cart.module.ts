import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CartWidgetModule, VoucherWidgetModule, ImagePreloadModule, EventTrackModule } from '@capillarytech/pwa-framework';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../../translation.loader';
import { CartPage } from './cart.page';
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService, DebounceClickDirective } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../../../components/product-details/product-details.component';
import { ProductDetailsComponentModule } from '../../../components/product-details/product-details.module';
import { PizzaComponentModule } from '../../../components/pizza/pizza.module';
import { PizzaComponent } from '../../../components/pizza/pizza.component';

const routes: Routes = [
  {
    path: '',
    component: CartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventTrackModule,
    CartWidgetModule,
    VoucherWidgetModule,
    ImagePreloadModule,
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
    RouterModule.forChild(routes)
  ],
  declarations: [CartPage],
  providers: [
    AlertService,
    LoaderService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ProductDetailsComponent,
    PizzaComponent,
  ]
})
export class CartPageModule {}
