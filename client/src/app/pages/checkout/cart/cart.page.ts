import { Component, EventEmitter, OnInit } from '@angular/core';
import { OnWidgetActionsLifecyle, OnWidgetLifecyle } from '@capillarytech/pwa-framework';
import { BasePage } from '../../../base/base-page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage extends BasePage implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  cartWidgetActions = new EventEmitter();
  constructor() {
    super()
  }

  ngOnInit() {
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('name loading failed: ' + name + ' data: ' + data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('name loading started: ' + name + ' data: ' + data);
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('name loading success: ' + name + ' data: ' + data);
  }

}
