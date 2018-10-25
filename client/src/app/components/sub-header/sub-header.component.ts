import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent extends BaseComponent implements OnInit {

  /**To get heading in the sub-header for each page */
  @Input() title: string;
  @Input() lockIcon = false;
  @Input() isModal = false;

  constructor(
    private modalController: ModalController
  ) { 
    super();
  }

  ngOnInit() {
  }

  closeModal() {
    this.modalController.dismiss();
  }

}