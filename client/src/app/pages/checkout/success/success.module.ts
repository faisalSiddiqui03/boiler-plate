import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailsWidgetModule } from '@capillarytech/pwa-framework';
import { IonicModule } from '@ionic/angular';

import { SuccessPage } from './success.page';
import { HeaderModule } from '../../../components/header/header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: SuccessPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsWidgetModule,
    HeaderModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [SuccessPage]
})
export class SuccessPageModule {}
