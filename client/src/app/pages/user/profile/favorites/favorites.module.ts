import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesWidgetModule, ImagePreloadModule } from '@capillarytech/pwa-framework';

import { IonicModule } from '@ionic/angular';
import { SkeletonModule } from '../../../../helpers/skeleton/skeleton.module';

import { FavoritesPage } from './favorites.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../../../translation.loader';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { PizzaComponent } from '../../../../components/pizza/pizza.component';
import { ProductDetailsComponent } from '../../../../components/product-details/product-details.component';
import { PizzaComponentModule } from '../../../../components/pizza/pizza.module';
import { ProductDetailsComponentModule } from '../../../../components/product-details/product-details.module';

const routes: Routes = [
  {
    path: '',
    component: FavoritesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    FavoritesWidgetModule,
    ImagePreloadModule,
    SkeletonModule,
    ProductDetailsComponentModule,
    PizzaComponentModule,
    TranslateModule
  ],
  declarations: [FavoritesPage],
  entryComponents: [
    ProductDetailsComponent,
    PizzaComponent,
  ]
})
export class FavoritesPageModule {}
