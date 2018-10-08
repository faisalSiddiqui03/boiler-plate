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
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';
import { TranslateService } from "@ngx-translate/core";
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../helpers/utils';
import { Location } from '@angular/common';
import { ProductType } from '@capillarytech/pwa-framework';
import { ProductDetailsComponent } from '../../../components/product-details/product-details.component';
import { ModalController } from '@ionic/angular';
import { PizzaComponent } from '../../../components/pizza/pizza.component';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class CartPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  cartWidgetAction = new EventEmitter();
  loaded = false;
  vouchersLoaded = false;
  enableVoucherModal: boolean = false;
  isWrongVoucher = false;
  currencyCode: string;
  couponCode: string;
  updatingPrice: boolean;
  bundle = ProductType.Bundle;
  product = ProductType.Product;
  deal = ProductType.Deal;


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
    this.loaded = false;
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.cartWidgetAction.emit(new Action(CartWidgetActions.REFRESH));
    this.translateService.use(this.getCurrentLanguageCode());
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

  updateCart(event, item, isAddition) {
    let clicks = event.clickNumber

    if (!isAddition)
      clicks = -clicks

    this.updateCartItemQuantity(item, clicks)
  }


  async updateCartItemQuantity(item, newQuantity) {

    item.quantity = item.quantity + newQuantity;
    if (item.quantity < 1) {
      this.removeCartItem(item);
      return;
    }

    let cartUpdate = await this.translateService.instant('cart.updating_quantity');
    this.updatingPrice = true;
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async updateCartItemQuantityNoDebounce(item, newQuantity) {

    item.quantity = item.quantity + newQuantity;
    if (item.quantity === 0) {
      this.removeCartItem(item);
      return;
    }

    let cartUpdate = await this.translateService.instant('cart.updating_quantity');
    this.loaderService.startLoading(cartUpdate, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.updatingPrice = true;
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async removeCartItem(item) {
    item.quantity = 0;
    let cartRemove = await this.translateService.instant('cart.remove_item');
    this.loaderService.startLoading(cartRemove, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.updatingPrice = true;
    let action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async editCartItem(cartItem) {
    let component;
    switch (cartItem.getType()) {
      case ProductType.Product:
        if (!cartItem.variantProductId) {
          const itemNotEditable = await this.translateService.instant('cart.not_editable');
          this.alertService.presentToast(itemNotEditable, 1000, 'top');
          return;
        }
        component = ProductDetailsComponent;
        break;
      case ProductType.Bundle:
        component = PizzaComponent;
        break;
      case ProductType.Deal:
        break;
    }

    const modal = await this.modalController.create({
      component: component,
      componentProps: {
        productId: cartItem.productId,
        cartItem: cartItem,
      }
    });

    await modal.present();

    modal.onDidDismiss().then((itemEdited) => {
      if (itemEdited) this.cartWidgetAction.emit(new Action(CartWidgetActions.REFRESH));
    });
  }

  async clearCart() {
    let cartClear = await this.translateService.instant('cart.cart_clear');
    this.loaderService.startLoading(cartClear, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader' : 'pickup-loader');
    let action = new Action(CartWidgetActions.ACTION_CLEAR_CART);
    this.cartWidgetAction.emit(action);
  }

  openProduct(product) {
    let navigationUrl = this.getNavigationUrlWithLangSupport('product/' + encodeURI(product.description.toLowerCase().replace('/', '-')) + '/' + product.productId);
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
    this.updatingPrice = false;
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
        // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
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
    console.log('name loading success: ' + name + ' data: ', data);
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
    this.capRouter.routeByUrlWithLanguage('/products/listing/(0:0)?category=deals&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products/listing/(0:0)?category=deals&id=CU00215646'));
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }
}
