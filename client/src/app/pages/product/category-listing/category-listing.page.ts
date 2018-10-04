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
  DeliveryModes,
  DeliverySlotsWidget
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { Utils } from '../../../helpers/utils';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../checkout/delivery-slot-selection/delivery-slot-selection.page';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.page.html',
  styleUrls: ['./category-listing.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class CategoryListingPage extends BaseComponent implements OnWidgetLifecyle, OnWidgetActionsLifecyle {
  categoryId: string = null;
  categoryName: string;
  productShowcaseWidgetAction = new EventEmitter();
  productShowcaseWidgetExecutor = new EventEmitter();
  currencyCode: string;
  fetchDeliverySlots = false;
  asSoonPossible = false;
  navigations = [];
  subscriber = null;
  dealCategoryId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private config: ConfigService,
    public modalController: ModalController,
    private location: Location,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
    this.dealCategoryId = this.config.getConfig()['dealCategoryId'];
    console.log(this.location);
  }

  ngOnInit() {
    const langCode = this.route.snapshot.params['lang'];
    Utils.setLanguageCode(langCode);
    this.translate.use(langCode);
  }
  ngOnDestroy(){

    this.subscriber.unsubscribe();
    this.subscriber = null;
    console.error('unsubscribed');
  }

  ionViewWillEnter() {

    if (Utils.isEmpty(this.getDeliverySlot())) {
      this.fetchDeliverySlots = true;
      this.loaderService.startLoading();
    }

    if(this.categoryId !== null){
      return;
    }

    let data = this.route.snapshot.queryParams;
    this.updateCategories(data);
  }

  updateCategories(data){
    console.error("vivek", data);
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

  ionNavWillChange(data){
    console.error(data, "router")
  }

  ionViewWillLeave() {
    this.fetchDeliverySlots = false;
  }

  getProductImageUrl(product) {
    if(!product.multipleImages || !(product.multipleImages.length > 0)) {
      return this.getUrl(product.image);
    } else {
      let lastItem = product.multipleImages.slice().pop();
      if(!lastItem.image) {
        return this.getUrl(product.image);
      }
      return this.getUrl(lastItem.image);
    }
  }

  getUrl(url: string){
    return `https://${url}`;
  }

  openProductDetails(product) {
    if (product.type === ProductType.Bundle) {
      this.router.navigateByUrl('/pizza/' + product.title + '/' + product.id);
      return;
    }
    this.router.navigateByUrl('/product/' + this.categoryName + '/' + product.title + '/' + product.id);

    // Use following, when catlog code is proper from api response
    // if (product.type === ProductType.Bundle) {
    //   this.router.navigateByUrl('/pizza/' + product.title + '/' + product.id);
    // } else if(product.type === ProductType.Deal) {
    //   this.router.navigateByUrl('/deal/' + product.title + '/' + product.id);
    // } else {
    //   this.router.navigateByUrl('/product/' + this.categoryName + '/' + product.title + '/' + product.id);
    // }
  }

  openDeal(product) {
    this.router.navigateByUrl('/deal/' + product.title + '/' + product.id);
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
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.error('name = ', name, ' data = ', data);
    switch (name) {

      case 'NAVIGATIONS' :
        this.navigations = data.items;
        break;
      case 'DELIVERYSLOTS':
        this.loaderService.stopLoading();
        this.fetchDeliverySlots = false;
        if (data && data.length) {
          this.asSoonPossible = data[0].id === -1;
        }
        if (this.asSoonPossible) {
          this.setDeliverySlot(data[0]);
        } else {
          this.presentSlotModal();
        }
    }
  }

  assignNav(data){
    this.navigations = data.items;
    return "";
  }  
  
  goToCart() {
    this.router.navigateByUrl('/cart');
  }

  switchCategories(category, categoryId) {
    if( categoryId === this.categoryId ) return;
    this.router.navigate([], { queryParams: { category: category, id: categoryId } }).then(data=>{
    }).catch(err => {
    });

    let data = {
      "category": category,
      "id": categoryId
    };

    this.updateCategories(data);
    // this.router.navigateByUrl('/products?category={{item.name}}&id={{item.categoryId}}')
  }

  isLoggedIn() {
    return this.getUserModel() && this.getUserModel().type !== 'GUEST';
  }

}
