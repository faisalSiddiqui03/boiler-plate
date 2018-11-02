import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocationPage } from './location.page';
import { LocationMapModule } from '../../../components/location-map/location-map.module';
import { TranslateModule } from '@capillarytech/pwa-framework';

const routes: Routes = [
  {
    path: '',
    component: LocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationMapModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [LocationPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocationPageModule {}
