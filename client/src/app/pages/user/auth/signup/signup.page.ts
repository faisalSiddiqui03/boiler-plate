import { 
    Component, 
    OnInit, 
    EventEmitter } from '@angular/core';
import { 
    Validators, 
    FormBuilder, 
    FormGroup, 
    AbstractControl } from '@angular/forms';
import { 
    pwaLifeCycle, 
    pageView, 
    OnWidgetActionsLifecyle, 
    OnWidgetLifecyle } from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../../base/base-component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../../helpers/utils';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class SignupPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  signUpForm:FormGroup;

  constructor(
      private formBuilder: FormBuilder, 
      private router: Router, 
      private translate: TranslateService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.signUpForm = this.formBuilder.group({
      fname: ['', Validators.required, Validators.pattern('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_ \.]*$')],
      lname: [''],
      mobile: ['', Validators.required, Validators.pattern('^[2569][0-9]*$'), Validators.minLength(8), Validators.maxLength(8)],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)],
      confirmPassword: ['', Validators.required]
    });

    // this.signUpForm.validator = this.matchingPasswords
   }

  ngOnInit() {
  }

  signUp(){
    console.log(this.signUpForm.value);
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name: string, data: any): any {
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }

  private mapValidators(validators) {
    const formValidators = [];
  
    if(validators) {
      for(const validation of Object.keys(validators)) {
          if(validators[validation] === true){
            formValidators.push(Validators[validation]);
          }else{
            formValidators.push(Validators[validation](validators[validation]));
          }          
      }
    }
  
    return formValidators;
  }

    matchingPasswords(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmpassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmpassword').setErrors({ matchingPasswords: true })
        } else {
            return null
        }
    }

}
