import { Component, OnInit, EventEmitter } from '@angular/core';
import { LifeCycle, Action, pwaLifeCycle, OnWidgetActionsLifecyle, OnWidgetLifecyle, ConfigService } from '@capillarytech/pwa-framework';
import { BasePage } from '../../base/base-page';
import { Router } from '@angular/router';
import { FulfilmentMode } from '@capillarytech/pwa-framework/services/fulfilment-mode/fulfilment-mode';
import {
  LocationWidgetActions,
  FulfilmentModeWidget,
  FulfilmentModeWidgetActions,
  StoreLocatorWidget,
  StoreLocatorWidgetActions,
  DeliveryModes
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

@pwaLifeCycle()
export class HomePage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  bundleWidgetAction = new EventEmitter();
  bundleWidgetExecutor = new EventEmitter();
  fullfillmentModeWidgetAction = new EventEmitter();
  locationsWidgetAction = new EventEmitter();
  storeLocatorWidgetAction = new EventEmitter();

  /**default order mode is delivery */
  orderMode = DeliveryModes.HOME_DELIVERY;
  dataLoaded: any = {};
  selectedCity = '';
  selectedCityCode;
  selectedArea = '';
  selectedAreaCode;
  dropdownViewStatus: Map<string, boolean> = new Map();
  bannerUrl: string;

  slideOpts = {
    effect: 'flip'
  };

  deliveryModes = DeliveryModes;
  constructor(
    private config: ConfigService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
  }

  ngOnInit() {
    this.orderMode = this.globalSharedService.getFulfilmentMode().mode;
  }

  widgetLoadingSuccess(name, data) {
    console.log('home page -> location widget', name, data);
  }

  handleWidgetLifecycle(x: LifeCycle) {
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case 'FIND_BY_CITY_AREA':
        console.log('unable to find store', data);
        this.navigateToDeals();
        break;
    }
  }

  widgetActionSuccess(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case 'FIND_BY_CITY_AREA':
        console.log('store selected', data);
        this.navigateToDeals();
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
  }

  widgetLoadingStarted(name: string, data: any) {

    console.log('name = ', name, ' data = ', data);
  }

  /**
   * @name: could be area, city town based on
   * requirement of brand
   */
  filterEntity(e, type) {

  }

  toggleDropDown(name: string, force: boolean = false, forceValue?: boolean) {

      let nameExists = this.dropdownViewStatus.has(name);

      if (!nameExists) {

          this.dropdownViewStatus.set(name, true)
          return;
      }

      let dropdownViewStatus = this.dropdownViewStatus;
      let value = !dropdownViewStatus.get(name);
      this.dropdownViewStatus.forEach(function ( value, key) {

          dropdownViewStatus.set(key, false);
      });

      this.dropdownViewStatus = dropdownViewStatus;
      this.dropdownViewStatus.set(name, value);

      if (force) {

          console.log(name, force, forceValue);
          this.dropdownViewStatus.set(name, forceValue);
          return;
      }
  }

  selectCity(city) {
    this.selectedCity = city.name;
    this.selectedCityCode = city.code;
    this.toggleDropDown('city', true, false);
    console.log('selected city ', city);

    if (this.orderMode === this.deliveryModes.PICKUP) {
      this.router.navigateByUrl('store-selection');
      return;
    }

    let getAreasByCityName = new Action(LocationWidgetActions.ACTION_FETCH_AREAS_BY_CITY_CODE, city);
    this.locationsWidgetAction.emit(getAreasByCityName);
  }

  selectArea(area) {
    this.selectedArea = this.getAreaDisplayName(area);
    this.selectedAreaCode = area.code;

    console.log('selected area ', area);
    this.toggleDropDown('area', true, false);

  }


  isDropDownShown(name: string) {

      let nameExists = this.dropdownViewStatus.has(name);
      if (!nameExists) {
          return false;
      }

      return this.dropdownViewStatus.get(name);
  }

  // We shouldget displayname from api
  getAreaDisplayName(area) {
      return this.translate.instant('home_page.block') + area.pincode;
  }

  findStore() {
      let findStore = new Action(StoreLocatorWidgetActions.FIND_BY_CITY_AREA,
        [this.selectedCityCode, this.selectedAreaCode, this.globalSharedService.getFulfilmentMode().mode]);

      this.storeLocatorWidgetAction.emit(findStore);
  }

  locateMe() {
    console.log('locate me');
  }

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }

  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }

  changeOrderMode(mode) {
    let changemode = new Action(FulfilmentModeWidgetActions.ACTION_CHANGE_MODE, this.orderMode);

    this.fullfillmentModeWidgetAction.emit(changemode);
  }
}
