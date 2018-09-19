import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(
    private translate: TranslateService
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });
  }


}
