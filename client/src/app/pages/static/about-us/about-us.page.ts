import { Component } from '@angular/core';
import { TranslateService } from '@capillarytech/pwa-framework';
import { BaseComponent } from "@capillarytech/pwa-components";
import { SeoInfo } from '@capillarytech/pwa-framework';
import { ArabicAboutUsPageText, EnglishAboutUsPageText } from '@assets/i18n/aboutus.text';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage extends BaseComponent {
  seoInfo: SeoInfo;
  constructor(private translate: TranslateService) {
    super();
    this.seoInfo = this.configService.getConfig()['seo']['aboutUs'];
  }

  async ionViewWillEnter() {
    this.addPageTagsViaSeoInfo(this.seoInfo[this.getCurrentLanguageCode()]);
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      { language: 'en', text: EnglishAboutUsPageText },
      { language: 'ar', text: ArabicAboutUsPageText }
    ]);
  }
}
