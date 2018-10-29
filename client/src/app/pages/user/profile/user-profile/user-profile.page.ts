import { Component } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfileComponent } from '@capillarytech/pwa-components/user-profile/user-profile.component'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class UserProfilePage extends UserProfileComponent {

  profileForm: FormGroup;
  updateInProgress = false;

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService
  ) {
    super();

    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: [''],
      mobileNo: ['', Validators.compose([Validators.required, Validators.minLength(8),
          Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])],
      alternateEmail: ['', ],
    });
  }

  async updateProfile() {

    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.userProfileWidgetModel.lastName = this.profileForm.value.lastName;
    this.userProfileWidgetModel.mobileNo = this.profileForm.value.mobileNo;
    this.userProfileWidgetModel.firstName = this.profileForm.value.firstName;
    this.updateUserProfile();
  }

  async handleUpdateUserActionLogoutSuccess(data) {

    this.loaderService.stopLoading();
    const text = this.translate.instant('user_profile_page.profile_updated_successfully');
    await this.alertService.presentToast(text, 2000, 'top', 'top');
    this.capRouter.routeByUrl('my-account');
  }

  handleUserProfileLoadingSuccess(data) {

    this.profileForm.get('firstName').setValue(data.firstName);
    this.profileForm.get('lastName').setValue(data.lastName);
    this.profileForm.get('mobileNo').setValue(data.mobileNo);
    this.profileForm.get('alternateEmail').setValue(data.alternateEmail);
  }

  async handleUpdateUserActionLogoutFailed(data) {

    this.updateInProgress = false;
    this.loaderService.stopLoading();
    const text = this.translate.instant('user_profile_page.profile_update_failed');
    await this.alertService.presentToast(text, 2000, 'top', 'top');
  }
}
