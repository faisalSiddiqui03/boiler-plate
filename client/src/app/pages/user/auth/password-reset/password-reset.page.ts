import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pwaLifeCycle, pageView, Action, ForgotPasswordWidgetActions } from '@capillarytech/pwa-framework';
import { BasePage } from '../../../../base/base-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class PasswordResetPage extends BasePage implements OnInit {
  resetPasswordForm: FormGroup;
  showResetPasswordMessage: string;
  resetPasswordActionEmitter = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private router: Router) {
    super();

    this.showResetPasswordMessage = '';

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  handleResetPasswordActions(data) {
    console.log(data);
  }

  resetPassword() {
    this.showResetPasswordMessage = '';
    this.resetPasswordActionEmitter.emit(new Action(
      ForgotPasswordWidgetActions.ACTION_SEND_PASSWORD_RESET_LINK, this.resetPasswordForm.value.email
    ));
  }

  handleResetPasswordResponse(data) {
    if (data.isSuccessful) {
      this.showResetPasswordMessage = 'Successfully sent link';
    } else {
      this.showResetPasswordMessage = data.message;
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
      case 'FORGOT_PASSWORD':
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
