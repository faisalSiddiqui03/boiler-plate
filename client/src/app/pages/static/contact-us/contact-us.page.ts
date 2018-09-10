import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(
    private translate: TranslateService
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  titleKey = 'contact_page.contact_us';
  titleValue = '';

  ngOnInit() {
    this.translate.get(this.titleKey).subscribe(value => {
      this.titleValue = value;
    });
  }

}
