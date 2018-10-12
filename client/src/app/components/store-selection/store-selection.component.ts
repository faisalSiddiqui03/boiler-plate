import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../base/base-component';
import {
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  ConfigService,
  DeliveryModes,
  StoreLocatorWidgetActions,
  Action,
  LocationWidgetActions,
  CartWidgetActions,
  FulfilmentModeWidgetActions, LanguageService, CapRouterService
} from '@capillarytech/pwa-framework';
import { StoreListComponent } from '../store-list/store-list.component';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.component.html',
  styleUrls: ['./store-selection.component.scss']
})

@pwaLifeCycle()
export class StoreSelectionComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  bannerRefCode: string;
  bannerUrl: string;
  bannerWidgetAction = new EventEmitter();
  bannerWidgetExecutor = new EventEmitter();
  fulfilmentModeWidgetAction = new EventEmitter();
  locationsWidgetAction = new EventEmitter();
  locationsWidgetActionGeometry = new EventEmitter();
  storeLocatorWidgetAction = new EventEmitter();
  cartWidgetAction = new EventEmitter();
  // dataLoaded: any = {};
  changeRequested = false;
  deliveryModes = DeliveryModes;
  dropdownViewStatus: Map<string, boolean> = new Map();
  selectedCity = '';
  selectedCityCode;
  selectedArea = '';
  selectedAreaCode;
  selectedStore;
  hasError: { [name: string]: string | boolean } = {};
  citySelectionHistory: any = {};
  isNavigationClicked = false;
  lat;
  lng;
  isCleared = false;
  clearCartPopup = false;

  @Input() isModal: false;
  constructor(
    private config: ConfigService,
    private loaderService: LoaderService,
    private translate: TranslateService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private modalController: ModalController,
    private languageService: LanguageService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.bannerRefCode = this.config.getConfig()['headerBannerRefCode'];
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
    this.hasError = {
      selectAreaFirst: false
    };
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
    // this.selectedStore = this.getCurrentStore();
  }

  ionViewDidEnter() {
    this.selectedStore = this.getCurrentStore();
    console.error('selected store', this.getCurrentStore());
    this.changeRequested = false;
  }

  widgetLoadingStarted(name, data) {
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {

  }

  widgetLoadingFailed(name, data) {
    console.log('Widget loading failed' + name, data);
  }

  // WARNING : Do not add loaderService.stopLoading(); before switch case or at any place except 
  // existing stop loading.
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
          this.navigateToDeals();
          // }
        } else {

          const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
          this.alertService.presentToast(store_alert, 3000, 'top');
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
      this.loaderService.stopLoading();
        if (!this.isModal) {
          if (data && data.length) {
            this.capRouter.routeByUrlWithLanguage('/store-selection?latitude=' + this.lat + '&longitude=' + this.lng);
          } else {
            const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
            this.alertService.presentToast(store_alert, 3000, 'top');
          }
        } else {
          // open another modal with store selection
          await this.openStoreListModal();
        }
        break;
      case StoreLocatorWidgetActions.FIND_BY_CITY:
        this.loaderService.stopLoading();
        if (!this.isModal) {
          if (data && data.length) {
            this.capRouter.routeByUrlWithLanguage('/store-selection?cityId=' + this.selectedCityCode);
          } else {
            const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
            this.alertService.presentToast(store_alert, 3000, 'top');
          }
        } else {
          // open another modal with store selection
          await this.openStoreListModal();
        }
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        const alert_text = await this.translate.instant('cart.item_removed');
        this.alertService.presentToast(alert_text, 3000, 'bottom');
        break;
      case LocationWidgetActions.FETCH_AREAS_BY_CITY_CODE:
        if (data && data.length === 1) {
          this.selectArea(data[0]);
        }
        break;
    }
  }

  async switchLanguage() {
    const langCode = this.getCurrentLanguageCode();
    switch (langCode) {
      case 'ar':
        await this.languageService.updateLanguageByCode('en');
        this.capRouter.routeByUrlWithLanguage('home');
        break;
      case 'en':
        await this.languageService.updateLanguageByCode('ar');
        this.capRouter.routeByUrlWithLanguage('home');
        break;
      default:
        // do nothing
        break;
    }
  }

  async openStoreListModal() {
    const modal = await this.modalController.create({
      component: StoreListComponent,
      componentProps: {
        cityId: this.selectedCityCode,
        latitude: this.lat,
        longitude: this.lng,
        isModal: true
      }
    });
    await modal.present();

    modal.onDidDismiss().then((storeSelected) => {
      if(storeSelected.data){
        this.modalController.dismiss(true);
      }
    });
  }

  findStore() {
    this.isNavigationClicked = true;
    if (this.getDeliveryMode() === this.deliveryModes.HOME_DELIVERY) {
      this.loaderService.startLoadingByMode('', this.getDeliveryMode());
      this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_AREA,
        [this.selectedAreaCode, this.getDeliveryMode()]));
    } else {
      this.loaderService.startLoadingByMode('', this.getDeliveryMode());

      if( !this.selectedCityCode ) {
        
        this.navigateToDeals();
        return;
      }

      this.storeLocatorWidgetAction.emit(
        new Action(
          StoreLocatorWidgetActions.FIND_BY_CITY,
          [this.selectedCityCode, this.getDeliveryMode()]
        )
      )
    }
  }

  navigateToDeals() {
    if (this.isModal) {
      return this.modalController.dismiss(true);
    }
    this.isNavigationClicked = true;
    this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
  }

  widgetActionFailed(name: string, data: any) {
    this.loaderService.stopLoading();
    console.log('failed name = ', name, ' data = ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        console.log('unable to find store', data);
        break;
      case StoreLocatorWidgetActions.FIND_BY_AREA:
        console.log('unable to find store', data);
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        this.alertService.presentToast('failed to remove cart items', 3000, 'bottom');
        break;
    }
  }

  isDropDownShown(name: string) {

    const nameExists = this.dropdownViewStatus.has(name);
    if (!nameExists) {
      return false;
    }

    return this.dropdownViewStatus.get(name);
  }

  isStoreSelected() {
    return this.getCurrentStore() && !this.getCurrentStore().isDefaultLocation && !this.changeRequested;
  }

  changeSelectedStore() {
    this.changeRequested = true;
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

  filterEntity(e, type) {

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
    if (this.getDeliveryMode() && this.getDeliveryMode() === this.deliveryModes.PICKUP) {
      this.checkIfStoresAreAvailable(this.selectedCityCode);
      return;
    }

    const getAreasByCityName = new Action(LocationWidgetActions.FETCH_AREAS_BY_CITY_CODE, [city]);
    this.locationsWidgetAction.emit(getAreasByCityName);
  }

  checkIfStoresAreAvailable(cityId, lat = 0, lng = 0) {
    if (cityId) {
      const stores = this.storeLocatorWidgetAction.emit(new Action(
        StoreLocatorWidgetActions.FIND_BY_CITY, [cityId, this.getDeliveryMode()])
      );

    } else if (lat && lng) {
      const stores = this.storeLocatorWidgetAction.emit(new Action(
        StoreLocatorWidgetActions.FIND_BY_LOCATION, [lat, lng, this.getDeliveryMode()])
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

  getAreaDisplayName(area) {
    if (area.pincode) {
      return this.translate.instant('home_page.block_') + area.pincode;
    } else if (area.name && area.name.indexOf('_') !== -1) {
      return this.translate.instant('home_page.block_') + area.name.split('_')[1];
    }
    return area.name;
  }

  filterEmptyCities(cityList) {
    return cityList.filter(city => city.name !== '');
  }

  filterEntires(cityList, searchTerm) {
    const searchSubString = this.isCleared ? '' : searchTerm.toLowerCase();
    return (cityList || []).filter(city => (city.name.toLowerCase() || '').includes(searchSubString) && city.name);
  }

  locateMe(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.loaderService.startLoading('Fetching Stores', this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    if (this.getDeliveryMode() && this.getDeliveryMode() === this.deliveryModes.PICKUP) {
      this.checkIfStoresAreAvailable(null, lat, lng);
      return;
    }

    this.storeLocatorWidgetAction.emit(new Action(StoreLocatorWidgetActions.FIND_BY_LOCATION,
      [lat, lng, this.getDeliveryMode()]));
  }

  isCitySelected() {
    this.hasError.selectAreaFirst = !this.selectedCity;
  }

  isCartNotEmpty() {
    return this.getCart() && this.getCart().items.length;
  }

  changeOrderMode(mode, previousMode, force: boolean = false) {
    // TODO:: add alert-controller to confirm before emptying cart
    if (mode !== previousMode && this.isCartNotEmpty()) {
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

  getBannerRefCodeWithLangCode(refCode: string) {
    return refCode + this.getCurrentLanguage().code;
  }

  getFullBannerUrl(src) {
    return (Array.isArray(src) && src.length > 0)
      ? this.bannerUrl + src[0].contentUrl + '?height=170&width=340&builder=freeimage'
      : this.getCurrentLanguageCode() === 'en' ? 'https://www.kuwait.pizzahut.me/assets/imgs/PH-60th-Years-FCDS-Deals-Banner-eng.jpg'
        : 'https://www.kuwait.pizzahut.me/assets/imgs/PH-60th-Years-FCDS-Deals-Banner-ar.jpg'
  }

  dismissClearCartPopup() {
    this.clearCartPopup = false;
  }

  toggleOrderMode(force: boolean = false) {
    const presentMode = this.getDeliveryMode();
    const toMode = presentMode === this.deliveryModes.HOME_DELIVERY ? this.deliveryModes.PICKUP : this.deliveryModes.HOME_DELIVERY;
    this.changeOrderMode(toMode, presentMode, force);
  }

  preventPropogation(e) {
    e.preventDefault();
    e.stopPropagation();
  }

}
