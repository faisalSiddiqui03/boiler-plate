import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImagePreloadModule } from '@capillarytech/pwa-framework';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { ProductDetailsPage } from './product-details.page';
import { ProductDetailsComponentModule } from '../../../components/product-details/product-details.module';
import { ProductDetailsWidgetModule } from '@cap-widget/product-details';
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
    TranslateModule,
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {
}
