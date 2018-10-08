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
  // OrderWidgetActions
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

  constructor(private router: Router,
    private utilService: UtilService,
    private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.translate.get('order_history_page.order_history').subscribe(value => {
      this.titleValue = value;
    });
  }

  handleOrdersResponse(data) {
    if (data.status === 204) {
      console.log('There are no previous Orders');
    }
  }

  // TODO: uncomment this code after OrderWidgetActions is exported from the framework
  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
    // switch (name) {
    //   case OrderWidgetActions.NEXT:
    //     console.log('no Data found, hiding the showmore button');
    //     this.isShowMoreButtonVisible = false;
    //     break;
    // }
  }

  // TODO: uncomment this code after OrderWidgetActions is exported from the framework
  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      // case OrderWidgetActions.NEXT:
      //   if (data) {
      //     console.log('got latest data');
      //   } else {
      //     console.log('no Data found, hiding the showmore button');
      //     this.isShowMoreButtonVisible = false;
      //   }
      //   break;
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
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('order-details/' + order.id));
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
    // let action = new Action(OrderWidgetActions.NEXT);
    // this.orderWidgetAction.emit(action);
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

  ionViewWillLeave() {
    this.isWidgetLoadingDone = false;
  }

}
