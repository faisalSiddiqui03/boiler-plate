import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { HeaderModule } from '../../../../components/header/header.module';
import { EventTrackServiceModule} from '@capillarytech/pwa-framework';
import { UseridSignupWidgetModule } from '@cap-widget/authentication/userid-signup';
import { SignupPage } from './signup.page';
import { SubHeaderModule } from '../../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
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
    UseridSignupWidgetModule,
    EventTrackServiceModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [SignupPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SignupPageModule {}
