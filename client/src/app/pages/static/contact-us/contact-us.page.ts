import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private alertService: AlertService
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

  ionViewWillEnter() {
    this.closeToast();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }


}
