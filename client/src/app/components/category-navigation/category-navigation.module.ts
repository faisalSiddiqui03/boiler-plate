import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavigationWidgetModule, EventTrackModule } from "@capillarytech/pwa-framework";
import { CategoryNavigationComponent } from './category-navigation.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../translation.loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavigationWidgetModule,
    EventTrackModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    CategoryNavigationComponent
  ],
  exports: [
    CategoryNavigationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class CategoryNavigationModule {
}
