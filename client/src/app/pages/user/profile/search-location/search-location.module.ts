import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { SearchLocationPage } from './search-location.page';
import { LocationWidgetModule } from '@cap-widget/location';

const routes: Routes = [
  {
    path: '',
    component: SearchLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [SearchLocationPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchLocationPageModule {}
