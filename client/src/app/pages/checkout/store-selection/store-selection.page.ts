import { Component, OnInit, EventEmitter } from '@angular/core';
import { BasePage } from '../../../base/base-page';
import { ConfigService, pwaLifeCycle, pageView, Action } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../helpers/utils';
import {
  StoreLocatorWidget,
  StoreLocatorWidgetActions
} from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.page.html',
  styleUrls: ['./store-selection.page.scss'],
})

@pwaLifeCycle()
export class StoreSelectionPage extends BasePage implements OnInit {

  cityId;
  storeLocatorWidgetAction = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService) {
    super();

    // this.loaderService.startLoading();
    this.translate.use(Utils.getLanguageCode());
    // this.activateRoute.paramMap.subscribe(params => {
    //   this.cityId = params['cityId'];
    // });
  }

  ngOnInit() {
    this.cityId = this.route.snapshot.params.cityId;
    // console.log("vivek", this.getFulfilmentMode());
    const deliveryMode = 'S';
    // this.getFulfilmentMode() ? this.getFulfilmentMode().mode : 'S';
    if (this.cityId) {
      const getStoreByCityName = new Action(
        StoreLocatorWidgetActions.FIND_BY_CITY,
        [
          '37675',
          'S'
        ]);
      console.log("chek", this.cityId);
      this.storeLocatorWidgetAction.emit(getStoreByCityName);
    }
  }

  widgetActionFailed(name: string, data: any) {

    console.log('chek failed name = ', name, ' data = ', data);
  }

  widgetActionSuccess(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case 'FIND_BY_CITY':
        console.log('chek store list', data);
        break;
    }
  }

  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }

}
