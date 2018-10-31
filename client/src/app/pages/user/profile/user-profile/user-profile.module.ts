import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserProfilePage } from './user-profile.page';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { HeaderModule } from '../../../../components/header/header.module';
import { UserProfileWidgetModule } from '@cap-widget/user-profile';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    UserProfileWidgetModule,
    HeaderModule,
    SubHeaderModule,
    TranslateModule
  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule { }
