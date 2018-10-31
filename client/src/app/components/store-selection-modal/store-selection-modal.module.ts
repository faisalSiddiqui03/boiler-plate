import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StoreSelectionModalComponent } from './store-selection-modal.component';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { HttpLoaderFactory } from '../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { SkeletonModule } from '../../helpers/skeleton/skeleton.module';
import { AppStoreSelectionModule } from '../store-selection/store-selection.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SkeletonModule,
    AppStoreSelectionModule,
    TranslateModule
  ],
  declarations: [StoreSelectionModalComponent],
  exports: [StoreSelectionModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StoreSelectionModalModule {}
