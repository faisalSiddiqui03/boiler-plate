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
  bannerRefCode: string;
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
    private capRouter: CapRouterService
  ) {
    super();
    this.bannerRefCode = this.config.getConfig()['footerBannerRefCode'];
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
    this.globalSharedService.setPageTitle('Pizza Hut Kuwait | Pizza Delivery Near You | Order Online');
    this.globalSharedService.setSEOPageTags([
      {name: 'title', content: 'Pizza Hut Kuwait | Pizza Delivery Near You | Order Online'},
      {name: 'og:title', content: 'Pizza Hut Kuwait | Pizza Delivery Near You | Order Online'},
      {name: 'description', content: 'Pizza Hut, one of the most popular Pizza destinations in India is now online. Order Pizza online that is both delicious and value for money.'},
      {name: 'og:description', content: 'Pizza Hut, one of the most popular Pizza destinations in India is now online. Order Pizza online that is both delicious and value for money.'},
      {name: 'url', content: 'https://m.kuwait.pizzahut.me/home'},
      {name: 'og:url', content: 'https://m.kuwait.pizzahut.me/home'},
      {name: 'type', content: 'e-commerce'},
      {name: 'og:type', content: 'e-commerce'},
      {name: 'image', content: 'https://phindia-resources.cdn.martjack.io/azure/inc-yum-resources/98d18d82-ba59-4957-9c92-3f89207a34f6/Images/ProductImages/Source/Exotica.jpg?height=1200&width=1200&builder=freeimage'},
      {name: 'og:image', content: 'https://phindia-resources.cdn.martjack.io/azure/inc-yum-resources/98d18d82-ba59-4957-9c92-3f89207a34f6/Images/ProductImages/Source/Exotica.jpg?height=1200&width=1200&builder=freeimage'},
      {name: 'keywords', content: 'Pizza Hut Kuwait | Pizza Delivery Near You | Order Online'}
    ]);
  }

  ionViewWillLeave() {
    // this.fetchDeliverySlots = false;
    // this.isNavigationClicked = false;
  }

  widgetLoadingSuccess(name, data) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetActionFailed(name: string, data: any) {
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetLoadingFailed(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
  }

  widgetLoadingStarted(name: string, data: any) {
    console.log('name = ', name, ' data = ', data);
  }

  navigateToDeals() {
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=deals&id=CU00215646'));
    this.isNavigationClicked = true;
    this.loaderService.stopLoading();
    this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=deals&id=CU00215646'));

  }

  getBannerRefCodeWithLangCode(refCode: string) {
    return refCode + this.getCurrentLanguageCode();
  }

  preventPropogation(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}
