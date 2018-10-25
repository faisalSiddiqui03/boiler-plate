import { Component } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  ConfigService,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailsComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class OrderDetailsPage extends OrderDetailsComponent {

  orderId;
  isOrderDetailsLoadingDone = false;
  currencyCode;

  constructor(
    private actRoute: ActivatedRoute,
    private config: ConfigService,
    private capRouter: CapRouterService,
  ) {
    super();

    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

  handleOrderDetailsLoadingFailed(data) {
    this.isOrderDetailsLoadingDone = true;
  }

  handleOrderDetailsLoadingSuccess(data) {
    this.isOrderDetailsLoadingDone = true;
  }

}
