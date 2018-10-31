import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../../../components/header/header.module';
import { PasswordResetPage } from './password-reset.page';
import { ForgotPasswordWidgetModule } from '@cap-widget/authentication/forgot-password';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';

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
    SubHeaderModule,
    ForgotPasswordWidgetModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule {}
