import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  ConfigService
} from '@capillarytech/pwa-framework';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '../../base/base-component';
import { Router } from '@angular/router';
import {
  LocationWidgetActions,
  FulfilmentModeWidgetActions,
  StoreLocatorWidgetActions,
  DeliveryModes
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../helpers/utils';
import { DeliverySlotSelectionPage } from '../checkout/delivery-slot-selection/delivery-slot-selection.page';

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
  hasError: { [name:string] : string | boolean } = {};

  deliveryModes = DeliveryModes;

  constructor(
    private config: ConfigService,
    private router: Router,
    private translate: TranslateService,
    public modalController: ModalController
  ) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
    this.hasError = {
      selectAreaInput: false
    };
  }

  ngOnInit() {
    console.log('------>', this.getCurrentStore());
  }

  ionViewDidEnter() {
    this.selectedStore = this.getCurrentStore();
    this.changeRequested = false;
  }

  widgetLoadingSuccess(name, data) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        console.log('unable to find store', data);
        // this.navigateToDeals();
        break;
    }
  }

  widgetActionSuccess(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY_AREA:
        if (data.length) {
          this.setCurrentStore(data[0]);
          this.navigateToDeals();
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        if (data.length) {
          this.setCurrentStore(data[0]);
          this.navigateToDeals();
        }
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

  isCitySelected() {
    this.hasError.selectAreaInput = !this.selectedCity;
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
    let previousCity = this.selectedCity ? this.selectedCity : '';
    this.selectedCity = city.name;
    this.selectedCityCode = city.code;
    this.toggleDropDown('city', true, false);
    if (previousCity !== this.selectedCity) {
      this.selectedArea = '';
      this.toggleDropDown('area');
    }
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
    if (Utils.isEmpty(this.getDeliverySlot())) {
      this.presentSlotModal()
    } else {
      this.router.navigateByUrl('/products/listing/(0:0)?category=deals&id=CU00215646');
    }

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

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage,
    });
    return await modal.present();
  }

  filterEmptyCities(cityList) {
    return cityList.filter(city => city.name !== '');
  }

  filterEntires(cityList, searchTerm) {
    return cityList.filter(city => (city.name || '').includes(searchTerm) && city.name);
  }

  getDeliveryMode() {
    return this.globalSharedService.getFulfilmentMode() ? this.globalSharedService.getFulfilmentMode().mode : null;
  }
}
