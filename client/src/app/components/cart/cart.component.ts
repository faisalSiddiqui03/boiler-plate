import { Location } from '@angular/common';
import { Component, EventEmitter, ViewEncapsulation, Output } from '@angular/core';
import { ViewCartComponent } from '@capillarytech/pwa-components';
import { ConfigService, CapRouterService, pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { Product, ProductType } from '@cap-widget/product-modules';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
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
export class CartComponent extends ViewCartComponent {

  isLoaded = false;
  // show message for incorrect voucher
  isWrongVoucher = false;
  // the alert pop up for remove item
  removeItemPopup = false;
  itemToRemove = null;

  couponCode;
  enableVoucherModal = false;
  dealCategoryId: string;
  slideOpts = {
    slidesPerView: 2,
    autoplay: false,
    spaceBetween: 10
  };

  ProductType = ProductType;
  @Output() switchCategory: EventEmitter<any> = new EventEmitter<any>();
  constructor(private translateService: TranslateService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    public config: ConfigService, public location: Location,
    private modalController: ModalController,
    private capRouter: CapRouterService,
  ) {
    super(config, location);
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];
  }

  handleCartWidgetLoadingSuccess() {
      this.isLoaded = true;
  }

  async applyCoupon(couponCode) {

    if (!couponCode) {
      return;
    }
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    super.applyCoupon(couponCode);
  }

  /**
   * @param data
   * @returns {Promise<void>}
   */
  async handleApplyCouponActionFailed(data) {
    this.loaderService.stopLoading();
    this.isWrongVoucher = true;
    const coupon_error = await this.translateService.instant('cart.unable_to_apply_coupon');
    await this.alertService.presentToast(coupon_error, 3000, 'bottom');
  }

  async handleApplyCouponActionSuccess(data) {
    if (data) {
      this.loaderService.stopLoading();
      const coupon_success = await this.translateService.instant('cart.coupon_applied_successfully');
      await this.alertService.presentToast(coupon_success, 3000, 'bottom');
      this.showVoucherModal();
      return;
    }

    this.handleApplyCouponActionFailed(data);
  }

  async removeCoupon(couponCode) {

    if (!couponCode) {
      return;
    }
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    super.removeCoupon(couponCode);
  }

  async handleRemoveCouponActionFailed(data) {
    this.loaderService.stopLoading();
    const coupon_remove_error = await this.translateService.instant('cart.unable_to_remove_coupon');
    await this.alertService.presentToast(coupon_remove_error, 3000, 'bottom');
  }

  async handleRemoveCouponActionSuccess(data) {

    if (data) {

      this.loaderService.stopLoading();
      const coupon_remove_success = await this.translateService.instant('cart.coupon_removed_successfully');
      await this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
      return;
    }

    await this.handleRemoveCouponActionFailed(data);
  }

  updateCartItem(event, item, isAddition) {

    this.updateCart({ clickNumber: event.clickNumber, isAddition: isAddition }, item);
  }

  confirmRemove(item) {
    this.removeItemPopup = true;
    this.itemToRemove = item;
  }

  closeRemoveItemPopUp() {
    this.removeItemPopup = false;
    this.itemToRemove = null;
  }

  async editCartItem(cartItem) {

    if (cartItem.getType() === ProductType.Product && !cartItem.variantProductId) {

      const itemNotEditable = await this.translateService.instant('cart.not_editable');
      await this.alertService.presentToast(itemNotEditable, 1000, 'top', 'top');
      return;
    }

    let component;
    switch (cartItem.getType()) {
      case ProductType.Product:
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
  }

  async clearCart() {
    const cartClear = await this.translateService.instant('cart.cart_clear');
    await this.loaderService.startLoadingByMode(cartClear, this.getDeliveryMode());
    super.clearCart();
  }

  async handleClearCartActionSuccess(data) {

    const cartClear = await this.translateService.instant('cart.cart_clear');
    await this.alertService.presentToast(cartClear, 3000, 'bottom');
    this.capRouter.routeByUrl('/home');
  }

  showVoucherModal() {
    this.enableVoucherModal = !this.enableVoucherModal;
  }

  goToDeals() {
    this.enableVoucherModal = false;
    this.switchCategory.emit({ category: 'deals', id: this.dealCategoryId });
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl('/' + pageName);
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
        this.refresh();
      }
    });
  }
}
