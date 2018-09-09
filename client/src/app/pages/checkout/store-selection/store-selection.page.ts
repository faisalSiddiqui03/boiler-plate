import { Component, OnInit, EventEmitter } from '@angular/core';
import { BasePage } from '../../../base/base-page';
import { ConfigService, pwaLifeCycle, Action } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../helpers/utils';
import { StoreLocatorWidgetActions, OnWidgetLifecyle, OnWidgetActionsLifecyle } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.page.html',
  styleUrls: ['./store-selection.page.scss'],
})

@pwaLifeCycle()
export class StoreSelectionPage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  cityId;
  storeLocatorWidgetAction = new EventEmitter();
  stores: Array<any>;
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
  }

  ngOnInit() {
    this.cityId = this.route.snapshot.params.cityId;
    // if (this.cityId) {
    //   console.log('suno', this.cityId);
    //   this.storeLocatorWidgetAction.emit(new Action(
    //     StoreLocatorWidgetActions.FIND_ALL, 'S')
    //   );
    // }
  }

  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('failed name: ', name, ' data: ', data );
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('started name: ', name, ' data: ', data );
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('success name: ', name, ' data: ', data );
    if (name === 'STORE_SELECTOR' && this.globalSharedService.getFulfilmentMode()) {
      console.log("HAALO", this.globalSharedService);
      const stores = this.storeLocatorWidgetAction.emit(new Action(
        StoreLocatorWidgetActions.FIND_BY_CITY, [this.cityId, this.globalSharedService.getFulfilmentMode().mode])
      );
      console.log(stores);
    }
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('failed action name: ', name, ' data: ', data );
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('success action name: ', name, ' data: ', data );
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY:
        this.stores = data;
        break;
    }
  }
}
