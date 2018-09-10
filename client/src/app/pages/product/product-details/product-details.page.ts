import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { BasePage } from '../../../base/base-page';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

@pwaLifeCycle()
export class ProductDetailsPage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
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
    private translate: TranslateService,
    private config: ConfigService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
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
      const imageUrl = `http://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
      // console.log(imageUrl);
      return imageUrl;
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

  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('name loading failed: ' + name + ' data: ' + data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('name loading success: ' + name + ' data: ' + data);
  }
}
