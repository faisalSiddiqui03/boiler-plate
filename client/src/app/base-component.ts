import { OnDestroy, OnInit } from '@angular/core';
import { GlobalSharedService } from '@cap-core/service/global-shared.service';
import { appInjector } from '@cap-core/app.injector';
import { DeliveryModes, SeoInfo, UserProfile, Language, ConfigService } from '@capillarytech/pwa-framework';
import { Subscription } from 'rxjs/internal/Subscription';
import { Location } from '@angular/common';

export class BaseComponent implements OnDestroy, OnInit {

  isModalOpen: boolean;
  private componentID;
  protected globalSharedService: GlobalSharedService;
  protected subscriptions: Array<Subscription> = [];
  // protected capRouter: CapRouterService;
  protected location: Location;
  protected configService: ConfigService;
  public currencyCode: string

  constructor() {
    this.componentID = Math.random().toString(36).substr(2, 9);
    this.globalSharedService = appInjector.get(GlobalSharedService);
    // this.capRouter = appInjector.get(CapRouterService);
    this.location = appInjector.get(Location);
    this.configService = appInjector.get(ConfigService);
    this.isModalOpen = false;
    this.currencyCode = this.configService.getConfig()['currencyCode'];
  }

  addPageTagsViaSeoInfo(seoInfo: SeoInfo) {
    this.globalSharedService.setSEOPageTagsviaSeoInfo(seoInfo);
  }

  getUserModel(): UserProfile {
    return this.globalSharedService.getUserModel();
  }

  async getUserPromise() {
    return await this.globalSharedService.getUserModelPromise();
  }

  getCurrentLanguage(): Language {
    return this.globalSharedService.getCurrentLanguage();
  }

  getCurrentLanguageCode() {
    return this.globalSharedService.getCurrentLanguage().code;
  }

  setLanguageByCode(code: string) {

    this.globalSharedService.updateLanguageByCode(code);
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
    return this.getCurrentStore() ? this.getCurrentStore().selectedCity ? this.getCurrentStore().selectedCity.code.toString() : '' : '';
  }

  async getCurrentStoreAsync() {
    return await this.globalSharedService.getCurrentStorePromise();
  }

  getDeliverySlot() {
    return this.globalSharedService.getDeliverySlot();
  }

  async getDeliverySlotPromise() {
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

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
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

  // route(url) {
  //   this.capRouter.route(url);
  // }

  // routeByUrl(url) {
  //   this.capRouter.routeByUrl(url);
  // }

  goBack() {
    // this.capRouter.goBack();
    this.location.back();
  }

  goForward() {
    // this.capRouter.goForward();
    this.location.forward();
  }

  // TODO: PLEASE NEVER EVER REMOVE IT. PWA FRAMEWORK'S MOST IMPORTANT FUNCTION.
  ngOnInit() {}
}
