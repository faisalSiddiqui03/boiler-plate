import { Component, EventEmitter, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  WidgetNames,
  Action,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { ProductDetailsWidgetActions } from '@cap-widget/product-details';
import { Product, BundleItem } from '@cap-widget/product-modules';
import { TranslateService } from '@capillarytech/pwa-framework';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { AlertService, LoaderService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import { ModalController } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';

@Component({
  selector: 'app-trio-component',
  templateUrl: './trio.component.html',
  styleUrls: ['../product-details/product-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class TrioComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  @Input() productId: number;
  @Input() productFromDeal;

  loaded = false;
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  serverProduct;
  clientProduct: Product;
  categoryId: string;
  productName: string;
  showAddToCart: boolean;
  noOfGroups: number;
  noOfSelectedGroups: number;
  showVariants: boolean;
  addingToCart: boolean;

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private hardwareService: HardwareService,
    private loaderService: LoaderService,
    private modalController: ModalController
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  widgetLoadingStarted(name, data) {
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      this.loaded = true;
      this.serverProduct = data;
      this.clientProduct = this.serverProduct.client;
      this.setClient();
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('Widget loading failed' + name, data);
  }

  async widgetActionSuccess(name: string, data: any) {
    switch (name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        console.log('Item added to cart : ', data);
        const isMobile = await this.hardwareService.isMobileApp();
        this.loaderService.stopLoading();
        await this.alertService.presentToast(this.clientProduct.title + ' ' +
          this.translate.instant('product_details.added_to_cart'), 1000, 'top', 'top');
        this.goBack();
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    this.loaderService.stopLoading();
    console.log('Widget action failed' + name, data);
  }

  setClient() {
    this.noOfGroups = 0;
    this.noOfSelectedGroups = 0;
    this.serverProduct.bundleGroups.map((group) => {
      this.noOfGroups = this.noOfGroups + 1;
    })
    this.showAddToCart = !this.clientProduct.isParentProduct;
    this.serverProduct.bundleGroups.map((group) => {
      group.showProperty = true;
    });
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      item.remove();
    });
  }

  isBundleItemSelected(bundleItem, groupId) {
    let itemSelected = false;
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (bundleItem.id === item.id && groupId === item.groupId) itemSelected = item.isSelected;
    });
    return itemSelected;
  }

  addBundleItem(bundleItem, group) {
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if(group.groupId === item.groupId) item.remove();
    });
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (bundleItem.id === item.id) item.add();
    });
    let selectedItems = 0;
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.isSelected) selectedItems = selectedItems + 1;
    });
    this.showAddToCart = this.noOfGroups === selectedItems;
    group.showProperty = false;
  }

  getSelectedBundleIemName(group) {
    let selectedItem = '';
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (group.groupId === item.groupId && item.isSelected) selectedItem = item.title;
    });
    return selectedItem;
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

  isProeprtyAvailable(propertyValueId) {
    let isPropertyAvailable = false;
    let availablePropertyCount = 0;
    if (!this.productFromDeal) {
      this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
        if (key.indexOf(propertyValueId.toString())) {
          isPropertyAvailable = true;
          return;
        }
      });
    } else {
      this.productFromDeal.variantProducts.map((variantFromDeal) => {
        this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
          if (variant.id === variantFromDeal.id && key.indexOf(propertyValueId.toString()) > -1) {
            isPropertyAvailable = true;
            return;
          }
        });
      });
    }
    return isPropertyAvailable;
  }

  async openStoreSelection() {
    const modal = await this.modalController.create({
      component: StoreSelectionModalComponent
    });
    await modal.present();

    modal.onDidDismiss().then((storeSelected) => {
      if(storeSelected.data){
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
    await this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader': 'pickup-loader');
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct)
    );
  }

  goBack() {
    this.setClient();
    if (!this.productFromDeal) {
      this.goBack();
      return;
    }
    this.modalController.dismiss();
  }
}
