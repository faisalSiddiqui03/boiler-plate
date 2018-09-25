import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import { pwaLifeCycle, pageView, OnWidgetActionsLifecyle, OnWidgetLifecyle } from '@capillarytech/pwa-framework';
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

}
