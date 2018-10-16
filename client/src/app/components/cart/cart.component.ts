import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, ViewEncapsulation, AfterViewInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Action,
  CartWidgetActions,
  ConfigService,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  CapRouterService,
  pwaLifeCycle,
  pageView,
  WidgetNames,
  Product,
  SuggestionsWidgetActions
} from '@capillarytech/pwa-framework';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../base/base-component';
import { UtilService } from '../../helpers/utils';
import { ProductType } from '@capillarytech/pwa-framework';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ModalController } from '@ionic/angular';
import { PizzaComponent } from '../pizza/pizza.component';
import { DealComponent } from '../deal/deal.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class CartComponent extends BaseComponent implements AfterViewInit, OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  cartWidgetAction = new EventEmitter();
  loaded = false;
  vouchersLoaded = false;
  enableVoucherModal = false;
  isWrongVoucher = false;
  currencyCode: string;
  couponCode: string;
  updatingPrice: boolean;
  bundle = ProductType.Bundle;
  product = ProductType.Product;
  deal = ProductType.Deal;
  suggestionsLoaded: boolean;
  removeItemPopup: boolean = false;
  itemToRemove;
  favoriteInProgress = new Map();
  suggestionWidgetAction = new EventEmitter();
  @Output() switchCategory: EventEmitter<any> = new EventEmitter<any>();
  dealCategoryId: string;

  slideOpts = {
    slidesPerView: 2,
    autoplay: false,
    spaceBetween: 10
  };

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private capRouter: CapRouterService,
    private actRoute: ActivatedRoute,
    private modalController: ModalController,
  ) {
    super();
    this.translateService.use(this.getCurrentLanguageCode());
    this.loaded = false;
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cartWidgetAction.emit(new Action(CartWidgetActions.REFRESH));
    this.translateService.use(this.getCurrentLanguageCode());
  }

  async applyCoupon() {
    if (this.couponCode) {
      await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
      const action = new Action(CartWidgetActions.ACTION_APPLY_COUPON, this.couponCode);
      this.cartWidgetAction.emit(action);
      this.couponCode = null;
    } else {
      this.isWrongVoucher = true;
    }
  }

  removeCoupon(couponCode) {
    if (couponCode) {
      const action = new Action(CartWidgetActions.ACTION_REMOVE_COUPON, couponCode);
      this.cartWidgetAction.emit(action);
    }
  }

  updateCart(event, item, isAddition) {
    let clicks = event.clickNumber;

    if (!isAddition)
      clicks = -clicks

    this.updateCartItemQuantity(item, clicks)
  }


  async updateCartItemQuantity(item, newQuantity) {

    item.quantity = item.quantity + newQuantity;
    if (item.quantity < 1) {
      this.confirmRemove(item);
      return;
    }

    const cartUpdate = await this.translateService.instant('cart.updating_quantity');
    this.updatingPrice = true;
    const action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  async updateCartItemQuantityNoDebounce(item, newQuantity) {

    item.quantity = item.quantity + newQuantity;
    if (item.quantity === 0) {
      this.confirmRemove(item);
      return;
    }

    const cartUpdate = await this.translateService.instant('cart.updating_quantity');
    await this.loaderService.startLoading(cartUpdate, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.updatingPrice = true;
    const action = new Action(CartWidgetActions.ACTION_UPDATE_CART, item);
    this.cartWidgetAction.emit(action);
  }

  confirmRemove(item){
    this.removeItemPopup = true;
    this.itemToRemove = item;
    return;
  }

  dismissRemoveItemPopup() {
    this.removeItemPopup = false;
  }

  async removeCartItem() {
    this.itemToRemove.quantity = 0;
    // const cartRemove = await this.translateService.instant('cart.remove_item');
    this.updatingPrice = true;
    const action = new Action(CartWidgetActions.ACTION_UPDATE_CART, this.itemToRemove);
    this.cartWidgetAction.emit(action);
  }

  async editCartItem(cartItem) {
    let component;
    switch (cartItem.getType()) {
      case ProductType.Product:
        if (!cartItem.variantProductId) {
          const itemNotEditable = await this.translateService.instant('cart.not_editable');
          await this.alertService.presentToast(itemNotEditable, 1000, 'top', 'top');
          return;
        }
        component = ProductDetailsComponent;
        break;
      case ProductType.Bundle:
        component = PizzaComponent;
        break;
      case ProductType.Deal:
        component = DealComponent;
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
    const cartClear = await this.translateService.instant('cart.cart_clear');
    await this.loaderService.startLoading(cartClear, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    const action = new Action(CartWidgetActions.ACTION_CLEAR_CART);
    this.cartWidgetAction.emit(action);
  }

  widgetActionFailed(name: string, data: any): any {
    this.loaderService.stopLoading();
    switch (name) {
      case SuggestionsWidgetActions.ACTION_MARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
      case SuggestionsWidgetActions.ACTION_UNMARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
      case CartWidgetActions.ACTION_APPLY_COUPON:
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
          await this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        } else {
          const coupon_remove_error = await this.translateService.instant('cart.unable_to_remove_coupon');
          await this.alertService.presentToast(coupon_remove_error, 3000, 'bottom');
        }
        break;
      case CartWidgetActions.ACTION_APPLY_COUPON:
        if (data) {
          const coupon_success = await this.translateService.instant('cart.coupon_applied_successfully');
          await this.alertService.presentToast(coupon_success, 3000, 'bottom');
          this.showVoucherModal();
        } else {
          const coupon_error = await this.translateService.instant('cart.unable_to_apply_coupon');
          await this.alertService.presentToast(coupon_error, 3000, 'bottom');
          this.isWrongVoucher = true;
        }
        break;
      case CartWidgetActions.ACTION_UPDATE_CART:
        console.log('Item updated successfully');
        break;
      case CartWidgetActions.ACTION_CLEAR_CART:
        const cartClear = await
          this.translateService.instant('cart.cart_clear');
          await this.alertService.presentToast(cartClear, 3000, 'bottom');
        this.capRouter.routeByUrlWithLanguage('/home');
        // this.router.navigate(['/home']);
        break;
      case SuggestionsWidgetActions.ACTION_MARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
      case SuggestionsWidgetActions.ACTION_UNMARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
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
        this.suggestionsLoaded = true;
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
    this.enableVoucherModal = false;
    this.switchCategory.emit({ category: 'deals', id: this.dealCategoryId });
    // this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage('/' + pageName);
  }

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
  }

  updateFavorites(isFavorite, product) {
    this.favoriteInProgress.set(product.id, true);
    if (!isFavorite) {
      this.suggestionWidgetAction.emit(new Action(SuggestionsWidgetActions.ACTION_MARK_AS_FAVORITE, product));
      return;
    }
    this.suggestionWidgetAction.emit(new Action(SuggestionsWidgetActions.ACTION_UNMARK_AS_FAVORITE, product));
  }

  async openProductDetails(product: Product) {
    const modal = await this.modalController.create({
      component: ProductDetailsComponent,
      componentProps: {
        productId: product.id,
        fromSuggestion: true
      }
    });

    await modal.present();

    modal.onDidDismiss().then((itemAdded) => {
      if (itemAdded) {
        this.cartWidgetAction.emit(new Action(CartWidgetActions.REFRESH));
        this.suggestionWidgetAction.emit(new Action(SuggestionsWidgetActions.REFRESH));
      }
    });
  }

  getProductImageUrl(product) {
    if (!product.multipleImages || !(product.multipleImages.length > 0)) {
      return this.getUrl(product.image);
    } else {
      let lastItem = product.multipleImages.slice().pop();
      if (!lastItem.image) {
        return this.getUrl(product.image);
      }
      return this.getUrl(lastItem.image);
    }
  }

  getUrl(url: string) {
    return `https://${url}`;
  }
}
