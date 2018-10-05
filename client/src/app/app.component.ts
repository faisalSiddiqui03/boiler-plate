import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './base/base-component';
import { ConfigService, EventService, pwaLifeCycle } from '@capillarytech/pwa-framework';
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
    private utilService: UtilService
  ) {
    super();
    routingState.loadRouting();
    this.sharedService = this.globalSharedService;
    const langCode = 'ar';
    this.initializeApp();
    //this.setLanguage(langCode);
    console.log("---->>>>>", document.dir);
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
    this.utilService.setLanguageCode(langCode);
    this.translate.setDefaultLang(langCode);
    this.translate.use(langCode);
    //this.setAppDirection(langCode);
  }

  setAppDirection(lang: string) {
    if (lang == 'ar') {
      console.log('----------------', this.platform);
      // this.platform.set('rtl', true);
      // this.platform.setDir('ltr', false);
      // this.menuCtrl.enable(true, 'side-menu-left');
      // this.menuCtrl.swipeEnable(true, "side-menu-left");
      // this.menuCtrl.enable(false, 'side-menu-right');
      // this.menuCtrl.swipeEnable(false, 'side-menu-right');
      // this.langArabic = true;
    } else {
      // this.platform.setDir('ltr', true);
      // this.platform.setDir('rtl', false);
      // this.menuCtrl.enable(true, 'side-menu-right');
      // this.menuCtrl.swipeEnable(true, 'side-menu-right');
      // this.menuCtrl.enable(false, 'side-menu-left');
      // this.menuCtrl.swipeEnable(false, "side-menu-left");
      // this.langArabic = false;
    }
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
