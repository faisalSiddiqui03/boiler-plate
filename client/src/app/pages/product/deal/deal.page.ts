import { Component, OnInit, ViewEncapsulation, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import {
  pwaLifeCycle,
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';

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
  ) {
    super();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }
}
