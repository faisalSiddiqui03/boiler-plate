import { Component, ViewEncapsulation } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  WidgetNames
} from '@capillarytech/pwa-framework';
import { AlertService, LoaderService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@capillarytech/pwa-framework';
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
    this.useridPasswordWidgetModels.userName = this.userIdSigninForm.value.email;
    this.useridPasswordWidgetModels.password = this.userIdSigninForm.value.password;
    this.usernamePasswordSignIn();
  }

  async signInWithGoogle() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.googleSignIn();
  }

  async handleUserIDPwdSigninLoadingFailed(data) {
      await this.handleFailedToast();
  }

  async handleFailedToast() {

      this.loaderService.stopLoading();
      const msg = await this.translate.instant('sign_in_page.invalid_username_and_password');
      await this.presentToast(msg);
  }

  async handleGoogleSignInLoadingFailed(data) {
      await this.handleFailedToast();
  }

  async handleSuccessToastAndRedirection() {

      this.loaderService.stopLoading();
      const msg = await this.translate.instant('sign_in_page.success_sign_in');
      await this.presentToast(msg);
      this.capRouter.routeByUrl('/home');
  }

  async handleActionSignInSuccess(data) {

    if (data.message === 'Successful') {

      await this.handleSuccessToastAndRedirection();
      return;
    }

      await this.handleActionSignInFailed(data);
  }

  async handleActionGoogleSignInSuccess(data) {

    if (data.isSuccessful) {
        await this.handleSuccessToastAndRedirection();
      return;
    }

    if (data && data.message) {
        await this.handleActionGoogleSignInFailed(data);
        return;
    }

      await this.handleFailedToast();
  }

  async handleActionSignInFailed(data) {
      await this.handleFailedToast();
  }

  async handleActionGoogleSignInFailed(data) {

    this.loaderService.stopLoading();
    await this.presentToast(data.message);
  }

  async presentToast(message) {

    const isDesktop = await this.hardwareService.isDesktopSite();
    if (isDesktop) {
      this.alertService.presentToast(message, 500, 'top');
      return;
    }

    this.alertService.presentToast(message, 500, 'top', 'top');
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }
}
