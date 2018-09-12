import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PizzaPage } from './pizza.page';

import { ProductDetailsWidgetModule, ImagePreloadModule } from "@capillarytech/pwa-framework";

import { AlertServiceModule } from '@capillarytech/pwa-ui-helpers';

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
    ProductDetailsWidgetModule,
    ImagePreloadModule,
    AlertServiceModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PizzaPage]
})
export class PizzaPageModule {}
