import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { BannerWidgetModule, EventTrackModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { BannerComponent } from './banner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BannerWidgetModule,
    EventTrackModule,
    ImagePreloadModule
  ],
  declarations: [
    BannerComponent,
  ],
  exports: [
    BannerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class BannerModule {
}
