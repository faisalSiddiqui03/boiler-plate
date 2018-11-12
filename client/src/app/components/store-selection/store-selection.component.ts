import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Store } from '@cap-service/store';
import {AlertService, LoaderService} from '@capillarytech/pwa-ui-helpers';
import { AlertController, ModalController } from '@ionic/angular';
import {TranslateService} from '@capillarytech/pwa-framework';
import {
  pwaLifeCycle,
  LanguageService,
  CapRouterService, DeliveryModes
} from '@capillarytech/pwa-framework';
import { StoreListComponent } from '../store-list/store-list.component';
import { StoreSelectionComponent, ViewStatus } from '@capillarytech/pwa-components/selection-component/store-selection';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.component.html',
  styleUrls: ['./store-selection.component.scss']
})
@pwaLifeCycle()
export class SelectionComponent extends StoreSelectionComponent {

  bannerRefCode: string;
  bannerUrl: string;

  hasError: { [name: string]: string | boolean } = {};
  sizeConfig = [
    {'height': 200, 'width': 400, 'type': 'mobile'},
    {'height': 400, 'width': 1200, 'type': 'desktop'}
  ];
  @Input() isModal: false;

  searchTerm = { city: '', area: '' };
  clearCartPromise = {
    resolve: null,
    reject: null
  };
  private retryFailures = {
    retryArea: 0,
    retryStore: 0
  };

  constructor(
    private loaderService: LoaderService,
    private translate: TranslateService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private alertService: AlertService,
    private modalController: ModalController,
    private languageService: LanguageService,
    private capRouter: CapRouterService,
    private alertController: AlertController,
  ) {
    super(capRouter);

    this.bannerUrl = this.configService.getConfig()['banner_base_url'];
    this.bannerRefCode = this.configService.getConfig()['headerBannerRefCode'];

    this.hasError = {
      selectAreaFirst: false
    };
  }

  isDropDownShown() {
    return false;
  }

  switchLanguageForApp() {

    const code = this.getCurrentLanguageCode();
    if (code === 'en') {
      this.switchLanguage('ar');
      return;
    }

    this.switchLanguage('en');
  }

  // to stop auto selection of store.
  handleAreaSelection(area) {}
  handleAreaSelectionStarted(area) {

    this.searchTerm.area = this.getAreaDisplayName(area);
  }

  async handleCitySelectionStarted(city) {

      this.hasError.selectAreaFirst = false;
      this.searchTerm.city = city.name;
      this.searchTerm.area = '';
      this.clearSelectedArea(this.getDeliveryMode());
      this.hasError.changeCity = true;

      if (this.getDeliveryMode() === DeliveryModes.PICKUP) {
          await this.loaderService.startLoadingByMode('', this.getDeliveryMode());
      }
  }

  toggleAreaView(status: ViewStatus) {

    if (!this.searchTerm.city && status === ViewStatus.DEFAULT) {
      this.hasError.selectAreaFirst = true;
      return;
    }

    super.toggleAreaView(status);
  }

  restoreCityName() {

    if (!this.isCityVisible() && !this.searchTerm.city) {

      if (this.getSelectedCity().code) {
        this.searchTerm.city = this.getSelectedCity().name;
      }
    }
  }

  changeOrderModeOfApp(mode: DeliveryModes, event) {

    if (!this.isEmptyCart()) {
      this.presentAlert(null, mode, event);
      return;
    }

    const cityName = this.getSelectedCity(mode).name;
    this.searchTerm.city = cityName ? cityName : '';
    this.searchTerm.area = this.getAreaDisplayName(this.getSelectedArea(mode));
    this.changeOrderMode(mode);
    // so that ngzone is triggered again
    event.target.click();
  }

  getAreaDisplayName(area) {

    if (area.pincode) {
      return this.translate.instant('home_page.block_') + area.pincode;
    } else if (area.name && area.name.indexOf('_') !== -1) {
      return this.translate.instant('home_page.block_') + area.name.split('_')[1];
    }
    return area.name;
  }

  getDefaultUrl() {

    if (this.getCurrentLanguageCode() === 'en') {

      return'https://www.kuwait.pizzahut.me/assets/imgs/PH-60th-Years-FCDS-Deals-Banner-eng.jpg';
    }

    return 'https://www.kuwait.pizzahut.me/assets/imgs/PH-60th-Years-FCDS-Deals-Banner-ar.jpg';
  }

  getBannerRefCodeWithLangCode(refCode: string) {

    return refCode + this.getCurrentLanguage().code;
  }

  getBannerUrlBySrc(src) {

    return this.bannerUrl + src[0].contentUrl + '?height=170&width=340&builder=freeimage';
  }

  getFullBannerUrl(src) {

    return (Array.isArray(src) && src.length > 0) ? this.getBannerUrlBySrc(src) : this.getDefaultUrl();
  }

  isStoreSelectionButtonEnabled() {

    if ( this.searchTerm.area && this.searchTerm.city ) {
      return true;
    }

    if ( this.getDeliveryMode() === DeliveryModes.PICKUP && this.searchTerm.city ) {
      return true;
    }

    if ( this.getDeliveryMode() === DeliveryModes.PICKUP && !this.isDefaultLocation() ) {
      return true;
    }

    return false;
  }

  async handleWidgetActionClearCartFailed(data: any) {

    const alert_text = await this.translate.instant('cart.item_removed_failure');
    await this.alertService.presentToast(alert_text, 30000, 'bottom');

    if (this.clearCartPromise.reject !== null) {
      this.clearCartPromise.reject();
    }
  }

  async handleWidgetActionClearCartSuccess(data: any) {

    const alert_text = await this.translate.instant('cart.item_removed');
    await this.alertService.presentToast(alert_text, 3000, 'bottom');

    if (this.clearCartPromise.resolve !== null) {
      this.clearCartPromise.resolve();
    }
  }

  async handleWidgetActionFindAreasByCityFailed(data: any) {

    if ( this.retryFailures.retryArea >= 3 ) {

      const store_alert = await this.translate.instant('home_page.unable_to_get_areas');
      await this.alertService.presentToast(store_alert, 3000, 'top');

      return;
    }

    this.retryFailures.retryArea = this.retryFailures.retryArea + 1;
    const city = this.getSelectedCity();
    this.findAreasByCity(city);
  }

  handleWidgetActionFindAreasByCitySuccess(data: any): any {

    this.hasError.changeCity = false;
    this.searchTerm.area = '';
    if ( data && data.length === 1 ) {

      this.selectArea(data[0]);
    }
  }

  async handleWidgetActionFindByAreaFailed(data: any) {

    if ( this.retryFailures.retryStore >= 3 ) {

      const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
      await this.alertService.presentToast(store_alert, 3000, 'top');

      return;
    }

    this.retryFailures.retryStore = this.retryFailures.retryStore + 1;
    const area = this.getSelectedArea();
    this.findStoresByArea(area);
  }

  async fetchStore() {

    await this.loaderService.startLoadingByMode('', this.getDeliveryMode());
    if (this.getDeliveryMode() === DeliveryModes.HOME_DELIVERY) {

      const area = this.getSelectedArea();
      this.findStoresByArea(area);
      return;
    }

    // if store is selected then just use it
    if (!this.isDefaultLocation()) {

      this.navigateToDeals();
      return;
    }

    const city = this.getSelectedCity();
    this.findStoresByCity(city);
  }

  dismissRemoveItemPopup(store) {

    console.log('dismissed the pop up');
  }

  async removeCartItem(store, mode?: DeliveryModes, event?) {

    await this.loaderService.startLoadingByMode('', this.getDeliveryMode());
    const promise = new Promise((resolve, reject) => {

      this.clearCartPromise.resolve = resolve;
      this.clearCartPromise.reject = reject;
    }).then(() => {

      if ( store !== null ) {
        this.setStoreAndRedirect(store);
        return;
      }
      // toggling mode
      this.loaderService.stopLoading();
      this.changeOrderModeOfApp(mode, event);
    }).catch( error => {

      // this should show cart could not be cleared
    });
    this.clearCart();
  }

  setStoreAndRedirect(store) {

    this.setCurrentStore(store);
    this.navigateToDeals();
  }

  async presentAlert(store, mode: DeliveryModes = null, event = null) {

    const cartConfirm = await this.translate.instant('cart.confirm');
    const cartDismiss = await this.translate.instant('cart.dismiss');
    const confirmRemove = await this.translate.instant('cart.confirm_remove');
    const alert = await this.alertController.create({
      message: confirmRemove,
      cssClass: 'alert-modal',
      buttons: [
        {
          text: cartDismiss,
          role: 'cancel',
          cssClass: 'btn-dismiss',
          handler: () => {
            this.dismissRemoveItemPopup(store);
          }
        }, {
          text: cartConfirm,
          cssClass: 'btn-success',
          handler: () => {
            this.dismissRemoveItemPopup(store);
            this.removeCartItem(store, mode, event);
          }
        }
      ]
    });

    await alert.present();
  }

  async handleWidgetActionFindByAreaSuccess(data: any) {

    if (data.length) {

      const firstStore = data[0];
      if (this.getCurrentStore().id !== firstStore.id && !this.isEmptyCart()) {
        await this.loaderService.stopLoading();
        await this.presentAlert(firstStore);
        return;
      }

      this.setStoreAndRedirect(firstStore);
      return;
    }

    await this.loaderService.stopLoading();
    const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
    await this.alertService.presentToast(store_alert, 3000, 'top');

  }

  async handleWidgetActionFindByCityFailed(data: any) {

    this.loaderService.stopLoading();
    const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
    await this.alertService.presentToast(store_alert, 3000, 'top');
  }

  filterStores(data: Array<Store>) {

    const stores = [];

    if ( !data ) {
      return [];
    }
    Array.from(data).forEach(store => {
      if (store.deliveryModes.indexOf(this.getDeliveryMode()) > -1) {
        stores.push(store);
      }
    });

    return stores;
  }

  handleWidgetActionFindByCitySuccess(fetchedStores: any) {

    const data = this.filterStores(fetchedStores);
    if (data && data.length) {

      // check if store has available takeaway store
      this.clearStoreChangeRequest();

      if (this.isModal) {
        this.openStoreListModal();
      } else {

        this.capRouter.routeByUrl('/store-selection?cityId=' + this.getSelectedCity(this.getDeliveryMode()).code);
      }

      return;
    }

    this.handleWidgetActionFindByCityFailed(data);
  }

  async handleWidgetActionFindByLocationFailed(data: any) {
    this.loaderService.stopLoading();
    const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
    await this.alertService.presentToast(store_alert, 3000, 'top');
  }

  async handleWidgetActionFindByLocationSuccess(data: any) {

    const stores = this.filterStores(data);
    if (!stores || stores.length < 1) {
      await this.handleWidgetActionFindByLocationFailed(data);
      return;
    }

    const locationDetails = this.getSelectedLocation();
    if (this.getDeliveryMode() === DeliveryModes.PICKUP) {

      if (!this.isModal) {

        this.capRouter.routeByUrl('/storeselection?latitude=' + locationDetails.latitude +
          '&longitude=' + locationDetails.longitude);
        return;
      }

      await this.openStoreListModal(locationDetails);
      return;
    }

    const firstStore = stores[0];

    if (!this.isEmptyCart() && firstStore.id != this.getCurrentStore().id) {
      this.presentAlert(firstStore);
      return;
    }

    this.setStoreAndRedirect(firstStore);
  }

  async handleWidgetActionLocateMeFailed(data: any) {

    const msg = await this.translate.instant('home_page.allow_location_access');
    await this.loaderService.stopLoading();
    this.alertService.presentToast(msg, 1000, 'bottom');
  }

  async locateDevice() {
    await this.loaderService.startLoadingByMode('Fetching Stores', this.getDeliveryMode());
    this.locateMe();
  }

  async openStoreListModal(locationDetails = null) {

    let latitude = '';
    let longitude = '';
    if (locationDetails !== null) {
      latitude = locationDetails.latitude;
      longitude = locationDetails.longitude;
    }

    const modal = await this.modalController.create({
      component: StoreListComponent,
      componentProps: {
        cityId: this.getSelectedCity(),
        latitude: latitude,
        longitude: longitude,
        isModal: true
      }
    });

    await modal.present();
    this.loaderService.stopLoading();
    modal.onDidDismiss().then((storeSelected) => {
      if (storeSelected.data) {
        this.modalController.dismiss(true);
      }
    });
  }

  navigateToDeals() {

    if (this.isModal) {
      return this.modalController.dismiss(true);
    }
    this.clearStoreChangeRequest();
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
  }
}
