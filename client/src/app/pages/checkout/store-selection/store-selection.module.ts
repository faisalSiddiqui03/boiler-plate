import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoreSelectionPage } from './store-selection.page';
import { HeaderModule } from '../../../components/header/header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { StoreLocatorWidgetModule } from '@capillarytech/pwa-framework';
import { SubHeaderModule } from '../../../components/sub-header/sub-header.module';
import { StoreListModule } from '../../../components/store-list/store-list.module';

const routes: Routes = [
  {
    path: '',
    component: StoreSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    StoreListModule,
    RouterModule.forChild(routes),
    StoreLocatorWidgetModule,
    SubHeaderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [StoreSelectionPage]
})
export class StoreSelectionPageModule {
}
