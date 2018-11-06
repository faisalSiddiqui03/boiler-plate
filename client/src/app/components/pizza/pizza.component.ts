import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {pwaLifeCycle} from '@capillarytech/pwa-framework';
import {IncrementValidator, DecrementValidator} from '../../helpers/validators/index';
import {AttributeName, AttributeValue} from '@capillarytech/pwa-components/pizza-builder/attribute-name-value';
import {AlertService, LoaderService, HardwareService} from '@capillarytech/pwa-ui-helpers';
import {TranslateService} from '@capillarytech/pwa-framework';
import {ModalController} from '@ionic/angular';
import {StoreSelectionModalComponent} from '../store-selection-modal/store-selection-modal.component';
import {PizzaBuilderComponent} from '@capillarytech/pwa-components/pizza-builder/pizza-builder.component';
import {Product} from '@cap-widget/product-modules';

@Component({
  selector: 'app-pizza-component',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class PizzaComponent extends PizzaBuilderComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    public translate: TranslateService,
    private loaderService: LoaderService,
    private modalController: ModalController,
    private hardwareService: HardwareService,
  ) {
    super(translate);
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {

  }

  async handleAddItemSuccess() {
    await this.alertService.presentToast(this.translate.instant('pizza.add_topping_success'), 1000, 'top');
  }

  async handleAddItemFailure() {
    await this.alertService.presentToast(this.translate.instant('pizza.add_topping_error'), 1000, 'top');
  }

  async handleRemoveItemSuccess() {
    await this.alertService.presentToast(this.translate.instant('pizza.remove_topping_success'), 1000, 'top', 'top');
  }

  async handleRemoveItemFailure() {
    await this.alertService.presentToast(this.translate.instant('pizza.remove_topping_error'), 1000, 'top', 'top');
  }

  async openStoreSelection() {
    const modal = await this.modalController.create({
      component: StoreSelectionModalComponent
    });
    await modal.present();

    modal.onDidDismiss().then((storeSelected) => {
      this.loaderService.stopLoading();
      if (storeSelected.data) {
        this.addToCart();
      }
    });
  }

  async addToCart() {
    if (this.getCurrentStore() && this.getCurrentStore().isDefaultLocation) {
      await this.openStoreSelection();
      return;
    }
    if (this.productFromDeal) {
      this.modalController.dismiss(this.clientProduct);
      return;
    }
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    super.addToCart();
  }

  setToppingCountValidators() {
    try {
      const maxToppingCount = Product.getAttributeValueByName(this.serverProduct, AttributeName.MAX_TOPPING_COUNT);
      if (parseInt(maxToppingCount)) this.maxToppingLimit = parseInt(maxToppingCount);
      this.toppings.map((item) => {
        this.clientProduct.bundleItems.forEach((clientItem, number) => {
          if (item.id === clientItem.id && this.getItemType(item) === AttributeValue.TOPPING) {
            const decremnetValidator = new DecrementValidator(this.minToppingLimit);
            const incrementValidator = new IncrementValidator(this.maxToppingLimit);
            clientItem.validators.push(decremnetValidator);
            clientItem.validators.push(incrementValidator);
          }
        });
      });
    } catch (err) {
      console.error('Error setting validators');
    }
  }

  async handleAddToCartActionSuccess(data) {
    this.loaderService.stopLoading();
    const isDesktop = await this.hardwareService.isDesktopSite();
    if (!isDesktop) {
      await this.alertService.presentToastWithShowCart(
        this.clientProduct.title + ' ' + this.translate.instant('pizza.added_to_cart'),
        3000, 'top', '/' + this.getCurrentLanguageCode() + '/cart', 'top');
    } else {
      await this.alertService.presentToast(
        this.clientProduct.title + ' ' + this.translate.instant('pizza.added_to_cart'),
        3000, 'top', 'top', false);
    }
    this.goBack();
  }

  async handleAddToCartActionFailure(data) {
    this.loaderService.stopLoading();
    const isDesktop = await this.hardwareService.isDesktopSite();
    this.alertService.presentToast(this.translate.instant('reset_password_page.error'), 3000, 'top',
        'top', !isDesktop, this.getCurrentLanguageCode());
  }

  handleEditCartActionSuccess(data) {
    this.loaderService.stopLoading();
    this.modalController.dismiss(true);
  }

  async handleEditCartActionFailure(data) {
    this.loaderService.stopLoading();
    this.modalController.dismiss(false);
    const isDesktop = await this.hardwareService.isDesktopSite();
    this.alertService.presentToast(this.translate.instant('reset_password_page.error'), 3000, 'top',
        'top', !isDesktop, this.getCurrentLanguageCode());
  }

  close() {
    if (this.productFromDeal || this.cartItem || this.fromFavorites) {
      this.modalController.dismiss();
      return;
    }
    this.goBack();
  }
}
