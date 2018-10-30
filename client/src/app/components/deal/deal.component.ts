import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pwaLifeCycle,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { BundleItem, Product } from '@cap-widget/product-modules';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { DealShowcaseComponent } from '../deal-showcase/deal-showcase.component'
import { LoaderService, AlertService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AttributeName, AttributeValue } from '@capillarytech/pwa-components/pizza-builder/attribute-name-value';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { TrioComponent } from '../trio/trio.component';
import { DealBuilderComponent } from '@capillarytech/pwa-components/deal-builder/deal-builder.component';
import { PizzaComponent } from '../pizza/pizza.component';

@Component({
  selector: 'app-deal-component',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class DealComponent extends DealBuilderComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  serverProduct;
  bundleGroup: any;
  clientProduct: Product;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private hardwareService: HardwareService,
    private capRouter: CapRouterService,
  ) {
    super({
      openProdDetailsIfOneProdInGroup: true,
      preselectGroups: false,
      showAddToCartOnlyAfterSelection: true
    });
  }

  ngOnInit() {}

  async handleAddToCartActionSuccess(data) {
    this.loaderService.stopLoading();
    const isDesktop = await this.hardwareService.isDesktopSite();
    await this.alertService.presentToast(this.clientProduct.title + ' ' + this.translate.instant('deal.added_to_cart'), 3000, 'top', 'top', !isDesktop, this.getCurrentLanguageCode());
    if (!isDesktop) this.capRouter.routeByUrl('/cart');
    if (isDesktop) this.goBack();
  }

  handleEditCartActionSuccess(data) {
    this.loaderService.stopLoading();
    this.modalController.dismiss(true);
  }

  handleAddToCartActionFailure(data) {
    this.loaderService.stopLoading();
  }

  handleEditCartActionFailure(data) {
    this.loaderService.stopLoading();
    this.modalController.dismiss(false);
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
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());
    super.addToCart();
  }

  async openProductDetails(bundleItem) {
    let component;
    let isTrio = false;
    let isPizza = false;
    if (BundleItem.getAttributeValueByName(bundleItem, AttributeName.TYPE) === AttributeValue.TRIO) {
      component = TrioComponent;
      isTrio = true;
    }
    else if (BundleItem.getAttributeValueByName(bundleItem, AttributeName.CUSTOMIZABLE) === AttributeValue.CUSTOMIZABLE) {
      isPizza = true;
      component = PizzaComponent;
    } else {
      component = ProductDetailsComponent;
    }

    const modal = await this.modalController.create({
      component: component,
      componentProps: {
        productId: bundleItem.productId,
        productFromDeal: bundleItem,
      }
    });

    modal.onDidDismiss().then((addedItem) => {
      this.updateItemSelectionFromSingleItem(bundleItem, addedItem, isTrio, isPizza);
    });

    return await modal.present();
  }

  async alertDealPriceDiff() {
    const added = this.translate.instant('deal.added');
    const extra = this.translate.instant('deal.extra');
    if (this.priceDiff && this.toppingsEnabled) {
      await this.alertService.presentToast(added + ' ' + this.currencyCode + ' ' + this.priceDiff.toFixed(3) + ' ' + extra + '!', 2000, 'top', 'top');
    }
  }

  async openDealShowcase() {
    this.toppingsEnabled = true;
    if (Product.getAttributeValueByName(this.serverProduct, AttributeName.IS_TOPPINGS_ENABLED)
      === AttributeValue.TOPPING_NOT_ENABLED) {
      this.toppingsEnabled = false;
    }
    const modal = await this.modalController.create({
      component: DealShowcaseComponent,
      componentProps: {
        bundleGroup: this.bundleGroup,
        bundleGroupImage: this.bundleGroupImage,
        clientProduct: this.clientProduct,
        toppingsEnabled: this.toppingsEnabled,
      }
    });

    modal.onDidDismiss().then((itemAdded) => {
      this.updateItemSelectionFromMultipleItems(itemAdded);
    });

    return await modal.present();
  }

  goBack() {
    if (this.cartItem) {
      this.modalController.dismiss();
      return;
    }
    super.goBack();
  }

}
