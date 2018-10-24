import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { HeaderModule } from '../../../../components/header/header.module';
import { UseridPasswordSigninWidgetModule, EventTrackServiceModule, GoogleSigninWidgetModule } from '@capillarytech/pwa-framework';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HeaderModule,
    SubHeaderModule,
    RouterModule.forChild(routes),
    EventTrackServiceModule,
    GoogleSigninWidgetModule,
    UseridPasswordSigninWidgetModule,
    TranslateModule
  ],
  declarations: [LoginPage],
})
export class LoginPageModule { }
