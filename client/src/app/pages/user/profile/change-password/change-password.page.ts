import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../../base/base-page';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class ChangePasswordPage extends BasePage implements OnInit {

  resetPasswordForm: FormGroup;
  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private formBuilder: FormBuilder) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());

    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmNewPassword: ['', Validators.compose([Validators.required])]
    }, {validator: this.checkPasswords });
  }

  ngOnInit() {
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmNewPassword.value;
    return pass === confirmPass ? null : true
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  changePassword() {
    console.log('Password change');
    this.router.navigateByUrl('my-account');
  }
}
