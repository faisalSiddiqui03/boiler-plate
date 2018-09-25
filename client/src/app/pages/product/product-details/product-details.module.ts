import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImagePreloadModule, ProductDetailsWidgetModule } from '@capillarytech/pwa-framework';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ProductDetailsPage } from './product-details.page';
import { ProductDetailsComponentModule } from '../../../components/product-details/product-details.module';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    ProductDetailsComponentModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {
}
