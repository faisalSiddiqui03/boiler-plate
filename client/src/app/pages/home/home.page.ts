import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  ConfigService,
  LanguageService,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '../../base/base-component';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LocationWidgetActions,
  FulfilmentModeWidgetActions,
  StoreLocatorWidgetActions,
  CartWidgetActions,
  DeliveryModes,
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';
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
  cartWidgetAction = new EventEmitter();

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
  isCleared = false;
  deliveryModes = DeliveryModes;
  asSoonPossible = false;
  isNavigationClicked = false;
  lat;
  lng;
  clearCartPopup: boolean = false;

  constructor(
    private config: ConfigService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    public modalController: ModalController,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private langService: LanguageService,
    private utilService: UtilService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
    this.hasError = {
      selectAreaFirst: false
    };
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ionViewDidEnter() {
    this.selectedStore = this.getCurrentStore();
    this.changeRequested = false;
  }

  ionViewWillLeave() {
    this.isNavigationClicked = false;
  }

  widgetLoadingSuccess(name, data) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetActionFailed(name: string, data: any) {

    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        this.loaderService.stopLoading();
        console.log('unable to find store', data);
        break;
      case StoreLocatorWidgetActions.FIND_BY_AREA:
        this.loaderService.stopLoading();
        console.log('unable to find store', data);
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        this.alertService.presentToast('failed to remove cart items', 3000, 'bottom');
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_AREA:
        if (data.length) {
          const firstStore = data[0];
          // TODO:: add alert-controller to confirm before emptying cart
          if (this.isStoreSelected() && this.getCurrentStore().id !== firstStore.id) {
            this.cartWidgetAction.emit(new Action(CartWidgetActions.ACTION_CLEAR_CART));
          }
          this.setCurrentStore(firstStore);
        } else {
          this.loaderService.stopLoading();
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        if (data.length) {
          this.setCurrentStore(data[0]);
        } else {
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_CITY:
        this.loaderService.stopLoading();
        if (data && data.length !== 0) {
          this.router.navigate(['/store-selection'], { queryParams: { 'cityId': this.selectedCityCode } });
        } else {
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        this.loaderService.stopLoading();
        if (data && data.length !== 0) {
          this.router.navigate(['/store-selection'], { queryParams: { 'latitude': this.lat, 'longitude': this.lng } });
        } else {
          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'bottom');
        }
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        this.alertService.presentToast('removed cart items', 3000, 'bottom');
        break;
      case LocationWidgetActions.FETCH_AREAS_BY_CITY_CODE:
        if (data && data.length === 1) {
          this.selectArea(data[0]);
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
    this.isCleared = false;
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
      this.checkIfStoresAreAvailable(this.selectedCityCode);
      return;
    }

    const getAreasByCityName = new Action(LocationWidgetActions.FETCH_AREAS_BY_CITY_CODE, [city]);
    this.locationsWidgetAction.emit(getAreasByCityName);
  }

  checkIfStoresAreAvailable(cityId, lat = 0, lng = 0) {
    this.loaderService.startLoading('Fetching Stores', this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    if (cityId) {
      const stores = this.storeLocatorWidgetAction.emit(new Action(
        StoreLocatorWidgetActions.FIND_BY_CITY, [cityId, this.globalSharedService.getFulfilmentMode().mode])
      );

    } else if (lat && lng) {
      const stores = this.storeLocatorWidgetAction.emit(new Action(
        StoreLocatorWidgetActions.FIND_BY_LOCATION, [lat, lng, this.globalSharedService.getFulfilmentMode().mode])
      );
    }
    return;
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
    if (area.pincode) {
      return this.translate.instant('home_page.block_') + area.pincode;
    }
    return area.name;
  }

  findStore() {
    this.isNavigationClicked = true;
    if (this.getFulfilmentMode().mode === this.deliveryModes.HOME_DELIVERY) {
      this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_AREA,
        [this.selectedAreaCode, this.globalSharedService.getFulfilmentMode().mode]));
    } else {
      this.storeLocatorWidgetAction.emit(
        new Action(
          StoreLocatorWidgetActions.FIND_BY_CITY,
          [this.selectedCityCode, this.getFulfilmentMode().mode]
        )
      )
    }
    this.loaderService.startLoading('Fetching Stores', this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
  }

  locateMe(lat, lng) {
    console.log('locate me ', lat, lng);
    this.lat = lat;
    this.lng = lng;
    if (this.getFulfilmentMode() && this.getFulfilmentMode().mode === this.deliveryModes.PICKUP) {
      this.checkIfStoresAreAvailable(null, lat, lng);
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
    this.loaderService.stopLoading();
    this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=deals&id=CU00215646'));

  }

  changeOrderMode(mode, previousMode, force: boolean = false) {
    // TODO:: add alert-controller to confirm before emptying cart
    if (mode !== previousMode && !this.isCartEmpty()) {
      if (!force) {
        this.clearCartPopup = true;
        return;
      }
      this.cartWidgetAction.emit(new Action(CartWidgetActions.ACTION_CLEAR_CART));
    }

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

  filterEmptyCities(cityList) {
    return cityList.filter(city => city.name !== '');
  }

  filterEntires(cityList, searchTerm) {
    const searchSubString = this.isCleared ? '' : searchTerm.toLowerCase();
    return (cityList || []).filter(city => (city.name.toLowerCase() || '').includes(searchSubString) && city.name);
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

  isCartEmpty() {
    if (this.getCart().items.length === 0) {
      return true;
    }
    return false;
  }

  dismissClearCartPopup() {
    this.clearCartPopup = false;
  }

  toggleOrderMode(force: boolean = false) {
    const presentMode = this.getFulfilmentMode().mode;
    const toMode = presentMode === this.deliveryModes.HOME_DELIVERY ? this.deliveryModes.PICKUP : this.deliveryModes.HOME_DELIVERY;
    this.changeOrderMode(toMode, presentMode, force);
  }
}
