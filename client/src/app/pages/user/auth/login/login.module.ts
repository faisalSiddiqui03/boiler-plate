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
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService } from '@capillarytech/pwa-ui-helpers';
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [LoginPage],
  providers: [
    AlertService,
    LoaderService
  ]
})
export class LoginPageModule { }
