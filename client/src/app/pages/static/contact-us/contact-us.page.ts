import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(
    private translate: TranslateService,
    private utilService: UtilService
  ) {
    this.translate.use(this.utilService.getLanguageCode());
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('contact_page.contact_us').subscribe(value => {
      this.titleValue = value;
    });
  }

}
