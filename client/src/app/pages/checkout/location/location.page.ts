import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})

export class LocationPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private actRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    const langCode = this.actRoute.snapshot.params['lang'];
    Utils.setLanguageCode(langCode);
    this.translate.use(langCode);
  }

  dismiss() {
    console.log('on dismiss');
  }
}

