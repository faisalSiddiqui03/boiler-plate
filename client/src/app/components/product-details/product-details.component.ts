import {Component, OnInit, ViewEncapsulation, EventEmitter} from '@angular/core';
import {pwaLifeCycle} from '@capillarytech/pwa-framework';
import {TranslateService} from '@capillarytech/pwa-framework';
import {AlertService, LoaderService, HardwareService} from '@capillarytech/pwa-ui-helpers';
import {ModalController} from '@ionic/angular';
import {StoreSelectionModalComponent} from '../store-selection-modal/store-selection-modal.component';
import {SimpleProductComponent} from '@capillarytech/pwa-components/simple-product/simple-product-component';

@Component({
  selector: 'app-product-details-component',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class ProductDetailsComponent extends SimpleProductComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    public translate: TranslateService,
    private hardwareService: HardwareService,
    private loaderService: LoaderService,
    private modalController: ModalController
  ) {
    super({
      preSelectvariants: false
    }, translate);
  }

  ngOnInit() {
  }

  widgetLoadingStarted(name, data) {
    console.log('Widget loading started' + name, data);
  }

  async handleAddToCartActionSuccess(data) {
    this.loaderService.stopLoading();

    let isDesktop = await this.hardwareService.isDesktopSite();
    if (this.fromSuggestion) {
      isDesktop = true;
    }

    if (!isDesktop) {
      await this.alertService.presentToastWithShowCart(
        this.clientProduct.title + ' ' + this.translate.instant('product_details.added_to_cart'),
        3000, 'top', '/' + this.getCurrentLanguageCode() + '/cart', 'top');
    } else {
      await this.alertService.presentToast(
        this.clientProduct.title + ' ' + this.translate.instant('product_details.added_to_cart'),
        3000, 'top', 'top', false);
    }

    if (this.fromSuggestion) {
      this.modalController.dismiss(true);
      return;
    }
    this.goBack();
  }

  handleEditCartActionSuccess(data) {
    this.loaderService.stopLoading();
    this.modalController.dismiss(true);
  }

  async handleAddToCartActionFailure() {
    this.loaderService.stopLoading();
    const isDesktop = await this.hardwareService.isDesktopSite();
    this.alertService.presentToast(this.translate.instant('reset_password_page.error'), 3000, 'top',
        'top', !isDesktop, this.getCurrentLanguageCode());
  }

  async handleEditCartActionFailure() {
    this.loaderService.stopLoading();
    const isDesktop = await this.hardwareService.isDesktopSite();
    this.alertService.presentToast(this.translate.instant('reset_password_page.error'), 3000, 'top',
        'top', !isDesktop, this.getCurrentLanguageCode());
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
      this.openStoreSelection();
      return;
    }
    if (this.productFromDeal) {
      this.modalController.dismiss(this.clientProduct);
      return;
    }
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    super.addToCart();
  }

  close() {
    this.setClient();
    if (this.productFromDeal || this.cartItem || this.fromSuggestion || this.fromFavorites) {
      this.modalController.dismiss();
      return;
    }
    this.goBack();
  }
}
