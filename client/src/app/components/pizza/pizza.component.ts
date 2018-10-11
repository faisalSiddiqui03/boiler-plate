import { Component, OnInit, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  WidgetNames,
  Product,
  BundleItem,
  ProductDetailsWidgetActions,
  OnWidgetLifecyle,
  OnWidgetActionsLifecyle,
  ConfigService,
} from '@capillarytech/pwa-framework';
import {
  IncrementValidator,
  DecrementValidator,
  AttributeName,
  AttributeValue,
} from '../../helpers/validators/index';
import { BaseComponent } from '../../base/base-component';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { StoreSelectionModalComponent } from '../store-selection-modal/store-selection-modal.component';

@Component({
  selector: 'app-pizza-component',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class PizzaComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  @Input() productId;
  @Input() productFromDeal;
  @Input() cartItem;
  @Input() fromFavorites;

  loaded = false;
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  serverProduct;
  clientProduct: Product;
  showToppingsView: boolean;
  updatingPrice: boolean;
  sizePropertyId: number;
  currencyCode: string;
  categoryId: string;
  productName: string;
  toppings;
  defaultToppings: Array<string>;
  addedToppings: Array<string>;
  removedToppings: Array<string>;
  maxToppingLimit: number;
  minToppingLimit: number;
  sauce = AttributeValue.SAUCE;
  topping = AttributeValue.TOPPING;

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    private loaderService: LoaderService,
    private modalController: ModalController,
    private utilService: UtilService
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.sizePropertyId = this.config.getConfig()['sizePropertyId'];
    this.maxToppingLimit = this.config.getConfig()['maxToppingLimit'];
    this.minToppingLimit = this.config.getConfig()['minToppingLimit'];
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  widgetLoadingStarted(name, data) {
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      this.serverProduct = data;
      this.clientProduct = this.serverProduct.client;
      this.setToppings();
      this.loaded = true;
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
        this.alertService.presentToast(this.clientProduct.title + ' ' + this.translate.instant('pizza.added_to_cart'), 3000, 'top', 'top', true, this.getCurrentLanguageCode());
        this.goBack();
        break;
      case ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE:
        this.updatingPrice = false;
        console.log('Price for current combination : ', data);
        break;
      case ProductDetailsWidgetActions.ATION_EDIT_CART:
        // this.alertService.presentToast(this.clientProduct.title + ' ' +
          // this.translate.instant('product_details.added_to_cart'), 1000, 'top', 'top');
        this.modalController.dismiss(true);
        // this.router.navigateByUrl('/products?category=' + this.cartItem.categoryName + '&id=' + this.cartItem.categoryId);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    this.updatingPrice = false;
    this.loaderService.stopLoading();
    console.log('Widget action failed' + name, data);
  }

  isPropertyValueSelected(propertyId: number, propertyvalueId: number) {
    return this.clientProduct.selectedPropertyValueIdMap.get(propertyId) === propertyvalueId;
  }

  setSelectedPropertyvalue(propVal) {
    this.clientProduct.setSelectedPropertyValueId(propVal.propertyId, propVal.id);
    this.getPrice();
  }

  isItemSelected(itemId: number) {
    const item = this.clientProduct.bundleItems.get(itemId);
    return item.isSelected;
  }

  addItem(serverItem) {
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    const isAdded = item.increment();
    if (!isAdded) {
      this.alertService.presentToast(this.translate.instant('pizza.add_topping_error'), 1000, 'top');
      return;
    }
    this.alertService.presentToast(this.translate.instant('pizza.add_topping_success'), 1000, 'top');
    this.setToppingStatus();
    this.getPrice();
  }

  removeItem(serverItem, isExtra = false) {
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    let isRemoved = true;
    if (isExtra) {
      isRemoved = item.decrement();
    }
    if (!isExtra) {
      isRemoved = item.remove();
    }
    if (!isRemoved) {
      this.alertService.presentToast(this.translate.instant('pizza.remove_topping_error'), 1000, 'top', 'top');
      return;
    }
    this.alertService.presentToast(this.translate.instant('pizza.remove_topping_success'), 1000, 'top', 'top');
    this.setToppingStatus();
    this.getPrice();
  }

  isExtraItem(serverItem) {
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    return item.count === 2;
  }

  getItemType(item) {
    return BundleItem.getAttributeValueByName(item, AttributeName.TYPE);
  }

  getItemprice(serverItem) {
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    return item.price;
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

  toggleToppingsView() {
    this.showToppingsView = !this.showToppingsView;
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
    if (this.productFromDeal) {
      this.modalController.dismiss(this.clientProduct);
      return;
    }
    this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader': 'pickup-loader');
    if(this.cartItem){
      this.productWidgetAction.emit(
        new Action(ProductDetailsWidgetActions.ATION_EDIT_CART, this.clientProduct)
      );
      return;
    }
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct)
    );
  }

  getPrice() {
    if (this.productFromDeal) {
      return;
    }
    this.updatingPrice = true;
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE, this.clientProduct)
    );
  }

  isSizeAvailabel(sizePropertyValueId) {
    let sizeAvailable = false;
    // variantProperties[0] is used, as variant properties of 0 is always crust properties
    // this is set from CP only once and never changes
    this.serverProduct.variantProperties[0].values.map((crustPropertyValue) => {
      sizeAvailable = this.getSizeCrustCombinationAvailability(crustPropertyValue.id, sizePropertyValueId);
    });
    return sizeAvailable;
  }

  getSizeCrustCombinationPrice(crustPropertyValueId, sizeProeprtyValueId) {
    let variantPrice = 0;
    if (!this.productFromDeal) {
      this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
        if (key === `${crustPropertyValueId}:${sizeProeprtyValueId}`) {
          variantPrice = variant.webPrice;
          return;
        }
      });
    } else {
      this.productFromDeal.variantProducts.map((variantFromDeal) => {
        this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
          if (variant.id === variantFromDeal.id
            && key === `${crustPropertyValueId}:${sizeProeprtyValueId}`
            && !variantFromDeal.isIncludedInBundleprice) {

            variantPrice = variantFromDeal.webPrice;
            return;
          }
        });
      });
    }
    return variantPrice;
  }

  getSizeCrustCombinationAvailability(crustPropertyValueId, sizeProeprtyValueId) {
    let isAvailabel = false;
    if (!this.productFromDeal) {
      this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
        if (key === `${crustPropertyValueId}:${sizeProeprtyValueId}`) {
          isAvailabel = true;
          return;
        }
      });
    } else {
      this.productFromDeal.variantProducts.map((variantFromDeal) => {
        this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
          if (variant.id === variantFromDeal.id && key === `${crustPropertyValueId}:${sizeProeprtyValueId}`) {
            isAvailabel = true;
            return;
          }
        });
      });
    }
    return isAvailabel;
  }

  getSelectedSizeAndCrust() {
    let sizeAndCrust = [];
    const selectedValueIds = [];
    this.clientProduct.selectedPropertyValueIdMap.forEach((valueId, propertyId) => {
      selectedValueIds.push(valueId);
    });
    this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
      if (key === selectedValueIds.join(':')) {
        sizeAndCrust = variant.propertyValues.map((propval) => { return propval.name; });
        return;
      }
    });
    return sizeAndCrust.reverse().join(' ');
  }

  setToppings() {
    this.toppings = [];
    this.serverProduct.bundleGroups.map((group) => { group.items.map((item) => { this.toppings.push(item) }); });
    this.toppings = this.toppings.sort((a, b) => {
      if (a.title < b.title) return -1;
      else if (a.title > b.title) return 1;
      return 0;
    });
    this.setToppingCountValidators();
    this.setToppingStatus();
    if (this.cartItem) this.showToppingsView = true;
    this.getPrice();
  };

  setToppingCountValidators() {
    try {
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

  setToppingStatus() {
    this.defaultToppings = [];
    this.addedToppings = [];
    this.removedToppings = [];
    this.toppings.map((item) => {
      this.clientProduct.bundleItems.forEach((clientItem, number) => {
        if (item.id === clientItem.id) {
          if (item.isDefault && clientItem.isSelected && clientItem.count === 1)
            this.defaultToppings.push(item.title);

          if (item.isDefault && clientItem.isSelected && clientItem.count === 2)
            this.addedToppings.push(item.title + '(' + this.translate.instant('pizza.double') + ')');

          if (!item.isDefault && clientItem.isSelected && clientItem.count === 1)
            this.addedToppings.push(item.title);

          if (!item.isDefault && clientItem.isSelected && clientItem.count === 2)
            this.addedToppings.push(item.title + '(' + this.translate.instant('pizza.double') + ')');

          if (item.isDefault && !clientItem.isSelected)
            this.removedToppings.push(item.title);
        }
      });
    });
  }

  goBack() {
    if (this.productFromDeal || this.cartItem || this.fromFavorites) {
      this.modalController.dismiss();
      return;
    }
    this.location.back();
  }
}
