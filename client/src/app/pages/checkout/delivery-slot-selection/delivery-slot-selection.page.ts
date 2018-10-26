import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle, OnWidgetLifecyle
} from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
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
export class DeliverySlotSelectionPage extends DeliverySlotComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle  {

  constructor(
    private translate: TranslateService,
    public modalController: ModalController,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.get('delivery_slot_selection_page.asap').subscribe(value => {
      this.asapText = value;
    });
  }

  closeModal() {
    this.handleDeliverySlotCloseModel();
  }

  handleDeliverySlotCloseModel() {
    this.modalController.dismiss();
    super.handleDeliverySlotCloseModel();
  }

}
