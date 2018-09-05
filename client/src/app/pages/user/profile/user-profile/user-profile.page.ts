import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../../base/base-page';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
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
  editProfileForm: FormGroup;
  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private formBuilder:FormBuilder) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());

    this.editProfileForm = this.formBuilder.group({
      fname: ['anji', Validators.compose([Validators.required])],
      lname: ['reddy'],
      mobile: ['12345678', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      email: ['anji@123.com', Validators.compose([Validators.required, Validators.email])],
    })
  }

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  saveProfile(){
    console.log('save profile');
    this.router.navigateByUrl('my-account');
  }

}
