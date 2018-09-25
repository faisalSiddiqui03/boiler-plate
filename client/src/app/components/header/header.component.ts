import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OnWidgetActionsLifecyle, OnWidgetLifecyle, DeliveryModes } from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';
import { LocationPage } from '../../pages/checkout/location/location.page';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../helpers/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  deliveryModes: any;

  constructor(
    private router: Router,
    public modalController: ModalController,
    private translate: TranslateService
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

  async openLocationModal() {
    const modal = await this.modalController.create({
      component: LocationPage,
    });
    return await modal.present();
  }

}
