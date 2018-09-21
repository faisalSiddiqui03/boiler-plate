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
  UserIdSignUpWidgetActions
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../../base/base-component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../../helpers/utils';
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
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
  }

  signUp() {
    console.log(this.signUpForm.value);
    this.widgetModels.USERID_SIGNUP.firstName = this.signUpForm.value.fname;
    this.widgetModels.USERID_SIGNUP.lastName = this.signUpForm.value.lname;
    this.widgetModels.USERID_SIGNUP.email = this.signUpForm.value.emal;
    this.widgetModels.USERID_SIGNUP.mobile = this.signUpForm.value.mobile;
    this.widgetModels.USERID_SIGNUP.password = this.signUpForm.value.password;

    this.useridSignUpAction.emit(new Action(UserIdSignUpWidgetActions.ACTION_SIGN_UP));
  }

  handleSignUpResponse(data) {
    if (data.message === "Successful") {
      this.alertService.presentToast(this.translate.instant('sign_up_page.registration_successful'), 500, top);
      this.router.navigateByUrl('home');
    } else {
      this.alertService.presentToast(data.message, 500, top);
    }
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
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

  changeTextPassword(event) {
    console.log(event);
  }

}
