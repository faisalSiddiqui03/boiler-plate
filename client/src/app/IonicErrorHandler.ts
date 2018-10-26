import { Injectable, ErrorHandler, Injector } from "@angular/core";
import { IonicErrorHandler } from "ionic-angular";
import { Pro } from "@ionic/pro";
import { environment } from '../environments/environment';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    // Handles Error only if it is production environment
    if (environment.production){
    Pro.monitoring.handleNewError(err);
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
    }
  }
}