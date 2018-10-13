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
import {
  AlertService,
  AlertServiceModule,
  LoaderService,
  LoaderServiceModule,
  HardWareServiceModule
} from '@capillarytech/pwa-ui-helpers';
import {
  ConfigServiceModule,
  HttpService,
  CacheStorageServiceImpl,
  GlobalServiceModule,
  EventTrackServiceModule,
  EventTrackWidgetModule,
  setAppInjector,
  LifecycleHandler,
  LanguageServiceModule,
  ImagePreloadModule,
  UserProfileWidgetModule,
  LogoutWidgetModule,
  FulfilmentModeModule,
  SEOModule,
  LanguageService,
  AppUpdateServiceModule,
  AppUpdateServiceImpl,
  CapRouterService,
  ServiceWorkerModule as PWAServiceWorkerModule
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

export const languages = [
  {
    name: 'English',
    code: 'en',
    isDefault: false,
    alignment: 'ltr'
  },
  {
    name: 'Arabic',
    code: 'ar',
    isDefault: true,
    alignment: 'rtl'
  }
];

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
    IonicModule.forRoot({mode: 'md'}),
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
    EventTrackServiceModule.forRoot([EventTrackServiceModule.Tracker.GTM]),
    EventTrackWidgetModule,
    CapRouterServiceModule,
    AppUpdateServiceModule,
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
    AlertServiceModule,
    LoaderServiceModule,
    HardWareServiceModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    PWAServiceWorkerModule.forRoot()
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
    RoutingState,
    UtilService,
    AppUpdateServiceImpl
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(injector: Injector,
    private utilService: UtilService,
    private capRouterService: CapRouterService,
    languageService: LanguageService) {
    setAppInjector(injector);
    const locationUrl = window.location.pathname;

    var defaultLang = undefined;
    var allowedLanguages = [];
    languages.forEach(async (lang) => {
      allowedLanguages.push(lang.code);
      if (lang.isDefault) {
        defaultLang = lang.code;
        // await languageService.initialize(lang.code);
        // this.utilService.setLanguageCode(lang.code);
        // this.capRouterService.routeByUrlWithLanguage(locationUrl);
      }
    })

    if (locationUrl.startsWith('/ar')) {
      languageService.initialize('ar');
      //this.utilService.setLanguageCode('ar');
    } else if (locationUrl.startsWith('/en')) {
      languageService.initialize('en');
      //this.utilService.setLanguageCode('en');
    } else {
      // two possiblities: either lang code not provided
      // or wrong lang code is provided
     
      // here check the browser language
      const browserLang = navigator.language;
      let mappedLang = languageService.getCodeByBrowserLanguage(browserLang);
      if (!mappedLang || mappedLang === '') {
        mappedLang = defaultLang;
      }

      if (mappedLang === '') {
        mappedLang = 'en';
      }

      languageService.initialize(mappedLang);
      //this.utilService.setLanguageCode(mappedLang);
      this.capRouterService.routeByUrlWithLanguage(locationUrl);
    }
  }
}
