import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CartPage extends BaseComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private alertService: AlertService,
  ) {
    super();
    this.translateService.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.closeCartToast();
  }

  async closeCartToast() {
    await this.alertService.closeToast();;
  }
}
