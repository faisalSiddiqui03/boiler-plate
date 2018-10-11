import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  Action,
  DeliverySlotsWidget,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { BaseComponent } from '../../../base/base-component';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-slot-selection',
  templateUrl: './delivery-slot-selection.page.html',
  styleUrls: ['./delivery-slot-selection.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class DeliverySlotSelectionPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle  {

  asSoonPossible = false;
  slotSelected = false;
  slotContent = '';
  activeTimeSlot: number;
  timeSlotObj;
  asapText:'';

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private actRoute: ActivatedRoute,
    public modalController: ModalController,
    private utilService: UtilService
  ) {
    super();

    // this.loaderService.startLoading(null, this.getDeliveryMode() === 'H' ? 'delivery-loader': 'pickup-loader');
    this.slotSelected = true;
    this.slotContent = this.asSoonPossible ? this.asapText : '';
    this.activeTimeSlot = 0;
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.translate.get('delivery_slot_selection_page.asap').subscribe(value => {
      this.asapText = value;
    });
  }

  toggleCheckbox() {
    this.asSoonPossible = !this.asSoonPossible;
    this.slotSelected = this.asSoonPossible;
    this.slotContent = this.asSoonPossible ? this.asapText : '';
    this.activeTimeSlot = this.asSoonPossible ? 0 : null;
  }

  selectTime(timeslot, index) {
    this.asSoonPossible = !(timeslot.id !== -1);
    this.slotSelected = true;
    this.slotContent = this.utilService.getTimeHHMM(timeslot.time);
    this.activeTimeSlot = index;
    this.timeSlotObj = timeslot;
  }

  widgetActionSuccess(name, data) {
    console.log('action success ' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    console.log('loaded ' + name, data);
    switch (name) {
      case 'DELIVERYSLOTS':
        if (!this.utilService.isEmpty(this.getDeliverySlot()) && this.getDeliverySlot().id > -2 ) {
          this.asSoonPossible = this.getDeliverySlot().id === -1;
          this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(this.getDeliverySlot().time);
          this.timeSlotObj = this.getDeliverySlot();
          this.activeTimeSlot = this.findIndexOfSlot(this.getDeliverySlot().id, data);
        } else {
          if( !Array.isArray(data) || data.length < 1 ) return;

          this.asSoonPossible = data[0].id === -1;
          this.slotContent = this.asSoonPossible ? this.asapText : this.utilService.getTimeHHMM(data[0].time);
          this.timeSlotObj = data[0];
        }
    }
  }

  findIndexOfSlot(selectedSlotId, data) {
    return data.findIndex(slot => slot.id === selectedSlotId);
  }

  widgetLoadingFailed(name, data) {
    console.log('loading failed' + name, data);
  }

  closeModal() {
    this.modalController.dismiss();
    if (this.getDeliverySlot().id === -2) {

      if(this.timeSlotObj && this.timeSlotObj.id > -2) {

        this.setDeliverySlot(this.timeSlotObj);
      } else {

        this.setDeliverySlot(this.getDeliverySlot());
      }      
    }
  }

  selectTimeSlot() {
    console.log('slot is: ', this.timeSlotObj);
    this.setDeliverySlot(this.timeSlotObj);
    this.closeModal();
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

}
