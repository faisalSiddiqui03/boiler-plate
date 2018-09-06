import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DealerSelectionPage } from './dealer-selection.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { DeliverySlotsWidgetModule } from "@capillarytech/pwa-framework";
=======
>>>>>>> cadc1a8dca0517f68e8090b48b5e697369f2ef62

const routes: Routes = [
  {
    path: '',
    component: DealerSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
    DeliverySlotsWidgetModule,
=======
>>>>>>> cadc1a8dca0517f68e8090b48b5e697369f2ef62
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [DealerSelectionPage]
})
export class DealerSelectionPageModule {}
