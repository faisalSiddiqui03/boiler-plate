import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PizzaPage implements OnInit {

  productId: number;
  productName: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }

}
