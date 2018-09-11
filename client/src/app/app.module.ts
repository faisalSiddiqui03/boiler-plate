import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
} from '@capillarytech/pwa-framework';
import { HttpLoaderFactory } from './translation.loader';
import { appConfig } from '../../config/config';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    AppRoutingModule,
    HttpClientModule,
    FulfilmentModeModule,
    ImagePreloadModule,
    UserProfileWidgetModule,
    LogoutWidgetModule,
    EventTrackModule.forRoot([EventTrackModule.Tracker.GTM]),
    LanguageServiceModule.forRoot([
      { name: 'English', code: 'en', isDefault: false, alignment: 'ltr' },
      { name: 'Hindi', code: 'hi', isDefault: true, alignment: 'ltr' }]),
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
    HttpClientModule,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    AlertService,
    LoaderService,
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(injector: Injector) {
    setAppInjector(injector);
  }
}
