import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationWidgetModule } from '@cap-widget/navigation-widget';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer.component';
import { TranslateModule } from '@capillarytech/pwa-framework';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NavigationWidgetModule,
    IonicModule,
    TranslateModule,
  ],
  declarations: [
    FooterComponent,
  ],
  exports: [
    FooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class FooterModule {
}
