import { Component, OnInit, EventEmitter, ViewEncapsulation, ComponentRef, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
import { Location } from '@angular/common';
import {
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pwaLifeCycle,
  ProductDetailsWidgetActions,
  WidgetNames,
  ConfigService,
  BundleItem,
  Product,
  Action,
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';
import { ModalController } from '@ionic/angular';
import { DealShowcaseComponent } from '../deal-showcase/deal-showcase.component'
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AttributeName, AttributeValue } from '../../helpers/validators';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';
import { TrioComponent } from '../trio/trio.component';

@Component({
  selector: 'app-deal-component',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class DealComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  @Input() productId: number;
  @Input() cartItem;

  serverProduct;
  productName: string;
  loaded = false;
  productWidgetAction = new EventEmitter();
  currencyCode: string;
  bundleGroup: any;
  clientProduct: Product;
  isShowBundleGroupItems: boolean;
  bundleGroupImage: string;
  noOfRequiredGroups: number;
  noOfSelectedGroups: number;
  showAddToCart: boolean;
  titleValue: string = '';
  dealCategoryId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private config: ConfigService,
    private modalController: ModalController,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private utilService: UtilService
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];

    this.translate.get('deal.your_deal_details').subscribe(value => {
      this.titleValue = value;
    });
  }

  widgetLoadingStarted(name, data) {
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      try {
        this.serverProduct = data;
        this.clientProduct = data.client;
        this.setDealDefaults();
        this.loaded = true;
      } catch (error) {
        console.error('Something went wrong in setting deal defaults : ', error);
      }
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('Widget loading failed' + name, data);
  }

  widgetActionSuccess(name: string, data: any) {
    this.loaderService.stopLoading();
    switch (name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        console.log('Item added to cart : ', data);
        this.alertService.presentToast(this.clientProduct.title + ' ' + this.translate.instant('deal.added_to_cart'), 2000, 'top', 'top', true, this.getCurrentLanguageCode());
        this.goBack();
        break;
      case ProductDetailsWidgetActions.ATION_EDIT_CART:
        // this.alertService.presentToast(this.clientProduct.title + ' ' +
        // this.translate.instant('product_details.added_to_cart'), 1000, 'top', 'top');
        this.modalController.dismiss(true);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    console.log('Widget action failed' + name, data);
    this.loaderService.stopLoading();
  }

  showBundleGroupItems(bundleGroup) {
    let isGroupAlreadySelected = false;
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.groupId === bundleGroup.groupId && item.isSelected) isGroupAlreadySelected = true;
    });
    if (isGroupAlreadySelected) {
      return;
    }

    this.bundleGroup = bundleGroup;
    this.bundleGroupImage = this.getProductImageUrl(this.serverProduct);

    if (bundleGroup.items.length === 1) {
      this.openProductDetails(bundleGroup.items[0]);
      return;
    }

    this.openDealShowcase();
  }

  clearBundleGroupItems(bundleGroup) {
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.groupId === bundleGroup.groupId) item.remove();
      item.bundleItems.forEach((subItem: BundleItem, key: number) => {
        console.log('sub item');
        if (subItem.groupId === bundleGroup.groupId) subItem.remove();
      });
    });
    this.noOfSelectedGroups = this.noOfSelectedGroups - 1;
    this.showAddToCart = this.noOfSelectedGroups === this.noOfRequiredGroups;
    return false;
  }

  isBundelGroupSelected(bundelGroup): boolean {
    let bundleGroupSelected = false;
    bundelGroup.items.map((item) => {
      this.clientProduct.bundleItems.forEach((cItem: BundleItem, key: number) => {
        if (cItem.id === item.id && cItem.isSelected) bundleGroupSelected = true;
      });
    });
    return bundleGroupSelected;
  }

  async openStoreSelection() {
    const modal = await this.modalController.create({
      component: StoreSelectionModalComponent
    });
    await modal.present();

    modal.onDidDismiss().then((storeSelected) => {
      return storeSelected;
    });
  }

  async addToCart() {
    if (this.getCurrentStore() && this.getCurrentStore().isDefaultLocation) {
      const storeSelected = await this.openStoreSelection();
      if (!storeSelected) return;
    }
    this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader' : 'pickup-loader');
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct)
    );
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

  setDealDefaults() {
    this.noOfRequiredGroups = 0;
    this.noOfSelectedGroups = 0;
    this.showAddToCart = false;
    this.serverProduct.bundleGroups.map((group) => {
      this.noOfRequiredGroups = this.noOfRequiredGroups + 1;
    });
    if (this.cartItem) {
      this.showAddToCart = true;
      this.noOfSelectedGroups = this.noOfRequiredGroups;
      return;
    }
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      item.remove();
    });
  }

  async openProductDetails(bundleItem) {
    let component;
    let isTrio = false;
    if (BundleItem.getAttributeValueByName(bundleItem, AttributeName.CUSTOMIZABLE) === AttributeValue.CUSTOMIZABLE
      && BundleItem.getAttributeValueByName(bundleItem, AttributeName.TYPE) === AttributeValue.TRIO) {
      component = TrioComponent;
      isTrio = true;
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
      if (!addedItem || !addedItem.data) {
        console.error('Invalid configuration for added item!');
        return;
      }
      try {
        this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
          if (item.groupId === bundleItem.groupId) item.remove();
        });
        this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
          if (item.id === bundleItem.id) {
            item.add();
            item.setVariantProductId(addedItem.data.variantProductId);
            item.setVarianValueIdMap(addedItem.data.varProductValueIdMap);
            if (isTrio) item.setBundleItems(addedItem.data.bundleItems);
          }
        });

        this.noOfSelectedGroups = this.noOfSelectedGroups + 1;
        this.showAddToCart = this.noOfSelectedGroups === this.noOfRequiredGroups;
      } catch (err) {
        console.error('Something went wrong in item selection : ', err);
      }
      this.modalController.dismiss().catch(() => {
      });
    });

    return await modal.present();
  }

  async openDealShowcase() {
    const modal = await this.modalController.create({
      component: DealShowcaseComponent,
      componentProps: {
        bundleGroup: this.bundleGroup,
        bundleGroupImage: this.bundleGroupImage,
        clientProduct: this.clientProduct,
      }
    });

    modal.onDidDismiss().then((itemAdded) => {
      if (!itemAdded || !itemAdded.data) {
        return;
      }
      try {
        if (itemAdded.data) {
          this.noOfSelectedGroups = this.noOfSelectedGroups + 1;
          this.showAddToCart = this.noOfSelectedGroups === this.noOfRequiredGroups;
        }
      } catch (error) {
        console.error('Something went wrong in item selection : ', error);
      }
    });

    return await modal.present();
  }

  getSelectedVariantValues(bundleGroup) {
    let selectedVarianValues = [];

    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      item.varProductValueIdMap.forEach((variant, key) => {
        if (item.isSelected
          && item.groupId === bundleGroup.groupId
          && item.variantProductId === variant.id) {

          selectedVarianValues = variant.propertyValues.map((propval) => {
            return propval.name;
          });
          return;
        }
      });
    });
    if (!selectedVarianValues.length) return '';
    return selectedVarianValues.join(',');
  }

  getSelectedItems(bundleGroup) {
    let selectedItems = [];
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.groupId !== bundleGroup.groupId) return;
      if (item.isSelected) selectedItems.push(item.title);
    });
    return selectedItems;
  }

  getSelectedBundleItems(bundleGroup) {
    let selectedBundleItems = [];
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (!item.bundleItems.size) return;
      item.bundleItems.forEach((pItem: BundleItem, key: number) => {
        if (item.groupId !== bundleGroup.groupId) return;
        if (pItem.isSelected && pItem.price && !pItem.baseItem.isDefault) selectedBundleItems.push(pItem.title);
        if (pItem.baseItem.isDefault && pItem.count === 2) selectedBundleItems.push(pItem.title);
      })
    });
    return selectedBundleItems;
  }

  getUrl(url: string) {
    return `https://${url}`;
  }

  goBack() {
    if (this.cartItem) {
      this.modalController.dismiss();
      return;
    }
    this.location.back();
  }

}
