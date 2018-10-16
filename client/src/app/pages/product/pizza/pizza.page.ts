import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PizzaPage extends BaseComponent implements OnInit {

  productId: number;
  productName: string;

  constructor(private route: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService) {
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
