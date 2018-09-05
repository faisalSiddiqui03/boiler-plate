import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, pageView, pwaLifeCycle } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BasePage } from '../../../base/base-page';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.page.html',
  styleUrls: ['./category-listing.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class CategoryListingPage extends BasePage implements OnInit {
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

  navigateToProduct(some) {
    console.log(some);
  }

  getCategoryIdByName() {

  }

  getProductImageUrl(product) {
    if (product && product.multipleImages && product.multipleImages.length) {
      const imageUrl = `http://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
      // console.log(imageUrl);
      return imageUrl;
    }
  }

  getCategoryUrl(categoryName, categoryId) {
    return '/product/' + categoryName + '/' + categoryId;
  }
}
