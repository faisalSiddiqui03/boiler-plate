import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EventTrackServiceModule, ImagePreloadModule } from '@capillarytech/pwa-framework';
import { BannerComponent } from './banner.component';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { TranslateModule } from '@ngx-translate/core';
import { BannerWidgetModule } from '@cap-widget/banner-widget';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BannerWidgetModule,
    EventTrackServiceModule,
    ImagePreloadModule,
    SkeletonModule,
    TranslateModule
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
