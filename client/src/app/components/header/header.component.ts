import { Component, OnInit, Input, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  Action,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  DeliveryModes,
  LogoutWidgetActions,
  LogoutWidget
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';
import { LocationPage } from '../../pages/checkout/location/location.page';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../helpers/utils';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  deliveryModes: any;
  logoutWidgetAction = new EventEmitter();

  constructor(
    private router: Router,
    public modalController: ModalController,
    private translate: TranslateService,
    private alertService: AlertService
  ) {
    super();
    this.deliveryModes = DeliveryModes;
    this.translate.use(Utils.getLanguageCode());
  }

  /** Inputs to show only required tags in header */
  @Input() showHalalTag = false;
  @Input() showLanguage = false;
  @Input() showTime = false;
  @Input() showCart = false;
  @Input() headerClass = '';
  @Input() showUserIcon = true;
  @Input() dealsHeader = false;

  enableUserDropdown:boolean = false;

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage,
    });
    return await modal.present();
  }

  showDropDown(){
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
        this.router.navigateByUrl('home');
        this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }

  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationPage,
    });
    return await modal.present();
  }

  logout() {
    const action = new Action(LogoutWidgetActions.ACTION_LOGOUT);
    this.logoutWidgetAction.emit(action);
  }

  switchCategories(category, categoryId) {
    this.router.navigateByUrl(`/products?category=${category}&id=${categoryId}`);
  }

}
