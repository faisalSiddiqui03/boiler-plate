import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  WidgetNames,
  Action,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
} from '@capillarytech/pwa-framework';
import { UserIdPwdSigninWidgetActions } from '@cap-widget/authentication/userid-password-signin';
import { BaseComponent } from './../../base-component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class LoginPage extends BaseComponent implements OnInit {
  userIdSigninForm: FormGroup;
  public useridPasswordWidgetModels: any;
  public useridPasswordSigninAction = new EventEmitter();

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

  signIn(){
    this.useridPasswordWidgetModels.userName = this.userIdSigninForm.value.email;
    this.useridPasswordWidgetModels.password = this.userIdSigninForm.value.password;

    this.useridPasswordSigninAction.emit(new Action(UserIdPwdSigninWidgetActions.ACTION_SIGN_IN));
  }

  widgetLoadingSuccess(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('sign in widget loadin success');
        this.useridPasswordWidgetModels = data;
    }
  }

  widgetLoadingStarted(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('sign in widget loadin started');
    }
  }

  widgetLoadingFailed(name: string, data: any) {
    switch(name) {
      case WidgetNames.USERID_PWD_SIGNIN:
        console.log('sign in widget loadin failed');
    }
  }

  widgetActionFailed(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('sign in action failed');
    }
  }

  widgetActionSuccess(name: string, data: any) {
    switch(name) {
      case UserIdPwdSigninWidgetActions.ACTION_SIGN_IN:
        console.log('sign in action success');
        this.capRouter.routeByUrl('/home');
    }
  }

}
