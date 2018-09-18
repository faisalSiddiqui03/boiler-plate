import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LocationMapComponent } from './location-map.component';
import { AgmCoreModule } from '@agm/core';
import { appConfig } from '../../../../config/config';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgmCoreModule.forRoot({
      apiKey: appConfig.googleMapsApiKey
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    LocationMapComponent,
  ],
  exports: [
    LocationMapComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class LocationMapModule {
}
