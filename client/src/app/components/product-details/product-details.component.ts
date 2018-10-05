import { Component, EventEmitter, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ConfigService,
  pwaLifeCycle,
  WidgetNames,
  Product,
  ProductDetailsWidgetActions,
  Action,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../base/base-component';
import { UtilService } from '../../helpers/utils';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-details-component',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class ProductDetailsComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  @Input() productId: number;
  @Input() productFromDeal;
  @Input() cartItem = null;

  loaded = false;
  productWidgetExecutor = new EventEmitter();
  productWidgetAction = new EventEmitter();
  serverProduct;
  clientProduct: Product;
  currencyCode: string;
  categoryId: string;
  productName: string;
  showAddToCart: boolean;
  noOfProperties: number;
  noOfSelectedProperties: number;
  showVariants: boolean;
  addingToCart: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService,
    private utilService: UtilService,
    private config: ConfigService,
    private location: Location,
    private loaderService: LoaderService,
    private modalController: ModalController
  ) {
    super();
    this.translate.use(this.utilService.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
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

  widgetActionSuccess(name: string, data: any) {
    this.loaderService.stopLoading();
    switch (name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        console.log('Item added to cart : ', data);
        this.alertService.presentToast(this.clientProduct.title + ' ' +
          this.translate.instant('product_details.added_to_cart'), 1000, 'top');
        this.goBack();
        break;
      case ProductDetailsWidgetActions.ATION_EDIT_CART:
        this.alertService.presentToast(this.clientProduct.title + ' ' +
          this.translate.instant('product_details.added_to_cart'), 1000, 'top');
        this.modalController.dismiss(true);
        // this.router.navigateByUrl(this.utilService.getLanguageCode() + '/products?category=' + this.cartItem.categoryName + '&id=' + this.cartItem.categoryId);
        break;
    }
  }

  widgetActionFailed(name: string, data: any) {
    this.loaderService.stopLoading();
    console.log('Widget action failed' + name, data);
  }

  setClient() {
    this.noOfProperties = 0;
    this.noOfSelectedProperties = 0;
    this.showAddToCart = !this.clientProduct.isParentProduct;
    this.clientProduct.selectedPropertyValueIdMap.forEach((valueId, propId) => {
      if (!this.cartItem) {
        this.noOfProperties = this.noOfProperties + 1;
        this.clientProduct.selectedPropertyValueIdMap.set(propId, 0);
      } else {
        this.showAddToCart = true;
      }
    });
    this.serverProduct.variantProperties.map((prop) => {
      prop.showProperty = true;
    });
  }

  isPropertyValueSelected(propertyId: number, propertyvalueId: number) {
    return this.clientProduct.selectedPropertyValueIdMap.get(propertyId) === propertyvalueId;
  }

  setSelectedPropertyvalue(propVal, prop) {
    if (!this.cartItem) {
      if (this.clientProduct.selectedPropertyValueIdMap.get(propVal.propertyId) === 0) {
        this.noOfSelectedProperties = this.noOfSelectedProperties + 1;
      }
      this.showAddToCart = this.noOfSelectedProperties === this.noOfProperties;
    }
    prop.showProperty = false;
    this.clientProduct.setSelectedPropertyValueId(propVal.propertyId, propVal.id);
  }

  getSelectedPropValueName(property) {
    let selectedValue = '';
    let propValueId = this.clientProduct.selectedPropertyValueIdMap.get(property.id);
    property.values.map((propVal) => {
      if (propVal.id === propValueId) selectedValue = propVal.name;
    });
    return selectedValue;
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

  addToCart() {
    if (this.productFromDeal) {
      this.modalController.dismiss(this.clientProduct);
      return;
    }
    this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
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

  goBack() {
    this.setClient();
    if (this.productFromDeal || this.cartItem) {
      this.modalController.dismiss();
      return;
    }
    this.location.back();
  }
}
