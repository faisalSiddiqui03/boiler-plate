import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pwaLifeCycle, pageView, Action, ForgotPasswordWidgetActions } from '@capillarytech/pwa-framework';
import { BasePage } from '../../../../base/base-page';
import { Router } from '@angular/router';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../../helpers/utils';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class PasswordResetPage extends BasePage implements OnInit {
  resetPasswordForm: FormGroup;
  resetPasswordActionEmitter = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    this.translate.use(Utils.getLanguageCode());

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
  }

  handleResetPasswordActions(data) {
    console.log(data);
  }

  resetPassword() {
    this.resetPasswordActionEmitter.emit(new Action(
      ForgotPasswordWidgetActions.ACTION_SEND_PASSWORD_RESET_LINK, this.resetPasswordForm.value.email
    ));
  }

  handleResetPasswordResponse(data) {
    this.router.navigateByUrl('login');
    if (data.isSuccessful) {
      this.alertService.presentToast('Successfully sent link', 1000, top);
    } else {
      this.alertService.presentToast(data.message, 1000, top);
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
          message: 'Something went wrong please try again.'
        });
        break;
    }
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  signIn() {

  }
}
