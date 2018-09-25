import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
  LifeCycle,
  Action,
  pwaLifeCycle,
  WidgetNames,
  Product,
  BundleItem,
  ProductDetailsWidgetActions,
  OnWidgetLifecyle,
  OnWidgetActionsLifecyle,
  ConfigService,
} from '@capillarytech/pwa-framework';
import {   
  IncrementValidator,
  DecrementValidator,
  AttributeName,
  AttributeValue,
} from '../../../helpers/validators/index';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.page.html',
  styleUrls: ['./pizza.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
export class PizzaPage extends BaseComponent implements OnInit {

  productId: number;
  productName: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    private loaderService: LoaderService,
  ) {
    super();
    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }

  ngOnInit() {

  }
}
