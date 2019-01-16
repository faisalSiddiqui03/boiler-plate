import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {UserIdPwdSigninWidgetActions } from '@capillarytech/pwa-framework/widgets/authentication';
import {
  Action,
  pwaLifeCycle,
  WidgetNames,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from './../../base-component';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

@pwaLifeCycle()
export class LoginPage extends BaseComponent implements OnInit {
  userIdSigninForm: FormGroup;
  signInAction = new EventEmitter();
  loginModel: any;

  constructor(
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService
  ) { 
    super();
    this.userIdSigninForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }

  signIn() {
    console.log('in signin');
    this.loginModel.userName = this.userIdSigninForm.value.email;
    this.loginModel.password = this.userIdSigninForm.value.password;
    this.signInAction.emit(new Action(UserIdPwdSigninWidgetActions.ACTION_SIGN_IN));
  }


  widgetLoadingFailed(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('widget failed');
    }
  }

  widgetLoadingStarted(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('widget strartign');
    }
  }

  widgetLoadingSuccess(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('widget success');
        this.loginModel = data;
    }
  }

  widgetActionFailed(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('widget failed', data);
    }
  }

  widgetActionSuccess(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('widget success');
        this.capRouter.routeByUrl('/home');
    }
  }


}