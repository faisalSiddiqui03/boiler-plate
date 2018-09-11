import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  OnWidgetActionsLifecyle,
  pwaLifeCycle,
  pageView,
  OnWidgetLifecyle,
  WidgetNames,
  Action,
  CartWidgetActions,
  ConfigService
} from '@capillarytech/pwa-framework';
import { BasePage } from '../../../base/base-page';
import { TranslateService } from "@ngx-translate/core";
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router } from '@angular/router';
import { Utils } from '../../../helpers/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class CartPage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  cartWidgetAction = new EventEmitter();
  loaded = false;
  vouchersLoaded = false;
  enableVoucherModal:boolean = false;
  currencyCode: string;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private config: ConfigService,
    private location: Location
  ) {
    super();
    this.translateService.use(Utils.getLanguageCode());
    // this.loaderService.startLoading();
    this.loaded = false;
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
  }

  applyCoupon(couponCode) {
    if (couponCode) {
      let action = new Action(CartWidgetActions.ACTION_APPLY_COUPON, couponCode);
      this.cartWidgetAction.emit(action);
    }
  }

  removeCoupon(couponCode) {
    if (couponCode) {
      let action = new Action(CartWidgetActions.ACTION_REMOVE_COUPON, couponCode);
      this.cartWidgetAction.emit(action);
    }
  }

  async updateCartItemQuantity(item, newQuantity) {

    item.quantity = item.quantity + newQuantity;
    if (item.quantity < 1) {
      this.removeCartItem(item);
      return;
    }

    let cartUpdate = await this.translateService.instant('cart.updating_quantity');
    this.loaderService.startLoading(cartUpdate);
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async removeCartItem(item) {
    item.quantity = 0;
    let cartRemove = await this.translateService.instant('cart.remove_item');
    this.loaderService.startLoading(cartRemove);
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async clearCart() {
    let cartClear = await this.translateService.instant('cart.cart_clear');
    this.loaderService.startLoading(cartClear);
    let action = new Action(CartWidgetActions.ACTION_CLEAR_CART);
    this.cartWidgetAction.emit(action);
  }

  openProduct(product) {
    let navigationUrl = 'product/' + encodeURI(product.description.toLowerCase().replace('/', '-')) + '/' + product.productId;
    console.log('Nav URL', navigationUrl);
    this.router.navigateByUrl(navigationUrl);
  }

  widgetActionFailed(name: string, data: any): any {
    this.loaderService.stopLoading();
    console.log('name action failed: ' + name + ' data: ' + data);
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    this.loaderService.stopLoading();
    switch (name) {
      case CartWidgetActions.ACTION_REMOVE_COUPON:
        if (data)
          alert('Coupon removed successfully');
        else
          alert('Coupon could not be removed');
        break;
      case CartWidgetActions.ACTION_APPLY_COUPON:
        if (data)
          alert('Coupon applied successfully');
        else
          alert('Unable to apply coupon');
        break;
      case CartWidgetActions.ACTION_UPDATE_CART:
        console.log('Item updated successfully');
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        let cartClear = await
        this.translateService.instant('cart.cart_clear');
        this.alertService.presentToast(cartClear, 3000, 'bottom');
        this.router.navigate(['/home']);
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
    // this.loaderService.stopLoading();
    console.log('name loading failed: ' + name + ' data: ' + data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('name loading started: ' + name + ' data: ' + data);
  }

  widgetLoadingSuccess(name, data) {
    console.log('name loading success: ' + name + ' data: ' + data);
    // this.loaderService.stopLoading();
    switch (name) {
      case WidgetNames.CART:
        this.loaded = true;
        break;
      case WidgetNames.SUGGESTIONS:
        // this.suggestionsLoaded = true;
        break;
      case WidgetNames.COUPONS:
        this.vouchersLoaded = true;
        break;
    }
  }

  showVoucherModal() {
    this.enableVoucherModal = !this.enableVoucherModal;
  }

  /** Function to go to previous page */
  goBack() {
    this.location.back();
  }

  goToDeals() {
    this.router.navigateByUrl('/product/deals/CU00215646');
  }

}
