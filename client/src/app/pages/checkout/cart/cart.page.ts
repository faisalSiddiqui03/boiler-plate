import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import {
  OnWidgetActionsLifecyle,
  pwaLifeCycle,
  pageView,
  OnWidgetLifecyle,
  WidgetNames,
  Action,
  CartWidgetActions,
  ConfigService,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../helpers/utils';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CartPage extends BaseComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private actRoute: ActivatedRoute,
    private modalController: ModalController,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translateService.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.closeCartToast();
  }

  async closeCartToast() {
    await this.alertService.closeToast();;
  }

  goToDeals() {
    this.capRouter.routeByUrl('/products/listing/(0:0)?category=deals&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products/listing/(0:0)?category=deals&id=CU00215646'));
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }
}
