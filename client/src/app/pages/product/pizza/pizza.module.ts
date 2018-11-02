import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PizzaPage } from './pizza.page';

import { TranslateModule  } from '@capillarytech/pwa-framework';
import { PizzaComponentModule } from '../../../components/pizza/pizza.module';

const routes: Routes = [
  {
    path: '',
    component: PizzaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PizzaComponentModule,
    RouterModule.forChild(routes),
    TranslateModule
  ],
  declarations: [PizzaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PizzaPageModule {}
