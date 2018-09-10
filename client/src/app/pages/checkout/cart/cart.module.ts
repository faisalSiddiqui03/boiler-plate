import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CartWidgetModule } from '@capillarytech/pwa-framework';

import { IonicModule } from '@ionic/angular';

import { CartPage } from './cart.page';

const routes: Routes = [
  {
    path: '',
    component: CartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartWidgetModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CartPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartPageModule {}
