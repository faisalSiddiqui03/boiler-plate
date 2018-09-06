import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../../../components/header/header.module';
import { PasswordResetPage } from './password-reset.page';
import { ForgotPasswordWidgetModule } from '@capillarytech/pwa-framework';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderModule,
    ForgotPasswordWidgetModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule {}
