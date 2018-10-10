import {
  Component,
  OnInit,
  EventEmitter
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
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  Action,
  UserIdSignUpWidgetActions,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../../base/base-component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../../helpers/utils';
import {
  AlertService,
  LoaderService
} from '@capillarytech/pwa-ui-helpers';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class SignupPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  signUpForm: FormGroup;
  useridSignUpAction = new EventEmitter();
  useridSignUpActionEmitter = new EventEmitter();
  widgetModels: { [name: string]: any };
  titleValue: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private loaderService: LoaderService,
    private utilService: UtilService,
    private alertService: AlertService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.widgetModels = {};
    this.signUpForm = this.formBuilder.group({
      fname: ['', Validators.compose([Validators.required, Validators.pattern('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_ \.]*$')])],
      lname: [''],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern('^[2569][0-9]*$'), Validators.minLength(8), Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.compose([Validators.required])]
    });

    this.signUpForm.validator = this.matchingPasswords
  }

  ngOnInit() {
    const translateSub = this.translate.get('sign_up_page.sign_up').subscribe(value => {
      this.titleValue = value;
    });

    this.subscriptions.push(translateSub);
  }

  signUp() {
    this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    console.log(this.signUpForm.value);
    this.widgetModels.USERID_SIGNUP.firstName = this.signUpForm.value.fname;
    this.widgetModels.USERID_SIGNUP.lastName = this.signUpForm.value.lname;
    this.widgetModels.USERID_SIGNUP.email = this.signUpForm.value.email;
    this.widgetModels.USERID_SIGNUP.mobile = this.signUpForm.value.mobile;
    this.widgetModels.USERID_SIGNUP.password = this.signUpForm.value.password;
    this.widgetModels.USERID_SIGNUP.userName = this.signUpForm.value.email;
    this.widgetModels.USERID_SIGNUP.gender = 'M';

    this.useridSignUpAction.emit(new Action(UserIdSignUpWidgetActions.ACTION_SIGN_UP));
  }

  handleSignUpResponse(data) {
    this.loaderService.stopLoading();
    if (data.message === "Succesfull") {
      this.alertService.presentToast(this.translate.instant('sign_up_page.registration_successful'), 500, 'top', 'top');
      this.useridSignUpAction.emit(
        new Action('SIGNUP_SIGNIN', [this.signUpForm.value.email, this.signUpForm.value.password]))
        this.capRouter.routeByUrlWithLanguage('/home');
      // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
    } else {
      this.alertService.presentToast(data.message, 500, 'top', 'top');
    }
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  widgetActionFailed(name: string, data: any): any {
    this.loaderService.stopLoading();
    switch (name) {
      case UserIdSignUpWidgetActions.ACTION_SIGN_UP:
        this.handleSignUpResponse(data);
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    this.loaderService.stopLoading();
    switch (name) {
      case UserIdSignUpWidgetActions.ACTION_SIGN_UP:
        this.handleSignUpResponse(data);
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    switch (name) {
      case 'USERID_SIGNUP':
        this.loaderService.stopLoading();
        this.widgetModels[name] = data;
        break;
    }
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validators[validation] === true) {
          formValidators.push(Validators[validation]);
        } else {
          formValidators.push(Validators[validation](validators[validation]));
        }
      }
    }

    return formValidators;
  }

  matchingPasswords(AC: AbstractControl) {
    if (AC.get('password') && AC.get('confirmPassword')) {
      let password = AC.get('password').value; // to get value in input tag
      let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
      if (password != confirmPassword) {
        AC.get('confirmPassword').setErrors({ matchingPasswords: true })
      } else {
        return null
      }
    }
  }

}
