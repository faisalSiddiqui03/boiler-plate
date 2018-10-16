import { Component, EventEmitter, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, DOCUMENT } from '@angular/common';
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
  CapRouterService,
  SeoInfoEntityType,
  WidgetNames,
  DeliveryModes
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../checkout/delivery-slot-selection/delivery-slot-selection.page';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';

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
  productShowcaseWidgetExecutor = new EventEmitter();
  productShowcaseActionMap = new Map();
  currencyCode: string;
  navigations = [];
  dealCategoryId: string;
  asapDeliverySlot = DeliverySlot.getAsap();
  categoryNamesById = new Map();
  favoriteInProgress = new Map();
  seoEntityType: SeoInfoEntityType = SeoInfoEntityType.CATEGORY;
  categorySeoMap = {};
  deliveryModes: any;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private translate: TranslateService,
    private config: ConfigService,
    public modalController: ModalController,
    private location: Location,
    private loaderService: LoaderService,
    private capRouter: CapRouterService,
    @Inject(DOCUMENT) document
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];
    this.deliveryModes = DeliveryModes;
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ionViewWillEnter() {
    this.checkSlots();
    this.closeToast();
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
    dataFromParams.category = dataFromParams.category.split('%20').join(' ');
    this.updateCategories(dataFromParams);
    this.scrollMenu(dataFromParams.id);
  }

  ionViewDidEnter() {
    this.loaderService.stopLoading();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }

  async checkSlots() {

    const slot = await this.getDeliverySlotPromise();
    const store = await this.getCurrentStoreAsync();

    if (slot.id === -2 && !store.isDefaultLocation) {
      if (store === null) {
        this.presentSlotModal();
      } else if (!store.isOnline(this.getDeliveryMode())) {
        this.presentSlotModal();
      } else {
        this.setDeliverySlot(DeliverySlot.getAsap());
      }
    }
  }

  updateCategories(data) {
    this.categoryId = data.id;
    let seoInfo = this.categorySeoMap[this.categoryId];
    if (seoInfo) {
      //this.seoService.addPageTagsViaSeoInfo(seoInfo);
      this.addPageTagsViaSeoInfo(seoInfo);
    }
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
      return;
    }

    const navigationUrl = '/product/' + this.categoryNamesById.get(this.categoryId) + '/' +
      this.encodeURIComponent(product.title) + '/' + product.id;
    this.capRouter.routeByUrlWithLanguage(navigationUrl);
  }

  openDeal(product) {
    this.capRouter.routeByUrlWithLanguage('/deal/' + product.title + '/' + product.id);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/deal/' + product.title + '/' + product.id));
  }

  encodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  updateFavorites(isFavorite, product) {
    this.favoriteInProgress.set(product.id, true);
    if (!isFavorite) {
      this.productShowcaseActionMap.get(this.categoryId).emit(new Action(ProductShowcaseWidgetActions.ACTION_MARK_AS_FAVORITE, product));
      return;
    }
    this.productShowcaseActionMap.get(this.categoryId).emit(new Action(ProductShowcaseWidgetActions.ACTION_UNMARK_AS_FAVORITE, product));
  }

  widgetActionFailed(name: string, data: any): any {
    switch (name) {
      case ProductShowcaseWidgetActions.ACTION_MARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
      case ProductShowcaseWidgetActions.ACTION_UNMARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    switch (name) {
      case ProductShowcaseWidgetActions.ACTION_MARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
      case ProductShowcaseWidgetActions.ACTION_UNMARK_AS_FAVORITE:
        this.favoriteInProgress.delete(data.product.id);
        break;
    }
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
      case WidgetNames.SEO_INFO:
        console.log('SEO info data', data);
        if (data) {
          this.categorySeoMap[data.id] = data.seoInfo;
        }
        break;
      case 'NAVIGATIONS':
        this.navigations = data.items;
        this.createMapsBasedOnCategory(data.items);
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
    this.router.navigate([], { queryParams: data })
      .then(data => {
      })
      .catch(err => {
      });
    this.updateCategories(data);
  }

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
  }

  createMapsBasedOnCategory(items) {
    items.forEach((item) => {
      this.categoryNamesById.set(item.categoryId, item.name);
      this.productShowcaseActionMap.set(item.categoryId, new EventEmitter());
    });
  }

  scrollMenu(id) {
    const selectedItem = document.getElementById(id);
    if (!selectedItem) return;
    const bottomDiv = document.getElementById('bottom-div');
    if (this.getCurrentLanguage() && this.getCurrentLanguage().alignment === 'ltr') {
      const scrollPosition = selectedItem.offsetLeft;
      bottomDiv.scrollLeft += scrollPosition;
    } else {
      const scrollPosition = selectedItem.offsetLeft;
      bottomDiv.scrollLeft += scrollPosition;
    }
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
  }
}
