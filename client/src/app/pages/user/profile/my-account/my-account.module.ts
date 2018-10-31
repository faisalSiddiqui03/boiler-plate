import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../../../components/header/header.module';
import { MyAccountPage } from './my-account.page';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { LogoutWidgetModule } from '@cap-widget/authentication/logout';

const routes: Routes = [
  {
    path: '',
    component: MyAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    SubHeaderModule,
    LogoutWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}
