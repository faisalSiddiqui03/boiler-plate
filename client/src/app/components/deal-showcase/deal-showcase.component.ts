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
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { AttributeName, AttributeValue } from '../../helpers/validators';


@Component({
  selector: 'app-deal-showcase-component',
  templateUrl: './deal-showcase.component.html',
  styleUrls: ['../../pages/product/category-listing/category-listing.page.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class DealShowcaseComponent extends BaseComponent implements OnInit {

  bundleGroupType: string;
  bundleGroupItems: any;
  bundleGroupTitle: string;
  showPizza: boolean;
  clientProduct: Product;

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
  }

  getProductImageUrl(product) {
    return this.getUrl(product.image);;
  }

  getUrl(url: string){
    return `https://${url}`;
  }

  async showProduct(bundleItem) {
    console.log('product', bundleItem);
    let modal;
    let component;
    const customizable = BundleItem.getAttributeValueByName(bundleItem, AttributeName.CUSTOMIZABLE);
    if(customizable === AttributeValue.CUSTOMIZABLE){
      component = PizzaComponent;
    } else {
      component = ProductDetailsComponent;
    }

    modal = await this.modalController.create({
      component: component,
      componentProps: {
        productId: bundleItem.productId,
        productFromDeal: bundleItem,
      }
    })
    
    return await modal.present();
  }

  closeModal() {
    this.modalController.dismiss('new data');
  }
}
