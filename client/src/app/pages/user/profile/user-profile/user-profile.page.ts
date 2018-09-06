import { Component, OnInit, EventEmitter } from '@angular/core';
import { BasePage } from '../../../../base/base-page';
import { pwaLifeCycle, pageView, UserProfileWidgetActions, Action } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class UserProfilePage extends BasePage implements OnInit {
  updateProfileActionEmitter = new EventEmitter();
  profileForm: FormGroup;
  widgetModel: any;
  loaded: boolean;

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private formBuilder: FormBuilder) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());

    this.profileForm = this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required])],
      lname: [''],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    })
  }

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  updateProfile() {
    this.widgetModel.firstName = this.profileForm.value.firstName;
    this.updateProfileActionEmitter.emit(new Action(UserProfileWidgetActions.ACTION_UPDATE_USER));
  }

  widgetActionSuccess(name, data) {
    console.log('action success ' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    this.widgetModel = data;
    this.loaded = true;
    console.log('loaded ' + name, data);
  }

  widgetLoadingFailed(name, data) {
    console.log('loading failed' + name, data);
  }

  widgetActionFailure(name, data) {
    console.log('action failed ' + name, data);
  }

}
