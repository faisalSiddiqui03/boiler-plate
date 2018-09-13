import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfigService,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pageView,
  pwaLifeCycle
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.page.html',
  styleUrls: ['./category-listing.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class CategoryListingPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  categoryId: string;
  categoryName: string;
  productShowcaseWidgetAction = new EventEmitter();
  productShowcaseWidgetExecutor = new EventEmitter();
  currencyCode: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private config: ConfigService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params.categoryId;
    this.categoryName = this.route.snapshot.params.categoryName;
  }

  getProductImageUrl(product) {
    console.log('dekho', product);
    if (product && product.multipleImages && product.multipleImages.length) {
      return `http://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
    }
  }

  getCategoryUrl(categoryName, categoryId) {
    return '/product/' + categoryName + '/' + categoryId;
  }

  openProductDetails(product) {
    this.router.navigateByUrl('/product/' + this.categoryName + '/' + product.title + '/' + product.id);
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name: string, data: any): any {
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }

  goToCart() {
    this.router.navigateByUrl('/cart');
  }
}
