import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit() {
  }

  dismiss() {
    console.log('on dismiss');
  }

}

