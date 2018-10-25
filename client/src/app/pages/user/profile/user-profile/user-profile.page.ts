import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  pwaLifeCycle,
  pageView,
  Action,
  OnWidgetActionsLifecyle, OnWidgetLifecyle, CapRouterService
} from '@capillarytech/pwa-framework';
import { UserProfileWidgetActions } from '@cap-widget/user-profile';
import { UtilService } from '../../../../helpers/utils';
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

export class UserProfilePage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  updateProfileActionEmitter = new EventEmitter();
  profileForm: FormGroup;
  widgetModel: any;
  loaded: boolean;
  titleValue = '';
  updateInProgress = false;

  constructor(private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService,) {
    super();
    this.translate.use(this.getCurrentLanguageCode());

    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: [''],
      mobileNo: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])],
      alternateEmail: ['',],
    })
  }


  ngOnInit() {
    this.translate.get('user_profile_page.my_profile').subscribe(value => {
      this.titleValue = value;
    });
  }

  async updateProfile() {
    await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader': 'pickup-loader');
    this.updateInProgress = true;
    this.widgetModel.firstName = this.profileForm.value.firstName;
    this.widgetModel.lastName = this.profileForm.value.lastName;
    this.widgetModel.mobileNo = this.profileForm.value.mobileNo;
    this.updateProfileActionEmitter.emit(new Action(UserProfileWidgetActions.ACTION_UPDATE_USER));
  }

  async widgetActionSuccess(name, data) {
    console.log('action success ' + name, data);
    this.loaderService.stopLoading();
    this.updateInProgress = false;
    await this.alertService.presentToast(this.translate.instant('user_profile_page.profile_updated_successfully'), 2000, 'top', 'top');
    this.capRouter.routeByUrl('my-account');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('my-account'));
  }

  widgetLoadingSuccess(name, data) {
    switch (name) {
      case 'USER_PROFILE':
        this.widgetModel = data;
        this.loaded = true;
        console.log('loaded ' + name, data);
        this.profileForm.get('firstName').setValue(data.firstName);
        this.profileForm.get('lastName').setValue(data.lastName);
        this.profileForm.get('mobileNo').setValue(data.mobileNo);
        this.profileForm.get('alternateEmail').setValue(data.alternateEmail);
        break;
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('loading failed' + name, data);
  }

  async widgetActionFailed(name: string, data: any) {
    this.updateInProgress = false;
    this.loaderService.stopLoading();
    await this.alertService.presentToast(this.translate.instant('user_profile_page.profile_update_failed'), 2000, 'top', 'top');
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

}
