import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../base/base-component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  LifeCycle,
  OrderDetailsWidget
} from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class SuccessPage extends BaseComponent implements OnInit {

  constructor(
      private route: ActivatedRoute,
      private router: Router
  ) {
      super();
  }

  orderId: number;
  email: string;
  orderDetailWidgetAction = new EventEmitter();

  ngOnInit() {
    this.orderId = this.route.snapshot.params.orderId;
    this.email = this.route.snapshot.params.email;
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
  }

}
