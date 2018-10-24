import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CartPage } from './cart.page';
import { CartComponentModule } from '../../../components/cart/cart.component.module';

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
    CartComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CartPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartPageModule {}
