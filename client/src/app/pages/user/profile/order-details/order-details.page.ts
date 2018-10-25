import { Component } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
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

  constructor(
    private actRoute: ActivatedRoute,
    private capRouter: CapRouterService,
  ) {
    super();
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
