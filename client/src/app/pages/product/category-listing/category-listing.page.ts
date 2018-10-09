import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  ConfigService,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pageView,
  pwaLifeCycle,
  Action,
  ProductShowcaseWidgetActions,
  ProductType,
  DeliverySlot,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../checkout/delivery-slot-selection/delivery-slot-selection.page';
import { LoaderService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.page.html',
  styleUrls: ['./category-listing.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class CategoryListingPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  categoryId: string = null;
  categoryName: string;
  productShowcaseWidgetAction = new EventEmitter();
  productShowcaseWidgetExecutor = new EventEmitter();
  currencyCode: string;
  navigations = [];
  dealCategoryId: number;
  asapDeliverySlot = DeliverySlot.getAsap();
  categoryNamesById = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private config: ConfigService,
    public modalController: ModalController,
    private location: Location,
    private loaderService: LoaderService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ionViewWillEnter() {
    this.getDeliverySlotPromise().then((slot) => {

      if (slot.id === -2) {

        // TODO : generate store promise
        const store = this.getCurrentStore();
        if (!store) {
            this.presentSlotModal();
        } else if (!store.isOnline(this.getDeliveryMode())) {
            this.presentSlotModal();
        } else {
            this.setDeliverySlot(this.asapDeliverySlot);
        }
      }
    });

    // if (this.categoryId !== null) {
    //   return;
    // }
    // const data = this.route.snapshot.queryParams;
    const urlData = this.location.path(false);
    const params = urlData.split('?')[1].split('&');
    const dataFromParams = {
      id: '',
      category: ''
    };
    params.forEach((param) => {
      const paramValues = param.split('=');
        dataFromParams[paramValues[0]] = paramValues[1]
    });
    this.updateCategories(dataFromParams);
  }

  updateCategories(data) {
    this.categoryId = data.id;
    this.categoryName = data.category;
  }

  getShowcaseFilter(categoryId) {

    return {
      from: 0,
      limit: 100,
      categoryIds: [categoryId]
    };
  }

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage
    });
    return await modal.present();
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

  openProductDetails(product) {
    if (product.type === ProductType.Bundle) {
      this.capRouter.routeByUrlWithLanguage('/pizza/' + product.title + '/' + product.id);
      // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/pizza/' + product.title + '/' + product.id));
      return;
    }
    this.capRouter.routeByUrlWithLanguage('/product/' + this.categoryName + '/' + product.title + '/' + product.id);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/product/' + this.categoryName + '/' + product.title + '/' + product.id));

    // Use following, when catlog code is proper from api response
    // if (product.type === ProductType.Bundle) {
    //   this.router.navigateByUrl(this.utilService.getLanguageCode() + '/pizza/' + product.title + '/' + product.id);
    // } else if(product.type === ProductType.Deal) {
    //   this.router.navigateByUrl(this.utilService.getLanguageCode() + '/deal/' + product.title + '/' + product.id);
    // } else {
    //   this.router.navigateByUrl(this.utilService.getLanguageCode() + '/product/' + this.categoryName + '/' + product.title + '/' + product.id);
    // }
  }

  openDeal(product) {
    this.capRouter.routeByUrlWithLanguage('/deal/' + product.title + '/' + product.id);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/deal/' + product.title + '/' + product.id));
  }

  updateFavorites(isFavorite, product) {
    if (!isFavorite) {
      this.productShowcaseWidgetAction.emit(new Action(ProductShowcaseWidgetActions.ACTION_MARK_AS_FAVORITE, product));
      return;
    }
    this.productShowcaseWidgetAction.emit(new Action(ProductShowcaseWidgetActions.ACTION_UNMARK_AS_FAVORITE, product));
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name: string, data: any): any {
  }

  widgetLoadingFailed(name: string, data: any): any {
    switch (name) {
      case 'NAVIGATIONS':
        break;
    }
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    switch (name) {

      case 'NAVIGATIONS':
        this.navigations = data.items;
        this.createCategoryNameMap(data.items);
        break;
    }
  }

  assignNav(data) {
    this.navigations = data.items;
    return "";
  }

  goToCart() {
    this.capRouter.routeByUrlWithLanguage('/cart');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/cart'));
  }

  switchCategories(data) {
    if (data.categoryId === this.categoryId) return;
    this.router.navigate([], { queryParams: data }).then(data => {
    }).catch(err => {
    });
    this.updateCategories(data);
  }

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
  }

  createCategoryNameMap(items) {
    items.forEach((item) => {
      this.categoryNamesById.set(item.categoryId, item.name);
    });
  }
}
