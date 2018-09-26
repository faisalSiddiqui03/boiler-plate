import { Component, OnInit, EventEmitter, ViewEncapsulation, ComponentRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
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
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { ModalController } from '@ionic/angular';
import { DealShowcaseComponent } from '../../../components/deal-showcase/deal-showcase.component'

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class DealPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  productId: number;
  productName: string;
  loaded = false;
  productWidgetAction = new EventEmitter();
  currencyCode: string;
  bundleGroupItems: any;
  clientProduct: Product;
  isShowBundleGroupItems: boolean;
  bundleGroupType: string;
  bundleGroupTitle: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private config: ConfigService,
    private modalController: ModalController,
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }

  widgetLoadingStarted(name, data){
    console.log('Widget loading started' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    if (name == WidgetNames.PRODUCT_DISPLAY) {
      this.loaded = true;
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('Widget loading failed' + name, data);
  }

  widgetActionSuccess(name: string, data: any) {
    
  }

  widgetActionFailed(name: string, data: any) {
    console.log('Widget action failed' + name, data);
  }

  async showBundleGroupItems(bundleGroup, clientProduct): Promise<void> {
    this.bundleGroupItems = bundleGroup.items;
    this.bundleGroupType = bundleGroup.inputType;
    this.clientProduct = clientProduct;
    this.bundleGroupTitle = bundleGroup.title;
    
    const modal = await this.modalController.create({
      component: DealShowcaseComponent,
      componentProps: {
        bundleGroupItems: this.bundleGroupItems,
        bundleGroupType: this.bundleGroupType,
        clientProduct: this.clientProduct,
      }
    });

    modal.onDidDismiss().then((value) => {
      console.log('dissmissed', value);
    });

    return await modal.present();
  }

  getProductImageUrl(product) {
    if(!product 
      || !product.multipleImages 
      || !product.multipleImages.length){
      return;
    }
    const imageUrl = this.getUrl(product.multipleImages[1].largeImage);
    return imageUrl;
  }

  getUrl(url: string){
    return `https://${url}`;
  }

  goBack() {
    this.location.back();
  }
}
