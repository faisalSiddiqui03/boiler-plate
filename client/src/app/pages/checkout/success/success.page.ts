import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '@capillarytech/pwa-components/util/utils';
import {
  pwaLifeCycle,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { OrderDetailsComponent } from '@capillarytech/pwa-components/order-details/order-details.component';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class SuccessPage extends OrderDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private capRouter: CapRouterService,
    private translate: TranslateService,
    private alertService: AlertService
  ) {
    super();
  }

  orderId: number;
  email: string;
  showEmailPopup = false;
  inputEmail = '';
  isLoadingFailed = false;

  ngOnInit() {
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
    this.capRouter.routeByUrl('success/' + this.orderId + '/' + btoa(this.email));
  }

  goToPage(pageName) {
    if (pageName === 'product') {
      this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
    }
    this.capRouter.routeByUrl(pageName);
  }

  async handleOrderDetailsLoadingFailed(data) {
    const coupon_remove_success = await this.translate.instant('success_page.failed_to_load_order_details');
    await this.alertService.presentToast(coupon_remove_success, 3000, 'bottom');
  }

  getDate(date) {
    return Utils.getDate(date);
  }

}
