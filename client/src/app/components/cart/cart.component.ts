import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {
  Action,
  CartWidgetActions,
  ConfigService,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pwaLifeCycle, WidgetNames,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../base/base-component';
import { UtilService } from '../../helpers/utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class CartComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  cartWidgetAction = new EventEmitter();
  loaded = false;
  vouchersLoaded = false;
  enableVoucherModal: boolean = false;
  isWrongVoucher = false;
  currencyCode: string;
  couponCode: string;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translateService.use(this.getCurrentLanguageCode());
    this.loaded = false;
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
  }

  applyCoupon() {
    if (this.couponCode) {
      this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
      let action = new Action(CartWidgetActions.ACTION_APPLY_COUPON, this.couponCode);
      this.cartWidgetAction.emit(action);
    } else {
      this.isWrongVoucher = true;
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
    this.loaderService.startLoading(cartUpdate, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async removeCartItem(item) {
    item.quantity = 0;
    let cartRemove = await this.translateService.instant('cart.remove_item');
    this.loaderService.startLoading(cartRemove, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async clearCart() {
    let cartClear = await this.translateService.instant('cart.cart_clear');
    this.loaderService.startLoading(cartClear, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    let action = new Action(CartWidgetActions.ACTION_CLEAR_CART);
    this.cartWidgetAction.emit(action);
  }

  openProduct(product) {
    let navigationUrl = this.getNavigationUrlWithLangSupport('/product/' + encodeURI(product.description.toLowerCase().replace('/', '-')) + '/' + product.productId);
    console.log('Nav URL', navigationUrl);
    this.capRouter.routeByUrlWithLanguage(navigationUrl);
    // this.router.navigateByUrl(navigationUrl);
  }

  widgetActionFailed(name: string, data: any): any {
    this.loaderService.stopLoading();
    if (name === CartWidgetActions.ACTION_APPLY_COUPON) {
      this.isWrongVoucher = true;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    this.loaderService.stopLoading();
    switch (name) {
      case CartWidgetActions.ACTION_REMOVE_COUPON:
        if (data) {
          const coupon_remove_success = await this.translateService.instant('cart.coupon_removed_successfully');
          this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        } else {
          const coupon_remove_error = await this.translateService.instant('cart.unable_to_remove_coupon');
          this.alertService.presentToast(coupon_remove_error, 3000, 'bottom');
        }
        break;
      case CartWidgetActions.ACTION_APPLY_COUPON:
        if (data) {
          const coupon_success = await this.translateService.instant('cart.coupon_applied_successfully');
          this.alertService.presentToast(coupon_success, 3000, 'bottom');
          this.showVoucherModal();
        } else {
          const coupon_error = await this.translateService.instant('cart.unable_to_apply_coupon');
          this.alertService.presentToast(coupon_error, 3000, 'bottom');
          this.isWrongVoucher = true;
        }
        break;
      case CartWidgetActions.ACTION_UPDATE_CART:
        console.log('Item updated successfully');
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        const cartClear = await
          this.translateService.instant('cart.cart_clear');
        this.alertService.presentToast(cartClear, 3000, 'bottom');
        this.capRouter.routeByUrlWithLanguage('/home');
        // this.router.navigate(['/home']);
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
    this.capRouter.routeByUrlWithLanguage('/product/deals/CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/product/deals/CU00215646'));
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage('/' + pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/' + pageName));
  }

}
