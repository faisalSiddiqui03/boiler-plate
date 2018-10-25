import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})

export class LocationPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private actRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());
  }

  dismiss() {
    console.log('on dismiss');
  }
}

