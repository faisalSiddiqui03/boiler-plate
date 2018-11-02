import { Component } from '@angular/core';
import { SeoInfo } from '@capillarytech/pwa-framework';
import { BaseComponent } from "@capillarytech/pwa-components";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends BaseComponent {
  seoInfo: SeoInfo;
  constructor() {
    super();
    this.seoInfo = this.configService.getConfig()['seo']['contactUs'];
  }

  ionViewWillEnter() {
    this.addPageTagsViaSeoInfo(this.seoInfo[this.getCurrentLanguageCode()]);
  }
}
