import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

export class ProductDetailsPage extends BaseComponent implements OnInit {
  productId: number;
  categoryId: string;
  productName: string;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params.categoryId;
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }
}
