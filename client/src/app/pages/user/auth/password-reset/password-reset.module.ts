import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../../../components/header/header.module';
import { HttpLoaderFactory } from '../../../../translation.loader';
import { PasswordResetPage } from './password-reset.page';
import { ForgotPasswordWidgetModule } from '@capillarytech/pwa-framework';
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [PasswordResetPage]
})
export class PasswordResetPageModule {}
