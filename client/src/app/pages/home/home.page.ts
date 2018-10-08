import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  ConfigService,
  LanguageService
} from '@capillarytech/pwa-framework';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '../../base/base-component';
import { Router, ActivatedRoute } from '@angular/router';
import {
  DeliveryModes,
  DeliverySlot
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';

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
  bannerUrl: string;
  deliveryModes = DeliveryModes;
  asSoonPossible = false;
  fetchDeliverySlots = false;
  asapDeliverySlot = DeliverySlot.getAsap();

  constructor(
    private config: ConfigService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    public modalController: ModalController,
  ) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ionViewWillLeave() {
    this.fetchDeliverySlots = false;
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


  // We should get display name from api

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }

  navigateToDeals() {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=deals&id=CU00215646'));
  }

  preventPropogation(e) {
    e.preventDefault();
    e.stopPropagation();
  }

}
