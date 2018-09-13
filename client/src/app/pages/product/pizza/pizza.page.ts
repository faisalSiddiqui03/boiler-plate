import { Component, OnInit, EventEmitter } from '@angular/core';
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
} from '../../../../validators/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
})

@pwaLifeCycle()
export class PizzaPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  loaded = false;
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  serverProduct;
  clientProduct: Product;
  productId: number;
  showToppingsView: boolean;
  updatingPrice: boolean;
  sizePropertyId: number;
  currencyCode: string;
  categoryId: string;
  productName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    private loaderService: LoaderService,
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;

    this.sizePropertyId = parseInt(this.config.getConfig()['sizePropertyId']);
  }

  widgetLoadingStarted(name, data){
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      this.loaded = true;
      this.serverProduct = data;
      this.clientProduct = this.serverProduct.client;
      this.setValidators();
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('Widget loading failed' + name, data);
  }

  widgetActionSuccess(name: string, data: any) {
    switch(name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        console.log('Item added to cart : ', data);
        this.loaderService.stopLoading();
        this.alertService.presentToast(this.translate.instant('added_to_cart'), 1000, 'top');
        this.goBack();
        break;
      case ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE:
        this.updatingPrice = false;
        console.log('Price for current combination : ', data);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    this.updatingPrice = false;
    this.loaderService.stopLoading();
    console.log('Widget action failed' + name, data);
  }

  setValidators() {
    try{
      let items = [];
      this.serverProduct.bundleGroups.map((group) => { group.items.map((item) => { items.push(item)}); });
      items.map((item) => {
        this.clientProduct.bundleItems.forEach((clientItem, number) => {
          if(item.id === clientItem.id){
            if(this.getItemType(item) === 'Topping'){
              const decremnetValidator = new DecrementValidator(true, 3, item.isDefault);
              const incrementValidator = new IncrementValidator(true, 3);
              clientItem.validators.push(decremnetValidator);
              clientItem.validators.push(incrementValidator);
            }
          }
        });
      });
    } catch(err) {
      console.error('Error setting validators');
    }
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

  addItem(serverItem){
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    const isAdded = item.increment();
    if(!isAdded){
      this.alertService.presentToast(this.translate.instant('pizza.add_topping_error'), 1000, 'top');
      return;
    }
    this.alertService.presentToast(this.translate.instant('pizza.add_topping_success'), 1000, 'top');
    this.getPrice();
  }

  removeItem(serverItem, isExtra = false) {
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    let isRemoved = true;
    if(isExtra){
      isRemoved = item.decrement();
    } 
    if(!isExtra){
      isRemoved = item.remove();
    }
    if(!isRemoved){
      this.alertService.presentToast(this.translate.instant('pizza.remove_topping_error'), 1000, 'top');
      return;
    }
    this.alertService.presentToast(this.translate.instant('pizza.remove_topping_success'), 1000, 'top');
    this.getPrice();
  }

  isExtraItem(serverItem){
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    return item.count === 2;
  }

  getItemType(item){
    return BundleItem.getAttributeValueByName(item, 'type');
  }

  getItemprice(serverItem){
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    return item.price;
  }

  getProductImageUrl() {
    if(!this.serverProduct 
      || !this.serverProduct.multipleImages 
      || !this.serverProduct.multipleImages.length){
      return;
    }
    const imageUrl = this.getUrl(this.serverProduct.multipleImages[1].largeImage);
    return imageUrl;
  }

  getUrl(url: string){
    return `https://${url}`;
  }

  toggleToppingsView(){
    this.showToppingsView = !this.showToppingsView;
  } 

  addToCart() {
    this.loaderService.startLoading();
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct)
    );
  }

  getPrice() {
    this.updatingPrice = true;
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE, this.clientProduct)
    );
  }

  getSizeCrustCombinationPrice(crustPropertyValueId, sizeProeprtyValueId){
    let variantPrice = 0;
    this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
      if(key === `${crustPropertyValueId}:${sizeProeprtyValueId}`){
        variantPrice = variant.webPrice;
        return;
      }
    });
    return variantPrice;
  }

  getSizeCrustCombinationAvailability(crustPropertyValueId, sizeProeprtyValueId){
    let isAvailabel = false;
    this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
      if(key === `${crustPropertyValueId}:${sizeProeprtyValueId}`){
        isAvailabel = true;
        return;
      }
    });
    return isAvailabel;
  }

  getSelectedSizeAndCrust(){
    let sizeAndCrust = [];
    const selectedValueIds = [];
    this.clientProduct.selectedPropertyValueIdMap.forEach((valueId, propertyId) => {
      selectedValueIds.push(valueId);
    });
    this.clientProduct.varProductValueIdMap.forEach((variant, key) => {
      if(key === selectedValueIds.join(':')){
        sizeAndCrust = variant.propertyValues.map((propval) => { return propval.name; });
        return;
      }
    });
    return sizeAndCrust.reverse().join(' ');
  }

  goBack() {
    this.location.back();
  }
}
