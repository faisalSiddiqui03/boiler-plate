import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';

@Component({
  selector: 'app-store-selection-modal',
  templateUrl: './store-selection-modal.component.html',
  styleUrls: ['./store-selection-modal.component.scss']
})
export class StoreSelectionModalComponent extends BaseComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) {
    super();
  }

  ngOnInit() {
  }

  goBack() {
    this.modalController.dismiss(false);
  }
}
