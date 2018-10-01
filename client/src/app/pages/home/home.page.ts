import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
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
  DeliveryModes,
  DeliverySlotsWidget
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../helpers/utils';
import { DeliverySlotSelectionPage } from '../checkout/delivery-slot-selection/delivery-slot-selection.page';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
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
  changeRequested = false;
  hasError: { [name: string]: string | boolean } = {};
  citySelectionHistory: any = {};

  deliveryModes = DeliveryModes;
  asSoonPossible = false;
  fetchDeliverySlots = false;
  isNavigationClicked = false;

  constructor(
    private config: ConfigService,
    private router: Router,
    private translate: TranslateService,
    public modalController: ModalController,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
    this.hasError = {
      selectAreaFirst: false
    };
  }

  ngOnInit() {
    console.log('------>', this.getCurrentStore());
  }

  ionViewDidEnter() {
    this.selectedStore = this.getCurrentStore();
    this.changeRequested = false;
    if (this.isStoreSelected()) {
      this.fetchDeliverySlots = true;
    }
  }

  ionViewWillLeave() {
    this.fetchDeliverySlots = false;
    this.isNavigationClicked = false;
  }

  widgetLoadingSuccess(name, data) {
    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case 'DELIVERYSLOTS':
        this.loaderService.stopLoading();
        this.fetchDeliverySlots = false;
        if (data && data.length) {
          this.asSoonPossible = data[0].id === -1;
        }
        if (this.asSoonPossible) {
          this.setDeliverySlot(data[0]);
        }
        if (this.isNavigationClicked) {
          this.isNavigationClicked = false;
          this.navigateToDeals();
        }
    }
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        this.loaderService.stopLoading();
        console.log('unable to find store', data);
        // this.navigateToDeals();
        break;
      case StoreLocatorWidgetActions.FIND_BY_CITY_AREA:
        this.loaderService.stopLoading();
        console.log('unable to find store', data);
        // this.navigateToDeals();
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY_AREA:
        if (data.length) {
          this.setCurrentStore(data[0]);
          this.fetchDeliverySlots = true;
        } else {
          this.loaderService.stopLoading();
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        if (data.length) {
          this.setCurrentStore(data[0]);
          this.fetchDeliverySlots = true;
        } else {
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
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
    this.hasError.selectAreaFirst = !this.selectedCity;
  }

  toggleDropDown(name: string, force: boolean = false, forceValue?: boolean) {

    if (name === 'area' && !this.selectedCityCode) {
      return;
    } else if (name === 'area' && this.selectedCityCode) {
      this.hasError.selectAreaInput = false;
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
    this.hasError.selectAreaFirst = false;
    const previousCity = this.selectedCity ? this.selectedCity : '';
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
    this.isNavigationClicked = true;
    this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_CITY_AREA,
      [this.selectedCityCode, this.selectedAreaCode, this.globalSharedService.getFulfilmentMode().mode]));
    this.loaderService.startLoading('Fetching Stores');
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
    this.isNavigationClicked = true;
    if (this.fetchDeliverySlots) {
      this.loaderService.startLoading();
      return;
    }
    if (!this.asSoonPossible || Utils.isEmpty(this.getDeliverySlot())) {
      this.presentSlotModal();
    }
    // this.router.navigateByUrl('/products/listing/(0:0)?category=deals&id=CU00215646');
    this.router.navigateByUrl('/products?category=deals&id=CU00215646');
  }

  changeOrderMode(mode, previousMode) {
    this.toggleDropDown('area', true, false);
    this.toggleDropDown('city', true, false);
    this.citySelectionHistory[previousMode] = {
      selectedCity: this.selectedCity || '',
      selectedCityCode: this.selectedCityCode || '',
      selectedArea: this.selectedArea || '',
      selectedAreaCode: this.selectedAreaCode || ''
    };
    this.fulfilmentModeWidgetAction.emit(new Action(FulfilmentModeWidgetActions.ACTION_CHANGE_MODE, mode));
    const selected = this.citySelectionHistory[mode] || {};
    this.selectedCity = selected.selectedCity || '';
    this.selectedCityCode = selected.selectedCityCode || '';
    this.selectedArea = selected.selectedArea || '';
    this.selectedAreaCode = selected.selectedAreaCode || '';
  }

  isStoreSelected() {
    return this.selectedStore && !this.selectedStore.isDefaultLocation && !this.changeRequested;
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

  outSideClick() {
    if (this.dropdownViewStatus.get('area')) {
      this.toggleDropDown('area', true, false);
    }
    if (this.dropdownViewStatus.get('city')) {
      this.toggleDropDown('city', true, false);
    }
  }

  preventPropogation(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
