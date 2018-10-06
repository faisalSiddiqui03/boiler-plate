import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateMessageFormatCompiler } from "ngx-translate-messageformat-compiler";
import { AlertServiceModule, AlertService, LoaderServiceModule, LoaderService } from '@capillarytech/pwa-ui-helpers';
import {
  ConfigServiceModule,
  HttpService,
  CacheStorageServiceImpl,
  GlobalServiceModule,
  EventTrackModule,
  setAppInjector,
  LifecycleHandler,
  LanguageServiceModule,
  ImagePreloadModule,
  UserProfileWidgetModule,
  LogoutWidgetModule,
  FulfilmentModeModule,
  SEOModule,
  LanguageService
} from '@capillarytech/pwa-framework';
import { AuthGuard } from './auth.guard';
import { HttpLoaderFactory } from './translation.loader';
import { appConfig } from '../../config/config';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DeliverySlotSelectionModule } from './pages/checkout/delivery-slot-selection/delivery-slot-selection.module';
import { LocationPageModule } from './pages/checkout/location/location.module';
import { SearchLocationPageModule } from './pages/user/profile/search-location/search-location.module';
import { RoutingState } from './routing-state';
import { UtilService } from './helpers/utils';
import { Location } from '@angular/common';
import languages from './languages';

export function getAppConfig(): Object {
  return appConfig || {};
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    ConfigServiceModule.forRoot(getAppConfig),
    GlobalServiceModule.forRoot(),
    IonicStorageModule.forRoot(),
    SEOModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FulfilmentModeModule,
    ImagePreloadModule,
    UserProfileWidgetModule,
    LogoutWidgetModule,
    DeliverySlotSelectionModule,
    LocationPageModule,
    SearchLocationPageModule,
    EventTrackModule.forRoot([EventTrackModule.Tracker.GTM]),
    LanguageServiceModule.forRoot(languages),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    }),
    LoaderServiceModule,
    AlertServiceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    CacheStorageServiceImpl,
    HttpService,
    SplashScreen,
    LifecycleHandler,
    Geolocation,
    AuthGuard,
    HttpClientModule,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    AlertService,
    LoaderService,
    RoutingState,
    UtilService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(injector: Injector,
    private utilService: UtilService,
    languageService: LanguageService) {
    setAppInjector(injector);
    const locationUrl = window.location.pathname;
    if (locationUrl.startsWith('/ar')) {
      languageService.initialize('ar');
      this.utilService.setLanguageCode('ar');
    } else if (locationUrl.startsWith('/en')) {
      languageService.initialize('en');
      this.utilService.setLanguageCode('en');
    } else {
      languages.forEach((lang) => {
        if (lang.isDefault) {
          languageService.initialize(lang.code);
          this.utilService.setLanguageCode(lang.code);
        }
      })
    }
  }
}
