import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  pwaLifeCycle,
  pageView,
  Action,
  OnWidgetActionsLifecyle, OnWidgetLifecyle, CapRouterService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { ForgotPasswordWidgetActions } from '@cap-widget/authentication/forgot-password';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
@pwaLifeCycle()
@pageView()
export class PasswordResetPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  resetPasswordForm: FormGroup;
  resetPasswordActionEmitter = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
      private loaderService: LoaderService,
      private alertService: AlertService, private translate: TranslateService,
      private capRouter: CapRouterService) {
        super();
        this.resetPasswordForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.required, Validators.email])]
        });
  }

  ngOnInit() {}

  handleResetPasswordActions(data) {
    console.log(data);
  }

  async resetPassword() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode() );
    this.resetPasswordActionEmitter.emit(new Action(
      ForgotPasswordWidgetActions.ACTION_SEND_PASSWORD_RESET_LINK, this.resetPasswordForm.value.email
    ));
  }

  async handleResetPasswordResponse(data) {
    this.loaderService.stopLoading();
    this.capRouter.routeByUrl('/login');
    if (data.isSuccessful) {
      await this.alertService.presentToast(this.translate.instant('reset_password_page.link_sent'), 1000, 'top', 'top');
    } else {
      await this.alertService.presentToast(data.message, 1000, 'top', 'top');
    }
  }

  widgetActionSuccess(name, data) {
    switch (name) {
      case 'SEND_PASSWORD_RESET_LINK':
        this.handleResetPasswordResponse(data);
        break;
    }
  }

  widgetActionFailed(name, data) {
    switch (name) {
      case 'SEND_PASSWORD_RESET_LINK':
        this.handleResetPasswordResponse({
          isSuccessful: false,
          message: this.translate.instant('reset_password_page.error')
        });
        break;
    }
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

  signIn() {

  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }
}
