import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  pwaLifeCycle,
  Action,
  pageView,
  ConfigService,
  OnWidgetActionsLifecyle, OnWidgetLifecyle, CapRouterService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../../base/base-component';
import { AlertService, LoaderService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { UserIdPwdSigninWidgetActions } from '@cap-widget/authentication/userid-password-signin';
import { GoogleSignInWidgetActions } from '@cap-widget/authentication/google-signin';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class LoginPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  isPasswordFiled = true;
  userIdSigninForm: FormGroup;
  isLoginSuccessful = false;

  useridPasswordSigninAction = new EventEmitter();
  useridPasswordSigninActionEmitter = new EventEmitter();
  useridPasswordSigninExecutor = new EventEmitter();
  widgetModels: { [name: string]: any };

  googleSignInActionEmitter = new EventEmitter();
  googleClientId = '';
  titleValue = '';
  enteredPassword = '';

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private hardwareService: HardwareService,
    private capRouter: CapRouterService,
  ) {
    super();

    this.googleClientId = this.config.getConfig()['googleClientId'];
    this.translate.use(this.getCurrentLanguageCode());

    this.widgetModels = {};

    this.userIdSigninForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    const translateSub = this.translate.get('sign_in_page.sign_in').subscribe(value => {
      this.titleValue = value;
    });
    this.subscriptions.push(translateSub);
  }

  changeTextPassword() {
    this.isPasswordFiled = !this.isPasswordFiled;
  }

  async signIn() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode() );
    this.widgetModels.USERID_PWD_SIGNIN.userName = this.userIdSigninForm.value.email;
    this.widgetModels.USERID_PWD_SIGNIN.password = this.userIdSigninForm.value.password;
    this.useridPasswordSigninAction.emit(new Action(UserIdPwdSigninWidgetActions.ACTION_SIGN_IN));
  }

  handleGoogleSignInAction(data) {
    console.log(data);
  }

  async googleSignIn() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode() );
    this.googleSignInActionEmitter.emit(new Action(GoogleSignInWidgetActions.ACTION_GPLUS_SIGN_IN));
  }

  async handleGoogleSignInResponse(data) {
    const isDesktop = await this.hardwareService.isDesktopSite();
    if (isDesktop) {
      await this.alertService.presentToast(data.isSuccessful ?
          this.translate.instant('sign_in_page.success_sign_in') : data.message, 500, 'top');
    } else {
      await this.alertService.presentToast(data.isSuccessful ?
          this.translate.instant('sign_in_page.success_sign_in') : data.message, 500, 'top', 'top');
    }

    this.capRouter.routeByUrl('/home');
  }


  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

  async handleUseridPasswordSigninResponse(data) {
    const isDesktop = await this.hardwareService.isDesktopSite();
    if (data.message === 'Successful') {
      this.isLoginSuccessful = true;
      if (isDesktop) {
        await this.alertService.presentToast(this.translate.instant('sign_in_page.success_sign_in'), 500, 'top');
      } else {
        await this.alertService.presentToast(this.translate.instant('sign_in_page.success_sign_in'), 500, 'top', 'top');
      }
      this.capRouter.routeByUrl('/home');
    } else {
      this.isLoginSuccessful = false;
      if (isDesktop) {
        await this.alertService.presentToast(this.translate.instant('sign_in_page.invalid_username_and_password'), 500, 'top');
      } else {
        await this.alertService.presentToast(this.translate.instant('sign_in_page.invalid_username_and_password'), 500, 'top', 'top');
      }
    }
  }

  widgetLoadingSuccess(name, model) {
    switch (name) {
      case 'USERID_PWD_SIGNIN':
        this.loaderService.stopLoading();
        this.widgetModels[name] = model;
        break;
    }
  }

  widgetActionSuccess(name, data) {
    this.loaderService.stopLoading();
    switch (name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        this.handleUseridPasswordSigninResponse(data);
        break;
      case 'GPLUS_SIGN_IN':
        this.handleGoogleSignInResponse(data);
        break;
    }
  }

  widgetActionFailed(name, data) {
    this.loaderService.stopLoading();
    switch (name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        this.handleUseridPasswordSigninResponse(data);
        break;
      case 'GPLUS_SIGN_IN':
        this.handleGoogleSignInResponse({
          isSuccessful: false,
          message: 'Something went wrong please try again.'
        });
        break;
    }
  }

  widgetLoadingFailed(name, model) {
    this.loaderService.stopLoading();
    switch (name) {
      case 'USERID_PWD_SIGNIN':
        this.handleUseridPasswordSigninResponse({
          isSuccessful: false,
          message: 'Something went wrong please try again.'
        });
        break;
      case 'GOOGLE_SIGN_IN':
        this.handleUseridPasswordSigninResponse({
          isSuccessful: false,
          message: 'Something went wrong please try again.'
        });
        break;
    }
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  goBack() {
    this.capRouter.goBack();
  }
}
