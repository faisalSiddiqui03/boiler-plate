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
import { Utils } from '../../helpers/utils';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PizzaComponent } from '../pizza/pizza.component';
import { AttributeName, AttributeValue } from '../../helpers/validators';


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
  showPizza: boolean;
  clientProduct: Product;
  showAdd: boolean;

  currencyCode: string;

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    public navParams: NavParams,
    private modalController: ModalController,
    private router: Router,
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];

  }

  ngOnInit() {
    console.log('bundleGroupType', this.bundleGroupType);
    console.log('bundleGroupItems', this.bundleGroupItems);
    this.translate.get('deal.choose_your').subscribe(value=>{
      this.bundleGroupTitle = value +" "+ this.bundleGroupTitle;
    })
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

  isCustomizable(item) {
    const customizable = BundleItem.getAttributeValueByName(item, AttributeName.CUSTOMIZABLE);
    if (customizable === AttributeValue.CUSTOMIZABLE) {
      return true;
    }
    return false;
  }

  addProductToDeal(itemToAdd) {
    if(itemToAdd.variantProductId){
      console.error('Adding simple product with variant from deal showcase is not implemented!');
      return;
    }
    this.clientProduct.bundleItems.forEach((item: BundleItem, key: number) => {
      if(item.id === itemToAdd.id) item.add();
    });
    this.modalController.dismiss(true);
  }

  async showProduct(bundleItem) {

    if(!this.isCustomizable(bundleItem)) return;

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

  closeModal() {
    this.modalController.dismiss(false);
  }
}
