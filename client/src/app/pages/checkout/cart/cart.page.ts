import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import {
  ConfigService
} from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../helpers/utils';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CartPage extends BaseComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private actRoute: ActivatedRoute,
    private modalController: ModalController,
  ) {
    super();
    this.translateService.use(this.utilService.getLanguageCode());
  }

  ngOnInit() {
  }

  goToDeals() {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products/listing/(0:0)?category=deals&id=CU00215646'));
  }

  goToPage(pageName) {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }
}
