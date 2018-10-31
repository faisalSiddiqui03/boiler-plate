import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@capillarytech/pwa-framework';
import { Utils } from '@capillarytech/pwa-components/util/utils';
import { DeliverySlotComponent } from '@capillarytech/pwa-components/delivery-slot/delivery-slot';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-slot-selection',
  templateUrl: './delivery-slot-selection.page.html',
  styleUrls: ['./delivery-slot-selection.page.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class DeliverySlotSelectionPage extends DeliverySlotComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    public modalController: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    this.loadText();
  }

  toggleCheckbox() {

      this.asSoonPossible = !this.asSoonPossible;
      this.slotSelected = this.asSoonPossible;
      this.slotContent = this.asSoonPossible ? this.asapText : '';
      this.activeTimeSlot = this.asSoonPossible ? 0 : null;
  }

  async loadText() {

    this.asapText = await this.translate.instant('delivery_slot_selection_page.asap');
  }

  closeModal() {

    this.handleDefaultSlotSelection();
  }

  selectTimeSlot() {

    super.selectTimeSlot();
    this.modalController.dismiss();
  }
}
