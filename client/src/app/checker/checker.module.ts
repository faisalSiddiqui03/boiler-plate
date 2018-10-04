import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LanguageService } from '@capillarytech/pwa-framework';
import { IonicModule } from '@ionic/angular';

import { CheckerPage } from './checker.page';

const routes: Routes = [
  {
    path: '',
    component: CheckerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckerPage]
})
export class CheckerPageModule { }
