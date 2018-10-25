import { Component, OnInit } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ChangePasswordComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class ChangePasswordPage extends ChangePasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  titleValue = '';
  userId: string;
  updateInProgress = false;
  isPasswordFiled = true;
  isConfirmPasswordFiled = true;
  passwordChangeSuccess = false;

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService,
  ) {
    super();

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmNewPassword: ['', Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.passwordChangeSuccess = false;
    const translateSub = this.translate.get('change_password_page.change_password').subscribe(value => {
        this.titleValue = value;
    });
    this.getUserPromise().then((user) => {
        this.userId = user.userId;
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? null : true;
  }

  changeFieldType(field) {
    if (field === 'newPassword') {
      this.isPasswordFiled = !this.isPasswordFiled;
    } else if (field === 'confirmNewPassword') {
      this.isConfirmPasswordFiled = !this.isConfirmPasswordFiled;
    }
    return;
  }

  async doChangePassword() {
    console.log('Password change');
    await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.updateInProgress = true;
    this.changePassword(this.userId, this.resetPasswordForm.value.newPassword);
  }

  handleWidgetActionChangePasswordFailed(data) {
    this.loaderService.stopLoading();
    this.updateInProgress = false;
  } 

  navigateToDeals() {
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
  }

  async handleWidgetActionChangePasswordSuccess(data) {
    this.loaderService.stopLoading();
    this.updateInProgress = false;
    if (data.isSuccessful) {
      this.passwordChangeSuccess = true;
      console.log(this.translate.instant('change_password_page.change_password_success'));
      await this.alertService.presentToast(this.translate.instant('change_password_page.change_password_success'), 1000, 'top');
    } else {
      console.log(data.message);
    }
  }

  handleResetPasswordLoadingFailed(data) {
    console.log('reset password widget loading failed');
  }

}
