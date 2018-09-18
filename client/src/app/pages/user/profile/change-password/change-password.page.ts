import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import { pwaLifeCycle, Action, pageView, OnWidgetActionsLifecyle, OnWidgetLifecyle } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ResetPasswordWidgetActions } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class ChangePasswordPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  resetPasswordForm: FormGroup;
  resetPasswordWidgetActionEmitter = new EventEmitter();
  titleValue = '';
  widgetmodel: any;
  userId: string;

  constructor(private router: Router, private route: ActivatedRoute, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private formBuilder: FormBuilder) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmNewPassword: ['', Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    setTimeout(() => {
      this.userId = this.getUserModel().userId;
      console.log(this.userId);
    },3000)
    this.translate.get('change_password_page.change_password').subscribe(value => {
      this.titleValue = value;
    });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? null : true
  }

  changePassword() {
    console.log('Password change');
    this.widgetmodel = this.widgetmodel.setUserId(this.userId)
      .setPassword(this.resetPasswordForm.value.newPassword);
    let action = new Action(ResetPasswordWidgetActions.ACTION_CHANGE_PASSWORD);
    this.resetPasswordWidgetActionEmitter.emit(action);
    // this.router.navigateByUrl('my-account');
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name, data) {
    if (data.isSuccessful) {
      console.log('Changes password successfully!');
    } else {
      console.log(data.message);
    }
    console.log(data);
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }
}
