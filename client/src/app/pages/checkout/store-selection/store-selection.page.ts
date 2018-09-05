import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../base/base-page';
import { ConfigService, pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router } from '@angular/router';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.page.html',
  styleUrls: ['./store-selection.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class StoreSelectionPage extends BasePage implements OnInit {

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private config: ConfigService) { 
    super();

    this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

}
