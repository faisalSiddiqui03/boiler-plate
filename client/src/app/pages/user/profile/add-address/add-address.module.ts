import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddAddressPage } from './add-address.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { LocationMapModule } from '../../../../components/location-map/location-map.module';
import { UserAddressWidgetModule } from '@cap-widget/user-address';
const routes: Routes = [
  {
    path: '',
    component: AddAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderModule,
    SubHeaderModule,
    LocationMapModule,
    UserAddressWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [AddAddressPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddAddressPageModule { }
