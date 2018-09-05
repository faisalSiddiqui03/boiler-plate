import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { BannerModule } from '../../components/banner/banner.module';
import { FooterModule } from '../../components/footer/footer.module';
import { HeaderModule } from '../../components/header/header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { LocationWidgetModule } from '@capillarytech/pwa-framework';
import { BannerWidgetModule, EventTrackModule, ImagePreloadModule } from '@capillarytech/pwa-framework';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BannerModule,
    IonicModule,
    RouterModule.forChild(routes),
    FooterModule,
    HeaderModule,
    LocationWidgetModule,
    BannerWidgetModule,
    EventTrackModule,
    ImagePreloadModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
