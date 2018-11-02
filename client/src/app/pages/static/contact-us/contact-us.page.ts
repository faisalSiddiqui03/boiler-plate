import { Component } from '@angular/core';
import { SeoInfo } from '@capillarytech/pwa-framework';
import { SeoComponent } from "@capillarytech/pwa-components";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage extends SeoComponent {
  seoInfo: SeoInfo;
  constructor() {
    super({ pageKey: 'contactUs' });
  }
}
