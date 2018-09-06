import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../../base/base-page';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class OrderHistoryPage extends BasePage implements OnInit {

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

}
