import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '@capillarytech/pwa-ui-helpers';
import { BaseComponent } from '../../../base/base-component';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import {
  pwaLifeCycle,
  CapRouterService
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
    private router: Router,
    private translate: TranslateService,
    private utilService: UtilService,
    private capRouter: CapRouterService, private loader: LoaderService
  ) {
    super();
  }

  orderId: number;
  email: string;
  orderDetailWidgetAction = new EventEmitter();

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.orderId = this.route.snapshot.params.orderId;
    this.email = this.route.snapshot.params.email;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
    this.loader.stopLoading();
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
    this.loader.startLoadingByMode('', this.getDeliveryMode());
  }

  getDate(date) {
    return this.utilService.getDate(date);
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
    this.loader.stopLoading();
  }

  loadNextOrders() {

  }
}
