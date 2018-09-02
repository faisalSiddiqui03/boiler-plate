import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { BasePage } from './base/base-page';
import {
  EventService,
  pwaLifeCycle,
  GlobalSharedService,
  UserProfileWidget,
  LogoutWidget,
  LogoutWidgetActions,
  Action
} from '@capillarytech/pwa-framework';
import { Utils } from './helpers/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
@pwaLifeCycle()
export class AppComponent extends BasePage {
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
  ) {
    super();

    this.sharedService = this.globalSharedService;
    const langCode = 'en';
    this.initializeApp();
    this.setLanguage(langCode);
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

  ngOnInit() {
    //this.isLoggedIn = false;
    // const userProfile = this.globalSharedService.getUserModel();
    // setInterval(() => console.log(this.globalSharedService.getUserModel()), 3000);
  }

  setLanguage(langCode: string) {
    Utils.setLanguageCode(langCode);
    this.translate.setDefaultLang(langCode);
    this.translate.use(langCode);
  }

  private handleError(event) {
    console.log("COMPONENT :- ", event);
    switch (event.code) {
      case 401:
        console.log("redirect to home");
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
