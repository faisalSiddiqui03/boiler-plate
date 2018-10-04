import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BaseComponent } from '../../../base/base-component';
import { UtilService } from '../../../helpers/utils';
import { TranslateService } from '@ngx-translate/core';

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
    private utilService: UtilService,
    private translate: TranslateService) {
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
