import { Component } from '@angular/core';
import { CapRouterService, TranslateService, SeoInfo } from '@capillarytech/pwa-framework';
import { BaseComponent } from "@capillarytech/pwa-components";
import { ArabicPrivacyPageText, EnglishPrivacyPageText } from '@assets/i18n/privacy.text';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage extends BaseComponent {
  seoInfo: SeoInfo;
  activeAccordion: number = null;
  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super();
    this.seoInfo = this.configService.getConfig()['seo']['privacyPolicy'];
  }

  async ionViewWillEnter() {
    this.addPageTagsViaSeoInfo(this.seoInfo[this.getCurrentLanguageCode()]);
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      { language: 'en', text: EnglishPrivacyPageText },
      { language: 'ar', text: ArabicPrivacyPageText }
    ]);
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
