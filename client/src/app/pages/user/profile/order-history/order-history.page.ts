import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  LifeCycle,
  OrderWidget,
  CapRouterService,
  OrderWidgetActions,
  ConfigService
} from '@capillarytech/pwa-framework';
import { UtilService } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class OrderHistoryPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  titleValue = '';
  orderWidgetAction = new EventEmitter();
  orderWidgetExecutor = new EventEmitter();
  showingProductsForIndexs = [];
  isShowMoreButtonVisible = true;
  isWidgetLoadingDone = false;
  isNextLoading = false;
  currencyCode: string;

  constructor(
    private router: Router,
    private utilService: UtilService,
    private alertService: AlertService,
    private config: ConfigService,
    private translate: TranslateService,
    private capRouter: CapRouterService
    ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.translate.get('order_history_page.order_history').subscribe(value => {
      this.titleValue = value;
    });
  }

  ionViewWillEnter() {
    this.closeToast();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }

  handleOrdersResponse(data) {
    if (data.status === 204) {
      console.log('There are no previous Orders');
    }
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
    switch (name) {
      case OrderWidgetActions.NEXT:
        this.isNextLoading = false;
        console.log('no Data found, hiding the showmore button');
        this.isShowMoreButtonVisible = false;
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case OrderWidgetActions.NEXT:
        this.isNextLoading = false;
        if (data) {
          console.log('got latest data');
        } else {
          console.log('no Data found, hiding the showmore button');
          // this.isShowMoreButtonVisible = false;
        }
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, data);
    this.isWidgetLoadingDone = true;
    this.handleOrdersResponse(data);
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name, data) {
    console.log('widget loading success', name, data);
    this.isWidgetLoadingDone = true;
  }

  getOrderDetails(order) {
    this.capRouter.routeByUrlWithLanguage('order-details/' + order.id);
  }

  handleWidgetLifecycle(x: LifeCycle) {
    if (x.type === LifeCycle.WIDGET_LOADING_SUCCESS) {
      this.isWidgetLoadingDone = true;
    } else if (x.type === LifeCycle.PRIMARY_ACTION_SUCCESS) {
      alert('Action Successful: ' + x.data);
    } else {
      console.log(x);
    }
  }

  loadNextOrders() {
    this.isNextLoading = true;
    this.orderWidgetAction.emit(new Action(OrderWidgetActions.NEXT));
  }

  // helper functions for the accordian
  toggleShowingProducts(index) {
    const position = this.showingProductsForIndexs.findIndex(x => x === index);
    if (position === -1) {
      this.showingProductsForIndexs.push(index);
    } else {
      this.showingProductsForIndexs.splice(position, 1);
    }
  }

  isShowProducts(index) {
    if (this.showingProductsForIndexs.includes(index)) {
      return true;
    }
    return false;
  }

  getTimeHHMM(date) {
    return this.utilService.getTimeHHMM(date);
  }

  getDate(date) {
    return this.utilService.getDate(date);
  }

  ionViewWillLeave() {
    this.isWidgetLoadingDone = false;
  }

}
