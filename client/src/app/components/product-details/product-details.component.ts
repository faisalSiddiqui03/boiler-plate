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
import { Utils } from '../../helpers/utils';
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
    private config: ConfigService,
    private location: Location,
    private loaderService: LoaderService,
    private modalController: ModalController
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
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
    switch (name) {
      case ProductDetailsWidgetActions.ACTION_ADD_TO_CART:
        console.log('Item added to cart : ', data);
        this.loaderService.stopLoading();
        this.alertService.presentToast(this.clientProduct.title + ' ' +
          this.translate.instant('product_details.added_to_cart'), 1000, 'top');
        this.goBack();
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
    this.clientProduct.selectedPropertyValueIdMap.forEach((valueId, propId) => {
      this.noOfProperties = this.noOfProperties + 1;
      this.clientProduct.selectedPropertyValueIdMap.set(propId, 0);
    });
    this.showAddToCart = !this.clientProduct.isParentProduct;
    this.serverProduct.variantProperties.map((prop) => {
      prop.showProperty = true;
    });
  }

  isPropertyValueSelected(propertyId: number, propertyvalueId: number) {
    return this.clientProduct.selectedPropertyValueIdMap.get(propertyId) === propertyvalueId;
  }

  setSelectedPropertyvalue(propVal, prop) {
    if (this.clientProduct.selectedPropertyValueIdMap.get(propVal.propertyId) === 0) {
      this.noOfSelectedProperties = this.noOfSelectedProperties + 1;
    }
    this.showAddToCart = this.noOfSelectedProperties === this.noOfProperties;
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

  getProductImageUrl() {
    if (!this.serverProduct
      || !this.serverProduct.multipleImages
      || !this.serverProduct.multipleImages.length) {
      return;
    }
    const imageUrl = this.getUrl(this.serverProduct.multipleImages[1] ? this.serverProduct.multipleImages[1].largeImage : this.serverProduct.multipleImages[0].largeImage);
    return imageUrl;
  }

  getUrl(url: string) {
    return `https://${url}`;
  }

  addToCart() {
    this.loaderService.startLoading();
    this.productWidgetAction.emit(
      new Action(ProductDetailsWidgetActions.ACTION_ADD_TO_CART, this.clientProduct)
    );
  }

  goBack() {
    this.setClient();
    if(!this.productFromDeal){
      this.location.back();
      return;
    }
    this.modalController.dismiss();
  }
}
