import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoreSelectionPage } from './store-selection.page';
import { HeaderModule } from '../../../components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { StoreLocatorWidgetModule } from '@cap-widget/store-locator';
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
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [StoreSelectionPage]
})
export class StoreSelectionPageModule {
}
