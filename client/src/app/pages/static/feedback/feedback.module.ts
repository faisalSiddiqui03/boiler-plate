import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {FeedbackPage} from './feedback.page';
import {TranslateModule} from '@capillarytech/pwa-framework';
import {HeaderModule} from '../../../components/header/header.module';
import {SubHeaderModule} from '../../../components/sub-header/sub-header.module';
import {SurveyWidgetModule} from '@cap-widget/survey';

const routes: Routes = [
  {
    path: '',
    component: FeedbackPage
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
    SurveyWidgetModule,
    TranslateModule
  ],
  declarations: [FeedbackPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeedbackPageModule {
}
