import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OnWidgetActionsLifecyle, OnWidgetLifecyle, DeliveryModes } from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../base/base-component';
import { ModalController } from '@ionic/angular';
import { DeliverySlotSelectionPage } from '../../pages/checkout/delivery-slot-selection/delivery-slot-selection.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  deliveryModes: any;

  constructor(
    private router: Router,
    public modalController: ModalController
  ) {
    super();
    this.deliveryModes = DeliveryModes;
  }

  /** Inputs to show only required tags in header */
  @Input() showHalalTag = false;
  @Input() showLanguage = false;
  @Input() showTime = false;
  @Input() showCart = false;
  @Input() headerClass = '';

  ngOnInit() {
    console.log('veiev', this.globalSharedService.getDeliverySlot());
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  async presentSlotModal() {
    const modal = await this.modalController.create({
      component: DeliverySlotSelectionPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
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

}
