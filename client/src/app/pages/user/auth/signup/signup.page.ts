import {
  Component,
  OnInit
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl
} from '@angular/forms';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  WidgetNames
} from '@capillarytech/pwa-framework';
import {TranslateService} from '@ngx-translate/core';
import {
  AlertService,
  LoaderService
} from '@capillarytech/pwa-ui-helpers';
import {SignupComponent} from '@capillarytech/pwa-components/signup/signup.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class SignupPage extends SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.signUpForm = this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required,
        Validators.pattern('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_ \.]*$')])],
      lname: [''],
      mobile: ['', Validators.compose([Validators.required,
        Validators.pattern('^[2569][0-9]*$'), Validators.minLength(8), Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    });

    this.signUpForm.validator = this.matchingPasswords;
  }

  ngOnInit() {
  }

  async userSignUp() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    this.widgetModel.firstName = this.signUpForm.value.fname;
    this.widgetModel.lastName = this.signUpForm.value.lname;
    this.widgetModel.email = this.signUpForm.value.email;
    this.widgetModel.mobile = this.signUpForm.value.mobile;
    this.widgetModel.password = this.signUpForm.value.password;
    this.widgetModel.userName = this.signUpForm.value.email;
    this.widgetModel.gender = 'M';

    this.signup();
  }

  async handleSignupActionSignupFailed(data) {
    this.loaderService.stopLoading();
    await this.alertService.presentToast(data.message, 500, 'top', 'top');
  }

  async handleSignupActionSignupSuccess(data) {
    this.loaderService.stopLoading();
    if (data.message === 'Succesfull') {
      await this.alertService.presentToast(this.translate.instant('sign_up_page.registration_successful'), 500, 'top', 'top');
      this.signin(this.signUpForm.value.email, this.signUpForm.value.password);
      this.capRouter.routeByUrl('/home');
    } else {
      await this.alertService.presentToast(data.message, 500, 'top', 'top');
    }
  }

  handleSignupLoadingSuccess(data) {
    this.loaderService.stopLoading();
    this.widgetModel = data;
  }

  async handleSignupLoadingFailed(data) {
    this.loaderService.stopLoading();
    await this.alertService.presentToast(this.translate.instant('sign_up_page.unable_to_get_user_data'), 500, 'top', 'top');
  }

  handleSignupActionSigninFailed(data) {
  }

  handleSignupActionSigninSuccess(data) {
  }

  matchingPasswords(AC: AbstractControl) {
    if (AC.get('password') && AC.get('confirmPassword')) {
      const password = AC.get('password').value; // to get value in input tag
      const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
      if (password !== confirmPassword) {
        AC.get('confirmPassword').setErrors({matchingPasswords: true});
      } else {
        return null;
      }
    }
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }
}
