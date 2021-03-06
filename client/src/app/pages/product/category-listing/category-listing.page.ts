import {Component, EventEmitter, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pageView,
  pwaLifeCycle,
  Action,
  DeliverySlot,
  CapRouterService,
  SeoInfoEntityType,
  WidgetNames,
  DeliveryModes
} from '@capillarytech/pwa-framework';
import { ProductShowcaseWidgetActions } from '@cap-widget/product-showcase';
import { ProductType } from '@cap-widget/product-modules';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
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
  navigations = [];
  dealCategoryId: string;
  asapDeliverySlot = DeliverySlot.getAsap();
  categoryNamesById = new Map();
  favoriteInProgress = new Map();
  seoEntityType: SeoInfoEntityType = SeoInfoEntityType.CATEGORY;
  categorySeoMap = {};
  deliveryModes: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public modalController: ModalController,
    private loaderService: LoaderService,
    private capRouter: CapRouterService,
    private alertService: AlertService,
    @Inject(DOCUMENT) document
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.dealCategoryId = this.configService.getConfig()['dealCategoryId'];
    this.deliveryModes = DeliveryModes;
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  ionViewWillEnter() {
    this.checkSlots();

    const urlData = this.location.path(false);
    if (!urlData) {
      return;
    }

    const params = urlData.split('?')[1].split('&');
    const dataFromParams = {
      id: '',
      category: ''
    };
    params.forEach((param) => {
      const paramValues = param.split('=');
      dataFromParams[paramValues[0]] = paramValues[1];
    });
    dataFromParams.category = dataFromParams.category.split('%20').join(' ');
    this.updateCategories(dataFromParams);
    this.scrollMenu(dataFromParams.id);
  }

  ionViewDidEnter() {
    this.loaderService.stopLoading();
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
    const seoInfo = this.categorySeoMap[this.categoryId];
    if (seoInfo) {
      // this.seoService.addPageTagsViaSeoInfo(seoInfo);
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
      this.capRouter.routeByUrl('/pizza/' + product.title + '/' + product.id);
      return;
    }

    const navigationUrl = '/product/' + this.categoryNamesById.get(this.categoryId) + '/' +
      this.encodeURIComponent(product.title) + '/' + product.id;
    this.capRouter.routeByUrl(navigationUrl);
  }

  openDeal(product) {
    this.capRouter.routeByUrl('/deal/' + product.title + '/' + product.id);
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
    this.capRouter.routeByUrl('/cart');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/cart'));
  }

  switchCategories(data) {
    this.alertService.closeToast();
    if (data.categoryId === this.categoryId) return;
    this.router.navigate([], {queryParams: data})
      .then(data => {
      })
      .catch(err => {
      });
    this.updateCategories(data);
  }

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
  }

  async ionViewDidLeave() {
    await this.alertService.closeToast();
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
    this.capRouter.routeByUrl(pageName);
  }
}
