import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ConfigService,
  pwaLifeCycle,
  WidgetNames,
  Product,
  ProductDetailsWidgetActions,
  Action,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { Utils } from '../../../helpers/utils';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

@pwaLifeCycle()
export class ProductDetailsPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  currencyCode: string;
  categoryId: string;
  productName: string;
  productId: string;
  loaded = false;
  clientProduct: Product;
  variants = ['Can', "Bottle (2L)"];
  selectedVariant: number;
  variantContent: string = "";
  toggleSelectedBlock: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private config: ConfigService,
    private loadingService: LoaderService,
    private alertService: AlertService,
    private location: Location,
  ) {
    super();
    this.translateService.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params.categoryId;
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }

  selectVariant(variant, index) {
    this.selectedVariant = index;
    this.variantContent = variant;
    this.toggleSelectedVariant();
  }

  toggleSelectedVariant() {
    this.toggleSelectedBlock = this.variantContent ? !this.toggleSelectedBlock : false;
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      this.loaded = true;
      this.clientProduct = data.client;
    }
  }

  getProductImageUrl(product) {
    if (product && product.multipleImages && product.multipleImages.length) {
      return `http://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
    }
  }

  getData(data) {
    // console.log(data);
  }

  addToCart(product) {
    this.productWidgetAction.emit(new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, product));
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    // loading service and alert service
    switch (name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        this.loadingService.stopLoading();
        // let str = await this.translateService.instant('product.added_to_cart');
        this.alertService.presentToast('Added to Cart', 3000, 'top');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('name loading failed: ' + name + ' data: ' + data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('name loading success: ' + name + ' data: ' + data);
  }

  goBack() {
    this.location.back();
  }
}
