import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import {
  pwaLifeCycle,
  LifeCycle,
  Action,
  UserIdPwdSigninWidgetActions,
  pageView,
  GoogleSignInWidgetActions,
  ConfigService,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../../base/base-component';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../helpers/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class LoginPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  isPasswordFiled: boolean = true;
  userIdSigninForm: FormGroup;
  isLoginSuccessful: boolean = false;

  useridPasswordSigninAction = new EventEmitter();
  useridPasswordSigninActionEmitter = new EventEmitter();
  useridPasswordSigninExecutor = new EventEmitter();
  widgetModels: { [name: string]: any };

  googleSignInActionEmitter = new EventEmitter();
  googleClientId: string = '';
  titleValue: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private utilService: UtilService,
    private location: Location
  ) {
    super();

    this.googleClientId = this.config.getConfig()['googleClientId'];

    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
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
    this.translate.get('sign_in_page.sign_in').subscribe(value => {
      this.titleValue = value;
    });
  }

  changeTextPassword() {
    this.isPasswordFiled = !this.isPasswordFiled;
  }

  signIn() {
    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    this.widgetModels.USERID_PWD_SIGNIN.userName = this.userIdSigninForm.value.email;
    this.widgetModels.USERID_PWD_SIGNIN.password = this.userIdSigninForm.value.password;
    this.useridPasswordSigninAction.emit(new Action(UserIdPwdSigninWidgetActions.ACTION_SIGN_IN));
  }

  handleGoogleSignInAction(data) {
    console.log(data);
  }

  googleSignIn() {
    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    this.googleSignInActionEmitter.emit(new Action(GoogleSignInWidgetActions.ACTION_GPLUS_SIGN_IN));
  }

  handleGoogleSignInResponse(data) {
    this.alertService.presentToast(data.isSuccessful ? 'Successfully signed in' : data.message, 500, top);
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
  }


  goToPage(pageName) {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  handleUseridPasswordSigninResponse(data) {
    if (data.message === "Successful") {
      this.isLoginSuccessful = true;
      this.alertService.presentToastByTranslationKey('sign_in_page.success_sign_in', 500, top);
      this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
    } else {
      this.isLoginSuccessful = false;
      this.alertService.presentToast(data.message, 500, top);
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

  handleWidgetLifecycle(x: LifeCycle) {
    if (x.type == LifeCycle.WIDGET_LOADING_SUCCESS) {
      this.loaderService.stopLoading();
      console.log("Widget Loading Successful: " + x.data);

    } else if (x.type == LifeCycle.PRIMARY_ACTION_SUCCESS) {
      console.log("Primary Action Successful: " + x.data);

    } else {
      console.log('It throwed here');
      console.log(x);

    }
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  goBack() {
    this.location.back();
  }

}
