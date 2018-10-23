import { OnDestroy } from '@angular/core';
import { GlobalSharedService } from '@cap-core/service/global-shared.service';
import { appInjector } from '@cap-core/app.injector';
import { DeliverySlot, DeliveryModes, SeoInfo } from '@capillarytech/pwa-framework';
import { Subscription } from 'rxjs/internal/Subscription';

export class BaseComponent implements OnDestroy {

  isModalOpen: boolean;
  private componentID;
  protected globalSharedService: GlobalSharedService;
  protected subscriptions: Array<Subscription> = [];

  constructor() {
    this.componentID = Math.random().toString(36).substr(2, 9);
    this.globalSharedService = appInjector.get(GlobalSharedService);
    this.isModalOpen = false;
  }

  addPageTagsViaSeoInfo(seoInfo: SeoInfo) {
    this.globalSharedService.setSEOPageTagsviaSeoInfo(seoInfo);
  }

  getUserModel() {
    return this.globalSharedService.getUserModel();
  }

  async getUserPromise() {
    return await this.globalSharedService.getUserModelPromise();
  }

  getCurrentLanguage() {
    return this.globalSharedService.getCurrentLanguage();
  }

  getCurrentLanguageCode() {
    return this.globalSharedService.getCurrentLanguage().code;
  }

  setCurrentLanguage(language) {
    return this.globalSharedService.updateLanguage(language);
  }

  setCurrentStore(store) {
    if(!store) return;
    return this.globalSharedService.saveSelectedStore(store);
  }

  getCart() {
    return this.globalSharedService.getCart();
  }

  async getCartAsync() {
    return await this.globalSharedService.getCartPromise();
  }

  getCurrentStore() {
    return this.globalSharedService.getCurrentStore();
  }

  getSelectedCityId() {
    return this.getCurrentStore() ? this.getCurrentStore().selectedCityId ? this.getCurrentStore().selectedCityId.toString() : '' : '';
  }

  async getCurrentStoreAsync() {
    return await this.globalSharedService.getCurrentStorePromise();
  }

  getDeliverySlot() {
    return this.globalSharedService.getDeliverySlot();
  }

  async getDeliverySlotPromise(): Promise<DeliverySlot> {
    return await this.globalSharedService.getDeliverySlotPromise();
  }

  setDeliverySlot(slot) {
    return this.globalSharedService.selectDeliverySlot(slot);
  }

  getComponentId() {
    return this.componentID;
  }

  getDeliveryMode() {
    return (this.globalSharedService.getFulfilmentMode() && this.globalSharedService.getFulfilmentMode().mode) ? this.globalSharedService.getFulfilmentMode().mode : DeliveryModes.HOME_DELIVERY;
  }

  async getDeliveryModeAsync() {
    const mode = await this.globalSharedService.getFulfilmentModePromise();
    return mode.mode;
  }

  getNavigationUrlWithLangSupport(url: string): string {
    let navUrl = '';
    if (url.startsWith('/')) {
      navUrl = this.getCurrentLanguageCode() + url;
    } else {
      navUrl = this.getCurrentLanguageCode() + '/' + url;
    }

    return navUrl;
  }

  ngOnDestroy() {

    this.subscriptions.forEach((subscription) => {

      if (subscription) {
        try {

          subscription.unsubscribe();
        } catch (e) {
          console.error('unsubscribe error');
        }
      }
    });
  }
}
