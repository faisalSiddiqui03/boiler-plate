import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  Action,
  pwaLifeCycle,
  pageView,
  CapRouterService,
  WidgetNames,
} from '@capillarytech/pwa-framework';
import { UserIdPwdSigninWidgetActions } from '@cap-widget/authentication/userid-password-signin';
import { BaseComponent } from './../../base-component';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

@pageView()
@pwaLifeCycle()
export class LoginPage extends BaseComponent implements OnInit {
  userIdSigninForm: FormGroup;
  loginWidgetModel: any;
  useridPasswordSigninAction = new EventEmitter();

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
    this.loginWidgetModel.userName = this.userIdSigninForm.value.email;
    this.loginWidgetModel.password = this.userIdSigninForm.value.password;
    this.useridPasswordSigninAction.emit(new Action(UserIdPwdSigninWidgetActions.ACTION_SIGN_IN));
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
        console.log('widget started');
    }
  }
  
  widgetLoadingSuccess(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('widget success');
        this.loginWidgetModel = data;
    }
  }

  widgetActionFaliure(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('widget action failed');
    }
  }

  widgetActionSuccess(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('widget action success');
        this.capRouter.routeByUrl('/home');
    }
  }

}