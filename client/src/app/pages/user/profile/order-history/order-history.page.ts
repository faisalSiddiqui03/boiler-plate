import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  ConfigService
} from '@capillarytech/pwa-framework';
import { Utils } from "@capillarytech/pwa-components";
import { TranslateService } from '@ngx-translate/core';
import { OrderHistoryComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class OrderHistoryPage extends OrderHistoryComponent implements OnInit {

  titleValue = '';
  isShowMoreButtonVisible = true;
  isOrderHistoryWidgetLoaded = false;
  accordianMap = new Map();
  currencyCode: string;

  constructor(
    private translate: TranslateService,
    private config: ConfigService
  ) {
    super();
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.translate.get('order_history_page.order_history').subscribe(value => {
      this.titleValue = value;
    });
  }

  getOrderDetails(order) {
    this.routeByUrl('order-details/' + order.id);
  }

  toggleShowProduct(i) {
    if (this.accordianMap.has(i)) {
      this.accordianMap.delete(i);
    } else {
      this.accordianMap.set(i, true);
    }
  }

  getTimeHHMM(date) {
    return Utils.getTimeHHMM(date);
  }

  getDate(date) {
    return Utils.getDate(date);
  }

  ionViewWillLeave() {
    this.isOrderHistoryWidgetLoaded = false;
  }

  handleWidgetActionNextFailed(data) {
    this.isShowMoreButtonVisible = false;
  }

  handleWidgetActionNextSuccess(data) {
    if (!data) {
      this.isShowMoreButtonVisible = false;
    }
  }
  
  handleOrderHistoryLoadingFailed(data) {
    this.isOrderHistoryWidgetLoaded = true;
  }

  handleOrderHistoryLoadingSuccess(data) {
    this.isOrderHistoryWidgetLoaded = true;
  }

}
