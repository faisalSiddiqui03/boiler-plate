import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PizzaComponent } from '../../components/pizza/pizza.component';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { PizzaComponentModule } from '../../components/pizza/pizza.module';
import { ProductDetailsComponentModule } from '../../components/product-details/product-details.module';

@NgModule({
  imports: [
    PizzaComponentModule,
    ProductDetailsComponentModule
  ],
  entryComponents: [
    ProductDetailsComponent,
    PizzaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductModalModule {
}
