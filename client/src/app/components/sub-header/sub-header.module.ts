import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SubHeaderComponent } from './sub-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    SubHeaderComponent,
  ],
  exports: [
    SubHeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class SubHeaderModule {
}
