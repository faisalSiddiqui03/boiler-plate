import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './base/base-component';
import { ConfigService, EventService, pwaLifeCycle, CapRouterService } from '@capillarytech/pwa-framework';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { UtilService } from './helpers/utils';
import { RoutingState } from './routing-state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
@pwaLifeCycle()
export class AppComponent extends BaseComponent {
  // logoutActionEmitter = new EventEmitter();
  sharedService: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private translate: TranslateService,
    private eventService: EventService,
    public modalController: ModalController,
    private config: ConfigService,
    private routingState: RoutingState,
    private utilService: UtilService,
    private capAlertService: AlertService,
    private capRouterService: CapRouterService
  ) {
    super();
    routingState.loadRouting();
    this.sharedService = this.globalSharedService;
    // const langCode = 'ar';
    this.initializeApp();
    // console.log("---->>>>>", document.dir);
    this.eventService.GetEvent("HttpError").subscribe(event => {
      this.handleError(event);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private handleError(event) {
    console.log("COMPONENT :- ", event);
    switch (event.code) {
      case 401:
        // show popup to user for signed out session
        // also redirect to sign in page
        //this.capAlertService.presentToast('Session timed out', null, null);
        this.capRouterService.routeByUrlWithLanguage('/login');
        break;
    }
  }

  // logout() {
  //   this.logoutActionEmitter.emit(new Action(LogoutWidgetActions.LOGOUT));
  // }

  openPage(pageName) {
    // this.navCtrl.navigateForward(pageName, true);
  }

  // async presentSignInModal() {
  //   const modal = await this.modalController.create({
  //     component: SignUpPage,
  //   });
  //   return await modal.present();
  // }

}
