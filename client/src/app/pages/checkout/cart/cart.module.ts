import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CartWidgetModule, VoucherWidgetModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../../translation.loader';
import { CartPage } from './cart.page';
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService, DebounceClickDirective } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../../../components/product-details/product-details.component';
import { ProductDetailsComponentModule } from '../../../components/product-details/product-details.module';

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
    CartWidgetModule,
    VoucherWidgetModule,
    ImagePreloadModule,
    DebounceClickDirective,
    ProductDetailsComponentModule,
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
    ProductDetailsComponent
  ]
})
export class CartPageModule {}
