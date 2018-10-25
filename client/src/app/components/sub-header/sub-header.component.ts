import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

  /**To get heading in the sub-header for each page */
  @Input() title: string;
  @Input() lockIcon = false;
  @Input() isModal = false;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  /** Function to go to previous page */
  goBack() {
    this.goBack();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}