import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private utilService: UtilService
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('contact_page.contact_us').subscribe(value => {
      this.titleValue = value;
    });
  }

}
