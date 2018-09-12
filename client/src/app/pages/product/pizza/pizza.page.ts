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
} from '@capillarytech/pwa-framework';
import {   
  IncrementValidator,
  DecrementValidator,
} from '../../../../validators/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BasePage } from '../../../base/base-page';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
})

@pwaLifeCycle()
export class PizzaPage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  loaded = false;
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  serverProduct;
  clientProduct: Product;
  productId: number;
  showToppingsView: boolean = false;
  disableAdd: boolean = false;
  disableRemove: boolean = true;
  updatingPrice: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) {
    super();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
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
        break;
      case ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE:
        this.updatingPrice = false;
        console.log('Price for current combination : ', data);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
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
    propVal['abc'] = propVal.name;
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
      this.alertService.presentToast('Exceeded maximum topping count', 1000, 'top');
      return;
    }
    this.alertService.presentToast('Topping successfuly added', 1000, 'top');
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
      this.alertService.presentToast('Minimum topping count reached', 1000, 'top');
      return;
    }
    this.alertService.presentToast('Topping successfuly removed', 1000, 'top');
    this.getPrice();
  }

  isExtraItem(serverItem){
    const item = this.clientProduct.bundleItems.get(serverItem.id);
    if(item.count === 2) return true;
    return false;
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
    return `http://${url}`;
  }

  toggleToppingsView(){
    this.showToppingsView = !this.showToppingsView;
  } 

  addToCart() {
    let action = new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct);
    this.productWidgetAction.emit(action);
  }

  getPrice() {
    this.updatingPrice = true;
    const action = new Action(ProductDetailsWidgetActions.ACTION_GET_BUNDLE_PRICE, this.clientProduct);
    this.productWidgetAction.emit(action);
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
}
