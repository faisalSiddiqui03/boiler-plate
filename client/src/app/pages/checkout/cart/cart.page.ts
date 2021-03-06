import { Component, ViewEncapsulation } from '@angular/core';
import { CapRouterService } from '@capillarytech/pwa-framework';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartPage extends BaseComponent {

  constructor(
    private alertService: AlertService,
    private capRouter: CapRouterService,
  ) {
    super();
  }

  ionViewWillEnter() {
    this.closeCartToast();
  }

  async closeCartToast() {
    await this.alertService.closeToast();
  }

  goToDeals(event) {
    this.capRouter.routeByUrl('/products?category=' + event.category + '&id=' + event.id);
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }
}
