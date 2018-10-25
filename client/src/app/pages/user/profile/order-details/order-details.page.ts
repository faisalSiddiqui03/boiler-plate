import { Component, OnInit } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  ConfigService,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OrderDetailsComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class OrderDetailsPage extends OrderDetailsComponent implements OnInit {

  titleValue = '';
  orderId;
  isOrderDetailsLoadingDone = false;
  currencyCode;

  constructor(
    private translate: TranslateService,
    private actRoute: ActivatedRoute,
    private config: ConfigService,
    private capRouter: CapRouterService,
  ) {
    super();

    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.translate.get('order_details_page.order_details').subscribe(value => {
      this.titleValue = value;
    });
    this.orderId = this.actRoute.snapshot.params['orderId'];
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
