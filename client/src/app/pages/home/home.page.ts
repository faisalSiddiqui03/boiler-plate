import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  ConfigService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { Router } from '@angular/router';
import {
  LocationWidgetActions,
  FulfilmentModeWidgetActions,
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
export class HomePage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  bannerWidgetAction = new EventEmitter();
  bannerWidgetExecutor = new EventEmitter();
  fulfilmentModeWidgetAction = new EventEmitter();
  locationsWidgetAction = new EventEmitter();
  locationsWidgetActionGeometry = new EventEmitter();
  storeLocatorWidgetAction = new EventEmitter();

  /**default order mode is delivery */
    // orderMode = DeliveryModes.HOME_DELIVERY;
  dataLoaded: any = {};
  selectedCity = '';
  selectedCityCode;
  selectedArea = '';
  selectedAreaCode;
  selectedStore;
  dropdownViewStatus: Map<string, boolean> = new Map();
  bannerUrl: string;
  changeRequested: boolean = false;

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

  }

  ionViewDidEnter() {
    console.log('Utkarsha ', this.getCurrentStore())
    this.selectedStore = this.getCurrentStore();
    this.changeRequested = false;
  }

  widgetLoadingSuccess(name, data) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY_AREA:
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        console.log('unable to find store', data);
        this.navigateToDeals();
        break;
    }
  }

  widgetActionSuccess(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY_AREA:
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        console.log('store selected', data);
        if (data.length > 0) {
          this.setCurrentStore(data[0])
        }
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

    if (name === 'area' && !this.selectedCityCode) {
      return;
    }

    const nameExists = this.dropdownViewStatus.has(name);

    if (!nameExists) {
      this.dropdownViewStatus.set(name, true);
      return;
    }

    let dropdownViewStatus = this.dropdownViewStatus;
    const value = !dropdownViewStatus.get(name);
    this.dropdownViewStatus.forEach(function (value, key) {

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
    if (this.getFulfilmentMode() && this.getFulfilmentMode().mode === this.deliveryModes.PICKUP) {
      this.router.navigate(['/store-selection'], { queryParams: { 'cityId': this.selectedCityCode } });
      return;
    }

    const getAreasByCityName = new Action(LocationWidgetActions.ACTION_FETCH_AREAS_BY_CITY_CODE, city);
    this.locationsWidgetAction.emit(getAreasByCityName);
  }

  selectArea(area) {
    this.selectedArea = this.getAreaDisplayName(area);
    this.selectedAreaCode = area.code;

    console.log('selected area ', area);
    this.toggleDropDown('area', true, false);

  }


  isDropDownShown(name: string) {

    const nameExists = this.dropdownViewStatus.has(name);
    if (!nameExists) {
      return false;
    }

    return this.dropdownViewStatus.get(name);
  }

  // We should get display name from api
  getAreaDisplayName(area) {
    return this.translate.instant('home_page.block_') + area.pincode;
  }

  findStore() {
    // const findStore = new Action(StoreLocatorWidgetActions.FIND_BY_CITY_AREA,
    //   [this.selectedCityCode, this.selectedAreaCode, this.globalSharedService.getFulfilmentMode().mode]);
    this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_CITY_AREA,
      [this.selectedCityCode, this.selectedAreaCode, this.globalSharedService.getFulfilmentMode().mode]));
  }

  locateMe(lat, lng) {
    console.log('locate me ', lat, lng);

    if (this.getFulfilmentMode() && this.getFulfilmentMode().mode === this.deliveryModes.PICKUP) {
      this.router.navigate(['/store-selection'], { queryParams: { 'latitude': lat, 'longitude': lng } });
      return;
    }

    this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_LOCATION,
      [lat, lng, this.globalSharedService.getFulfilmentMode().mode]));
  }

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }

  navigateToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }

  changeOrderMode(mode) {
    this.fulfilmentModeWidgetAction.emit(new Action(FulfilmentModeWidgetActions.ACTION_CHANGE_MODE, mode));
    this.selectedCity = '';
    this.selectedCityCode = '';
    this.selectedArea = '';
    this.selectedAreaCode = '';
  }

  isStoreSelected() {
    return this.selectedStore && !this.selectedStore.isDefaultLocation && !this.changeRequested
    // return true;
  }

  changeSelectedStore() {
    this.changeRequested = true;
  }

  filterEmptyCities(cityList) {
    return cityList.filter(city => city.name !== '');
  }

  getDeliveryMode() {
    return this.globalSharedService.getFulfilmentMode() ? this.globalSharedService.getFulfilmentMode().mode : null;
  }
}
