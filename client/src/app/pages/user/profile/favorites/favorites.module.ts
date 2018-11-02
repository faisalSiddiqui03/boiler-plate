import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImagePreloadModule } from '@capillarytech/pwa-framework';
import { FavoritesWidgetModule } from '@cap-widget/favorites';
import { IonicModule } from '@ionic/angular';
import { SkeletonModule } from '../../../../helpers/skeleton/skeleton.module';

import { FavoritesPage } from './favorites.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { ProductModalModule, ProductModalService } from '../../../../helpers/product-modal';

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
    TranslateModule,
    ProductModalModule
  ],
  declarations: [FavoritesPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ProductModalService
  ]
})
export class FavoritesPageModule {}
