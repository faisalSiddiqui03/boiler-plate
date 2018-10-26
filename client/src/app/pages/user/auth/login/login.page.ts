import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  WidgetNames
} from '@capillarytech/pwa-framework';
import { AlertService, LoaderService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { LoginComponent } from '@capillarytech/pwa-components/login/login.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class LoginPage extends LoginComponent {

  isPasswordField = true;
  userIdSigninForm: FormGroup;
  googleClientId = '';
  enteredPassword = '';

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private hardwareService: HardwareService,
    private capRouter: CapRouterService,
  ) {
    super();

    this.googleClientId = this.configService.getConfig()['googleClientId'];
    this.userIdSigninForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  changePasswordFieldType() {
    this.isPasswordField = !this.isPasswordField;
  }

  async signIn() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.widgetModels[WidgetNames.USERID_PWD_SIGNIN].userName = this.userIdSigninForm.value.email;
    this.widgetModels[WidgetNames.USERID_PWD_SIGNIN].password = this.userIdSigninForm.value.password;
    this.usernamePasswordSignIn();
  }

  async signInWithGoogle() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.googleSignIn();
  }

  async handleUserIDPwdSigninLoadingFailed(data) {
    this.loaderService.stopLoading();
    let msg = await this.translate.instant('sign_in_page.invalid_username_and_password');
    this.presentToast(msg);
  }

  async handleGoogleSignInLoadingFailed(data) {
    this.loaderService.stopLoading();
    let msg = await this.translate.instant('sign_in_page.invalid_username_and_password');
    this.presentToast(msg);
  }

  async handleActionSignInSuccess(data) {
    this.loaderService.stopLoading();
    if (data.message === 'Successful') {
      let msg = await this.translate.instant('sign_in_page.success_sign_in');
      this.presentToast(msg);
      this.capRouter.routeByUrl('/home');
    } else {
      let msg = await this.translate.instant('sign_in_page.invalid_username_and_password');
      this.presentToast(msg);
    }
  }

  async handleActionGoogleSignInSuccess(data) {
    this.loaderService.stopLoading();
    if(data.isSuccessful) {
      let msg = await this.translate.instant('sign_in_page.success_sign_in');
      this.presentToast(msg);
    } else {
      this.presentToast(data.message)
    }
    this.capRouter.routeByUrl('/home');
  }

  async handleActionSignInFailed(data) {
    this.loaderService.stopLoading();
    let msg = await this.translate.instant('sign_in_page.invalid_username_and_password');
    this.presentToast(msg);
  }
  
  async handleActionGoogleSignInFailed(data) {
    this.loaderService.stopLoading();
    this.presentToast(data.message);
  }

  async presentToast(message) {
    const isDesktop = await this.hardwareService.isDesktopSite();
    if (isDesktop) {
      this.alertService.presentToast(message, 500, 'top');
    } else {
      this.alertService.presentToast(message, 500, 'top', 'top');
    }
    return;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }
}
