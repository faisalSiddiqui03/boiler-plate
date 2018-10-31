import { Component, OnInit, ViewEncapsulation, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import {
  pwaLifeCycle,
} from '@capillarytech/pwa-framework';

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
  ) {
    super();
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }
}
