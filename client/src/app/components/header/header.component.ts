import { Location } from '@angular/common';
import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Action,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  DeliveryModes,
  LogoutWidgetActions,
  LanguageService,
  LogoutWidget, pwaLifeCycle,
  CapRouterService,
  DeliverySlot
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';

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
    private router: Router,
    private route: ActivatedRoute,
    public modalController: ModalController,
    private translate: TranslateService,
    private alertService: AlertService,
    private location: Location,
    private languageService: LanguageService,
    private utilService: UtilService,
    private capRouter: CapRouterService,
    private loaderService: LoaderService,
  ) {
    super();
    this.deliveryModes = DeliveryModes;
    this.translate.use(this.getCurrentLanguageCode());
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
  enableUserDropdown: boolean = false;
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
    //const page = this.utilService.getLanguageCode() + '/' + pageName;
    if (this.isModalActive) {
      this.modalController.dismiss();
    }
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  async switchLanguage() {
    const langCode = this.getCurrentLanguageCode();
    //console.log('Check this current lang to be changed: ', langCode);
    switch (langCode) {
      case 'ar':
        await this.languageService.updateLanguageByCode('en');
        //this.utilService.setLanguageCode('en');
        this.capRouter.routeByUrlWithLanguage('home');
        // this.router.navigateByUrl('en/home', { replaceUrl: true });

        break;

      case 'en':
        await this.languageService.updateLanguageByCode('ar');
        //this.utilService.setLanguageCode('ar');
        this.capRouter.routeByUrlWithLanguage('home');
        // this.router.navigateByUrl('ar/home', { replaceUrl: true });
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
        this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  async widgetActionSuccess(name: string, data: any) {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case LogoutWidgetActions.ACTION_LOGOUT:
        const coupon_remove_success = await this.translate.instant('my_account_page.successfully_loged_out');
        this.capRouter.routeByUrlWithLanguage('/home');
        // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
        this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
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
    this.capRouter.routeByUrlWithLanguage('/home');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/home'));
  }

  logout() {
    const action = new Action(LogoutWidgetActions.ACTION_LOGOUT);
    this.logoutWidgetAction.emit(action);
  }

  switchCategories(category, categoryId) {
    this.categoryId = categoryId;
    this.switchCategory.emit({ category, id: categoryId });
  }

  switchCategoryPage(category, categoryId) {
    this.categoryId = categoryId;
    if (this.isModalActive) {
      this.modalController.dismiss();
    }
    this.capRouter.routeByUrlWithLanguage('/products?category=${category}&id=${categoryId}');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=${category}&id=${categoryId}'));
  }

}
