import {Component, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {Router} from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { NavigationShowcase } from '@capillarytech/pwa-components/showcase/navigation-showcase';
import {
  pageView,
  pwaLifeCycle,
  DeliverySlot,
  CapRouterService,
  DeliveryModes
} from '@capillarytech/pwa-framework';
import { ProductType } from '@cap-widget/product-modules';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../checkout/delivery-slot-selection/delivery-slot-selection.page';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { Utils } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.page.html',
  styleUrls: ['./category-listing.page.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class CategoryListingPage extends NavigationShowcase {

  showCheckout = false;
  dealCategoryId: string;
  asapDeliverySlot = DeliverySlot.getAsap();
  categoryNamesById = new Map();
  deliveryModes = DeliveryModes;

  constructor(
    public router: Router,
    public modalController: ModalController,
    private loaderService: LoaderService,
    private capRouter: CapRouterService,
    private alertService: AlertService,
    @Inject(DOCUMENT) document
  ) {
    super(router);
    this.dealCategoryId = this.configService.getConfig()['dealCategoryId'];
  }

  ionViewWillEnter() {
    this.checkSlots();
    this.updateCategoriesFromUrl();
  }

  handleDefaultStoreSlotError() {
    this.presentSlotModal();
  }

  handleDefaultStoreSlotSuccess() {
    this.setDeliverySlot(DeliverySlot.getAsap());
  }

  ionViewDidEnter() {
    this.loaderService.stopLoading();
  }

  async presentSlotModal() {
    const modal = await this.modalController.create({ component: DeliverySlotSelectionPage });
    return await modal.present();
  }

  openProductDetails(product) {
    if (product.type === ProductType.Bundle) {
      this.capRouter.routeByUrl('/pizza/' + Utils.getHiphenatedString(product.title) + '/' + product.id);
      return;
    }

    const navigationUrl = '/product/' + Utils.getHiphenatedString(this.categoryNamesById.get(this.categoryId)) + '/' +
    Utils.getHiphenatedString(product.title) + '/' + product.id;
    this.capRouter.routeByUrl(navigationUrl);
  }

  openDeal(product) {
    this.capRouter.routeByUrl('/deals/' + Utils.getHiphenatedString(product.title) + '/' + product.id);
  }

  goToCart() {
    this.capRouter.routeByUrl('/cart');
  }

  switchCategories(data) {
    this.alertService.closeToast();
    super.switchCategories(data);
  }

  async ionViewDidLeave() {
    await this.alertService.closeToast();
  }

  scrollMenu(id) {
    const selectedItem = document.getElementById(id);
    if (!selectedItem) {
      return;
    }
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

  handleWidgetLoadingNavigationFailed(data: any) {

    // overload navigations with default values for the app
  }

  handleWidgetLoadingNavigationSuccess() {
    this.showCheckout = true;
  }

  handleWidgetLoadingProductShowcaseFailed(name: string, data: any): any {

    // retry or hide the tab
  }
}
