import { GlobalSharedService } from '@cap-core/service/global-shared.service';
import { appInjector } from '@cap-core/app.injector';
import { DeliverySlot } from '@capillarytech/pwa-framework';

export class BaseComponent {

  isModalOpen: boolean;
  private componentID;
  protected globalSharedService: GlobalSharedService;

  constructor() {
    this.componentID = Math.random().toString(36).substr(2, 9);
    this.globalSharedService = appInjector.get(GlobalSharedService);
    this.isModalOpen = false;
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
    return this.globalSharedService.saveSelectedStore(store);
  }

  getFulfilmentMode() {
    return this.globalSharedService.getFulfilmentMode();
  }

  getCart() {
    return this.globalSharedService.getCart();
  }

  getCurrentStore() {
    return this.globalSharedService.getCurrentStore();
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
    return this.globalSharedService.getFulfilmentMode() ? this.globalSharedService.getFulfilmentMode().mode : null;
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
}
