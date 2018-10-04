import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../helpers/utils';
import { Location } from '@angular/common';
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
    private location: Location,
    private modalController: ModalController,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  /** Function to go to previous page */
  goBack() {
    this.location.back();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}