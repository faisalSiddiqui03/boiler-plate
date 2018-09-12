import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../base/base-component';
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
export class StoreSelectionPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  cityId;
  latitude;
  longitude;
  storeLocatorWidgetAction = new EventEmitter();
  stores: Array<any>;
  titleValue = '';
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
    this.route.queryParams.subscribe(params => {
        this.cityId = params.cityId;
        this.latitude = params.latitude;
        this.longitude = params.longitude;
    });
    // if (this.cityId) {
    //   console.log('suno', this.cityId);
    //   this.storeLocatorWidgetAction.emit(new Action(
    //     StoreLocatorWidgetActions.FIND_ALL, 'S')
    //   );
    // }

    this.translate.get('store_selection_page.stores_selection').subscribe(value => {
      this.titleValue = value;
    });
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
      if(this.cityId) {
        const stores = this.storeLocatorWidgetAction.emit(new Action(
            StoreLocatorWidgetActions.FIND_BY_CITY, [this.cityId, this.globalSharedService.getFulfilmentMode().mode])
        );

      } else if(this.latitude && this.longitude) {
        const stores = this.storeLocatorWidgetAction.emit(new Action(
            StoreLocatorWidgetActions.FIND_BY_LOCATION, [this.latitude, this.longitude, this.globalSharedService.getFulfilmentMode().mode])
        );
      }
    }
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('failed action name: ', name, ' data: ', data );
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('success action name: ', name, ' data: ', data );
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY:
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        this.stores = data;
        break;
    }
  }

  selectStore(store) {
    this.setCurrentStore(store)
    this.navigateToDeals();
  }
}
