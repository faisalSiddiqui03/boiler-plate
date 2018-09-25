import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  LogoutWidgetActions,
  LogoutWidget
} from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class MyAccountPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  titleValue:string = '';
  logoutWidgetAction = new EventEmitter();

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
    this.translate.get('my_account_page.my_account').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    if (pageName === 'logout') {
      const action = new Action(LogoutWidgetActions.ACTION_LOGOUT);
      this.logoutWidgetAction.emit(action);
    } else {
      this.router.navigateByUrl(pageName);
    }
  }

  async widgetActionFailed(name: string, data: any) {
    console.log('name action failed: ' + name + ' data: ' + data);
    switch (name) {
      case LogoutWidgetActions.ACTION_LOGOUT:
        const coupon_remove_success = await this.translate.instant('my_account_page.error_logging_out');
        this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case LogoutWidgetActions.ACTION_LOGOUT:
        const coupon_remove_success = await this.translate.instant('my_account_page.successfully_loged_out');
        this.router.navigateByUrl('home');
        this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }

}
