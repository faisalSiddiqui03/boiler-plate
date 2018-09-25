import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
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
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

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
  serverProduct;
  currencyCode: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private translate: TranslateService,
    private config: ConfigService,
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
      this.serverProduct = data;
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

  goBack() {
    this.location.back();
  }
}
