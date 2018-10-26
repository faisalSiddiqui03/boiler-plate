import { Component } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangePasswordComponent } from '@capillarytech/pwa-components/change-password/change-password.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class ChangePasswordPage extends ChangePasswordComponent {

  resetPasswordForm: FormGroup;
  updateInProgress = false;
  passwordChangeSuccess = false;
  fieldTypeMap = new Map();
  dealCategoryId: string;

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService
  ) {
    super();

    this.fieldTypeMap.set('passwordFieldType', 'password');
    this.fieldTypeMap.set('confirmPasswordFieldType', 'password');
    this.dealCategoryId = this.configService.getConfig()['dealCategoryId'];

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmNewPassword: ['', Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? null : true;
  }

  changeFieldType(field) {
    switch(field) {
      case 'newPassword':
        if (this.fieldTypeMap.get('passwordFieldType') === 'password') {
          this.fieldTypeMap.set('passwordFieldType', 'text');
        } else {
          this.fieldTypeMap.set('passwordFieldType', 'password');
        }
        break;
      case 'confirmNewPassword':
        if (this.fieldTypeMap.get('confirmPasswordFieldType') === 'password') {
          this.fieldTypeMap.set('confirmPasswordFieldType', 'text');
        } else {
          this.fieldTypeMap.set('confirmPasswordFieldType', 'password');
        }
        break;
    }
    return;
  }

  async doChangePassword() {
    await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.updateInProgress = true;
    this.changePassword(this.resetPasswordForm.value.newPassword);
  }

  async handleWidgetActionChangePasswordFailed(data) {
    this.loaderService.stopLoading();
    this.updateInProgress = false;
    await this.alertService.presentToast(this.translate.instant('change_password_page.change_password_failed'), 1000, 'top');
  }

  navigateToDeals() {
    this.capRouter.routeByUrl('/products?category=deals&id=' + this.dealCategoryId);
  }

  async handleWidgetActionChangePasswordSuccess(data) {
    this.loaderService.stopLoading();
    this.updateInProgress = false;
    if (data.isSuccessful) {
      this.passwordChangeSuccess = true;
      let success_message = await this.translate.instant('change_password_page.change_password_success');
      console.log(success_message);
      await this.alertService.presentToast(success_message, 1000, 'top');
      return;
    }

    this.handleWidgetActionChangePasswordFailed(data);
  }
}
