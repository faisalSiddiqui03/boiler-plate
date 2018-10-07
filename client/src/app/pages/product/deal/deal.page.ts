import { Component, OnInit, EventEmitter, ViewEncapsulation, ComponentRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import { Location } from '@angular/common';
import {
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  pwaLifeCycle,
  ProductDetailsWidgetActions,
  WidgetNames,
  ConfigService,
  BundleItem,
  Product,
  Action,
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { ModalController } from '@ionic/angular';
import { DealShowcaseComponent } from '../../../components/deal-showcase/deal-showcase.component'
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { ProductDetailsComponent } from '../../../components/product-details/product-details.component';
import { AttributeName, AttributeValue } from '../../../helpers/validators';
import { TrioComponent } from '../../../components/trio/trio.component';

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
    private router: Router,
    private location: Location,
    private translate: TranslateService,
    private config: ConfigService,
    private modalController: ModalController,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private utilService: UtilService
  ) {
    super();
  }

  ngOnInit() {
    const langCode = this.route.snapshot.params['lang'];
    this.utilService.setLanguageCode(langCode);
    this.translate.use(langCode);

    this.productId = this.route.snapshot.params.productId;
    this.productName = this.route.snapshot.params.productName;
  }
}
