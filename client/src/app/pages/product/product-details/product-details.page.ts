import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { TranslateService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

export class ProductDetailsPage extends BaseComponent implements OnInit {
  productId: number;
  categoryId: string;
  productName: string;

  constructor(private route: ActivatedRoute,
    private translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.translate.use(this.getCurrentLanguageCode());

    this.categoryId = this.route.snapshot.params.categoryId;
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }
}
