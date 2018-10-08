import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base-component';

@Component({
  selector: 'app-store-selection-modal',
  templateUrl: './store-selection-modal.component.html',
  styleUrls: ['./store-selection-modal.component.scss']
})
export class StoreSelectionModalComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  goBack() {

  }
}
