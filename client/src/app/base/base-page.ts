import { GlobalSharedService } from '@cap-core/service/global-shared.service';
import { appInjector } from '@cap-core/app.injector';

export class BasePage {
  isModalOpen: boolean;
  protected globalSharedService: GlobalSharedService;

  constructor() {
    this.globalSharedService = appInjector.get(GlobalSharedService);
    this.isModalOpen = false;
  }

  getUserModel() {
    return this.globalSharedService.getUserModel();
  }

  getCurrentLanguage() {
    return this.globalSharedService.getCurrentLanguage();
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

}
