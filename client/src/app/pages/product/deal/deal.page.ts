import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import {
  pwaLifeCycle,
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-deal',
  templateUrl: './deal.page.html',
  styleUrls: ['./deal.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class DealPage extends BaseComponent implements OnInit {

  productId: number;
  productName: string;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private alertService: AlertService,
  ) {
    super();
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }

  ionViewWillEnter() {
    this.closeToast();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }

}
