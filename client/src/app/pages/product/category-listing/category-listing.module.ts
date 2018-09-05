import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NavigationWidgetModule, ProductShowcaseWidgetModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CategoryListingPage } from './category-listing.page';
import { HeaderModule } from '../../../components/header/header.module';

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
    ImagePreloadModule,
    NavigationWidgetModule,
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
