import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddAddressPage } from './add-address.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../../../translation.loader';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { LocationMapModule } from '../../../../components/location-map/location-map.module';
import { UserAddressWidgetModule } from '@capillarytech/pwa-framework';

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
  declarations: [AddAddressPage]
})
export class AddAddressPageModule { }
