import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '@capillarytech/pwa-components';
import {
  Action,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  DeliveryModes,
  LanguageService, pwaLifeCycle,
  CapRouterService,
  DeliverySlot
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';
import { TranslateService } from '@capillarytech/pwa-framework';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { LogoutWidgetActions } from '@cap-widget/authentication/logout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
export class HeaderComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  deliveryModes: any;
  logoutWidgetAction = new EventEmitter();
  navigations = [];
  categoryId: string = null;
  asapDeliverySlot = DeliverySlot.getAsap();
  fetchDeliverySlots = false;
  constructor(
    private route: ActivatedRoute,
    public modalController: ModalController,
    private translate: TranslateService,
    private alertService: AlertService,
    private languageService: LanguageService,
    private capRouter: CapRouterService,
  ) {
    super();
    this.deliveryModes = DeliveryModes;
  }

  /** Inputs to show only required tags in header */
  @Input() showHalalTag = false;
  @Input() showLanguage = false;
  @Input() showTime = false;
  @Input() showCart = false;
  @Input() showMode = true;
  @Input() showLocation = true;
  @Input() headerClass = '';
  @Input() showUserIcon = true;
  @Input() dealsHeader = false;
  @Input() dealsHeadershowLocation = false;
  @Input() dealsHeadershowTime = false;
  enableUserDropdown = false;
  @Output() switchCategory: EventEmitter<any> = new EventEmitter<any>();
  @Input() isModalActive = false;
  @Input() selectedCategoryId;

  ngOnInit() {
    const data = this.route.snapshot.queryParams;
    if (!this.selectedCategoryId) {
      this.categoryId = data.id;
    }
  }

  goToPage(pageName) {
    if (this.isModalActive) {
      this.modalController.dismiss();
    }
    this.capRouter.routeByUrl(pageName);
  }

  async switchLanguage() {
    const langCode = this.getCurrentLanguageCode();
    switch (langCode) {
      case 'ar':
        await this.languageService.updateLanguageByCode('en');
        this.capRouter.routeByUrl('home');
        break;

      case 'en':
        await this.languageService.updateLanguageByCode('ar');
        this.capRouter.routeByUrl('home');
        break;

      default:
        // do nothing
        break;
    }

  }

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage,
    });
    return await modal.present();
  }

  showDropDown() {
    this.enableUserDropdown = !this.enableUserDropdown;
  }

  async widgetActionFailed(name: string, data: any) {
    console.log('name action failed: ' + name + ' data: ' + data);
    switch (name) {
      case LogoutWidgetActions.ACTION_LOGOUT:
        const coupon_remove_success = await this.translate.instant('my_account_page.error_logging_out');
        await this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case LogoutWidgetActions.ACTION_LOGOUT:
        const coupon_remove_success = await this.translate.instant('my_account_page.successfully_loged_out');
        this.capRouter.routeByUrl('/home');
        await this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    switch (name) {
      case 'NAVIGATIONS':
        this.navigations = data.items;
        break;
    }
  }

  async openLocationModal() {
    this.capRouter.routeByUrl('/home');
  }

  logout() {
    const action = new Action(LogoutWidgetActions.ACTION_LOGOUT);
    this.logoutWidgetAction.emit(action);
  }

  switchCategories(category, categoryId) {
    this.enableUserDropdown = false;
    this.categoryId = categoryId;
    this.switchCategory.emit({ category, id: categoryId });
  }

  switchCategoryPage(category, categoryId) {
    this.enableUserDropdown = false;
    this.categoryId = categoryId;
    if (this.isModalActive) {
      this.modalController.dismiss();
    }
    const categoryName = Utils.getHiphenatedString(category);
    this.capRouter.routeByUrl(`/products?category=${categoryName}&id=${categoryId}`);
  }
}
