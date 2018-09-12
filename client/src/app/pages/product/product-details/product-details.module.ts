import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImagePreloadModule, ProductDetailsWidgetModule } from '@capillarytech/pwa-framework';
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ProductDetailsPage } from './product-details.page';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../../helpers/skeleton/skeleton.module';

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
    SkeletonModule,
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AlertServiceModule,
    LoaderServiceModule,
  ],
  providers: [
    AlertService,
    LoaderService,
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {
}
