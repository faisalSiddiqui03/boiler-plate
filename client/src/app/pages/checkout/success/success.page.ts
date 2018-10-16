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
  showEmailPopup = false;
  inputEmail = '';
  isLoadingFailed = false;

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());
    this.isLoadingFailed = false;
    this.orderId = this.route.snapshot.params.orderId;
    const emailInput = this.route.snapshot.params.email;
    if (emailInput) {
      this.email = atob(this.route.snapshot.params.email);
    } else {
      this.showEmailPopup = true;
    }
  }

  getOrderUsingEmail() {
    this.showEmailPopup = false;
    this.email = this.inputEmail;
    this.router.navigateByUrl(
      this.getNavigationUrlWithLangSupport(
        'success/' + this.orderId + '/' + btoa(this.email)
    ));
  }

  goToPage(pageName) {
    if (pageName === 'product') {
      this.capRouter.routeByUrlWithLanguage('/products?category=deals&id=CU00215646');
    }
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
    this.isLoadingFailed = true;
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
    this.isLoadingFailed = false;
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  getDate(date) {
    return this.utilService.getDate(date);
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
  }

  loadNextOrders() {

  }
}
