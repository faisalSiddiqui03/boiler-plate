import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../base/base-component';
import { ConfigService, pwaLifeCycle, Action, DeliveryModes } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../helpers/utils';
import { StoreLocatorWidgetActions, OnWidgetLifecyle, OnWidgetActionsLifecyle, CapRouterService } from '@capillarytech/pwa-framework';
import { Location } from '@angular/common';

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
  deliveryModes: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.deliveryModes = DeliveryModes;

    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cityId = params.cityId;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
      if (!this.cityId && !this.latitude && !this.longitude) {
        this.goToHome();
      }
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
    this.capRouter.routeByUrlWithLanguage('/products?category=desls&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=desls&id=CU00215646'));
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('failed name: ', name, ' data: ', data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('started name: ', name, ' data: ', data);
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('success name: ', name, ' data: ', data);
    if (name === 'STORE_SELECTOR' && this.globalSharedService.getFulfilmentMode()) {
      if (this.cityId) {
        const stores = this.storeLocatorWidgetAction.emit(new Action(
          StoreLocatorWidgetActions.FIND_BY_CITY, [this.cityId, this.globalSharedService.getFulfilmentMode().mode])
        );

      } else if (this.latitude && this.longitude) {
        const stores = this.storeLocatorWidgetAction.emit(new Action(
          StoreLocatorWidgetActions.FIND_BY_LOCATION, [this.latitude, this.longitude, this.globalSharedService.getFulfilmentMode().mode])
        );
      }
    }
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('failed action name: ', name, ' data: ', data);
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('success action name: ', name, ' data: ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY:
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        if (!data || data.length === 0) {
          this.goToHome();
        }
        this.stores = this.filterTakeawayStores(data);
        break;
    }
  }

  filterTakeawayStores(storesList) {
    const stores = storesList.filter(store =>
      store.deliveryModes.includes(this.deliveryModes.PICKUP)
    );
    return stores;
  }

  selectStore(store) {
    this.setCurrentStore(store);
    this.navigateToDeals();
  }

  goToHome() {
    this.capRouter.routeByUrlWithLanguage('/home');
    // this.router.navigateByUrl(this.utilService.getLanguageCode() + '/home');
  }

  getTime(store, time) {
    let storeTiming;
    if (time === 'onTime') {
      storeTiming = store.currentDateStoreTime.get(this.deliveryModes.PICKUP).onTime;
    } else if (time === 'offTime') {
      storeTiming = store.currentDateStoreTime.get(this.deliveryModes.PICKUP).offTime;
    }
    const min = storeTiming.getMinutes() < 10 ? '0' + storeTiming.getMinutes() : storeTiming.getMinutes();
    const hours = storeTiming.getHours() > 10 ? storeTiming.getHours() : '0' + storeTiming.getHours();
    const meridiem = storeTiming.getHours() < 12 ? 'AM' : 'PM';

    return hours + ':' + min + ' ' + meridiem;
  }

}
