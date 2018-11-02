import { Component } from '@angular/core';
import { TranslateService } from '@capillarytech/pwa-framework';
import { SeoComponent } from "@capillarytech/pwa-components";
import { ArabicAboutUsPageText, EnglishAboutUsPageText } from '@assets/i18n/aboutus.text';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage extends SeoComponent {
  constructor(private translate: TranslateService) {
    super({ pageKey: 'aboutUs' });
  }

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      { language: 'en', text: EnglishAboutUsPageText },
      { language: 'ar', text: ArabicAboutUsPageText }
    ]);
  }
}
