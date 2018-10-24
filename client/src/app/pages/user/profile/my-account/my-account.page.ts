import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
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
export class MyAccountPage extends MyAccountComponent implements OnInit {

  titleValue: string = '';

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.get('my_account_page.my_account').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    if (pageName === 'logout') {
      this.logout();
    } else {
      this.routeByUrl(pageName);
    }
  }

  handleMyAccountLoadingFailed(data) {
    console.log('unable to load logout widget');
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
