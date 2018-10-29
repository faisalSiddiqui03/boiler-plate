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
  passwordChangeSuccess = false;
  fieldTypeMap = new Map(); // field map, true then password if false then text
  dealCategoryId: string;

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService
  ) {
    super();

    this.fieldTypeMap.set('newPassword', true);
    this.fieldTypeMap.set('confirmNewPassword', true);
    this.dealCategoryId = this.configService.getConfig()['dealCategoryId'];

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmNewPassword: ['', Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });
  }

  checkPasswords(group: FormGroup) {

    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? false : true;
  }

  changeFieldType(field) {

      const value = this.fieldTypeMap.get(field);
      this.fieldTypeMap.set(field, !value);
  }

  getFieldType(field) {

    if (this.fieldTypeMap.get(field)) {
      return 'password';
    }

    return 'text';
  }

  async doChangePassword() {

    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.changePasswordWidgetmodel.password = this.resetPasswordForm.value.newPassword;
    this.changePassword();
  }

  async handleWidgetActionChangePasswordFailed(data) {

    this.loaderService.stopLoading();
    const text = await this.translate.instant('change_password_page.change_password_failed');
    await this.alertService.presentToast(text, 1000, 'top');
  }

  navigateToDeals() {
    this.capRouter.routeByUrl('/products?category=deals&id=' + this.dealCategoryId);
  }

  async handleWidgetActionChangePasswordSuccess(data) {

    if (data.isSuccessful) {

      this.loaderService.stopLoading();
      this.passwordChangeSuccess = true;
      const success_message = await this.translate.instant('change_password_page.change_password_success');
      console.log(success_message);
      await this.alertService.presentToast(success_message, 1000, 'top');
      return;
    }

    this.handleWidgetActionChangePasswordFailed(data);
  }
}
