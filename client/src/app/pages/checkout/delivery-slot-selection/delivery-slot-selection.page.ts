import { Component, OnInit } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  Action,
  DeliverySlotsWidget,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { BaseComponent } from '../../../base/base-component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delivery-slot-selection',
  templateUrl: './delivery-slot-selection.page.html',
  styleUrls: ['./delivery-slot-selection.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class DeliverySlotSelectionPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle  {

  asSoonPossible: boolean = false;
  slotSelected: boolean = false;
  slotContent: string = "";
  activeTimeSlot: number;
  timeSlotObj;

  constructor(private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, public modalController: ModalController) {
    super();

    // this.loaderService.startLoading();
    this.slotSelected = true;
    this.slotContent = this.asSoonPossible ? "ASAP" : "";
    this.activeTimeSlot = 0;
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  toggleCheckbox() {
    this.asSoonPossible = !this.asSoonPossible;
    this.slotSelected = this.asSoonPossible;
    this.slotContent = this.asSoonPossible ? "ASAP" : "";
    this.activeTimeSlot = this.asSoonPossible ? 0 : null;
  }

  selectTime(timeslot, index) {
    this.asSoonPossible = !(timeslot.id != -1);
    this.slotSelected = true;
    this.slotContent = timeslot.time;
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
        this.asSoonPossible = data[0].id === -1;
        this.slotContent = this.asSoonPossible ? "ASAP" : data[0].time;
        this.timeSlotObj = data[0];
    }
  }

  widgetLoadingFailed(name, data) {
    console.log('loading failed' + name, data);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  selectTimeSlot() {
    this.setDeliverySlot(this.timeSlotObj);
    this.closeModal();
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

}
