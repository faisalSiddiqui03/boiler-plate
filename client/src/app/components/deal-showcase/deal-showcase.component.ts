import { Component, OnInit, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  ConfigService,
  Product,
  ProductType,
  BundleItem,
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { NavParams, ModalController } from '@ionic/angular'
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzaComponent } from '../pizza/pizza.component';
import { AttributeName, AttributeValue } from '../../helpers/validators';

export enum BundleGroupInputType {
  RADIO = 'Radio button',
  CHECKBOX = 'Checkbox',
}

@Component({
  selector: 'app-deal-showcase-component',
  templateUrl: './deal-showcase.component.html',
  styleUrls: ['../../pages/product/category-listing/category-listing.page.scss', './deal-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class DealShowcaseComponent extends BaseComponent implements OnInit {

  bundleGroupType: string;
  bundleGroupItems: any;
  bundleGroupTitle: string;
  bundleGroupMinQuantity: number;

  bundleGroup: any;
  bundleGroupImage: string;
  showPizza: boolean;
  clientProduct: Product;
  showAdd: boolean;
  inputType = BundleGroupInputType;
  disableAddToCart: boolean;
  currencyCode: string;
  dealsCategoryId: string;
  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    public navParams: NavParams,
    private utilService: UtilService,
    private modalController: ModalController,
    private router: Router,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealsCategoryId = this.config.getConfig()['dealCategoryId'];
  }

  ngOnInit() {
    this.bundleGroupItems = this.bundleGroup.items;
    this.bundleGroupMinQuantity = this.bundleGroup.minQuantity;
    this.bundleGroupTitle = this.bundleGroup.title;
    this.bundleGroupType = this.bundleGroup.inputType;
    this.translate.get('deal.choose_your').subscribe(value => {
      this.bundleGroupTitle = value + " " + this.bundleGroupTitle;
    });


    if (this.bundleGroupType === BundleGroupInputType.CHECKBOX) {
      this.disableAddToCart = true;
      let count = 0;
      this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
        if(item.groupId !== this.bundleGroup.groupId) return;
        item['disableInc'] = false;
        item['disableDec'] = true;
        count = count + item.quantity;
      });
      if (count === this.bundleGroupMinQuantity) {
        this.disableAddToCart = false;
        this.toggleQuantityDisable()
      }
    }
  }

  getProductImageUrl(product) {
    if (!product.multipleImages || !(product.multipleImages.length > 0)) {
      return this.getUrl(product.image);
    } else {
      let lastItem = product.multipleImages.slice().pop();
      return lastItem.image? this.getUrl(lastItem.image) : this.getUrl(product.image);
    }
  }

  getUrl(url: string) {
    return `https://${url}`;
  }

  isCustomizable(item) {
    const customizable = BundleItem.getAttributeValueByName(item, AttributeName.CUSTOMIZABLE);
    return customizable === AttributeValue.CUSTOMIZABLE
  }

  addProductToDeal(itemToAdd) {
    if(this.bundleGroup.inputType === BundleGroupInputType.CHECKBOX){
      this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
        if (this.bundleGroup.groupId === item.groupId && item.quantity > 0) item.add();
      });
      this.modalController.dismiss(true);
      return;
    }
    if (itemToAdd.variantProductId) {
      console.error('Adding simple product with variant from deal showcase is not supported right now!');
      return;
    }
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.id === itemToAdd.id) item.add();
    });
    this.modalController.dismiss(true);
  }

  async showProduct(bundleItem) {

    if (!this.isCustomizable(bundleItem)) return;

    let modal;
    modal = await this.modalController.create({
      component: PizzaComponent,
      componentProps: {
        productId: bundleItem.productId,
        productFromDeal: bundleItem,
      }
    });

    modal.onDidDismiss().then((addedItem) => {
      // WIP
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
            item.setPrimaryProductId(addedItem.data.primaryProductId);
            item.setBundleItems(addedItem.data.bundleItems);
            item.setVarianValueIdMap(addedItem.data.varProductValueIdMap);
          }
        });
      } catch (err) {
        console.error('Something went wrong in item selection : ', err);
      }
      this.modalController.dismiss(true);
    });

    return await modal.present();
  }

  getClientBundleItem(serverBundleItem) {
    let clientBundleItem;
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if(serverBundleItem.id === item.id) {
        clientBundleItem = item;
        return;
      }
    });
    return clientBundleItem;
  }

  updateQuantity(product: BundleItem, quantity, isAdd) {
    let count = 0;
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if(this.bundleGroup.groupId === item.groupId) count = count + item.quantity;
    });
    let itemQuantity = product.quantity;
    if ((count + 1) === this.bundleGroupMinQuantity && isAdd) {
      itemQuantity = itemQuantity + 1;
      product.setQuantity(itemQuantity);
      this.disableAddToCart = false;
      return;
    }
    else if ((count + 1) > this.bundleGroupMinQuantity && isAdd) {
      this.disableAddToCart = false;
      return;
    }
    else if (count === this.bundleGroupMinQuantity && !isAdd && product.quantity !== 0) {
      this.disableAddToCart = true;
    }

    if (isAdd) itemQuantity = itemQuantity + 1;
    if (!isAdd && product.quantity >= 1) itemQuantity = itemQuantity - 1;
    product.setQuantity(itemQuantity);
  }

  toggleQuantityDisable() {
    if (this.disableAddToCart) {
      this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
        item['disableInc'] = false;
        if (item.quantity > 0) {
          item['disableDec'] = false;
        }
        else {
          item['disableDec'] = true;
        }
      });
      return;
    }
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if (item.quantity > 0) {
        item['disableInc'] = true;
        item['disableDec'] = false;
      }
      else {
        item['disableInc'] = true;
        item['disableDec'] = true;
      }
    });
  }

  closeModal() {
    this.modalController.dismiss(false);
  }
}
