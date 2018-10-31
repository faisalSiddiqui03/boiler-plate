import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SavedAddressPage } from './saved-address.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { UserAddressWidgetModule } from '@cap-widget/user-address';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: SavedAddressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SubHeaderModule,
    UserAddressWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [SavedAddressPage]
})
export class SavedAddressPageModule {}
