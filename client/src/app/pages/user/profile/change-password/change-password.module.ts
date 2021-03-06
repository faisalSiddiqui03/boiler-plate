import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPage } from './change-password.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';
import { ResetPasswordWidgetModule } from '@cap-widget/authentication/reset-password';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    ResetPasswordWidgetModule,
    TranslateModule
  ],
  declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {}
