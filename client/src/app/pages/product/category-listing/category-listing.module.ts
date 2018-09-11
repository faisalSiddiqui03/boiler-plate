import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NavigationWidgetModule, ProductShowcaseWidgetModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { CartComponentModule } from '../../../components/cart/cart.component.module';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CategoryListingPage } from './category-listing.page';
import { HeaderModule } from '../../../components/header/header.module';
// import { CartModule } from '../../../components/cart/cart.module';
import { SkeletonModule } from '../../../helpers/skeleton/skeleton.module';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    SkeletonModule,
    ImagePreloadModule,
    NavigationWidgetModule,
    CartComponentModule,
    ProductShowcaseWidgetModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryListingPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryListingPageModule {
}
