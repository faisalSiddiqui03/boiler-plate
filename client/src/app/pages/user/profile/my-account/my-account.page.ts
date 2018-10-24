import { Component, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { MyAccountComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class MyAccountPage extends MyAccountComponent {

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private capRouter: CapRouterService,
  ) {
    super();
  }

  goToPage(pageName) {
    if (pageName === 'logout') {
      this.logout();
    } else {
      this.capRouter.routeByUrl(pageName);
    }
  }

  async handleMyAccountActionLogoutFailed(data) {
    const error_logging_out = await this.translate.instant('my_account_page.error_logging_out');
    await this.alertService.presentToast(error_logging_out, 3000, 'bottom');
  }

  async handleMyAccountActionLogoutSuccess(data) {
    const successfully_loged_out = await this.translate.instant('my_account_page.successfully_loged_out');
    await this.alertService.presentToast(successfully_loged_out, 3000, 'bottom');
    this.capRouter.routeByUrl('/home');
  }

}
