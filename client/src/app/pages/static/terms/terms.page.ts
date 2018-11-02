import { Component } from '@angular/core';
import { CapRouterService, TranslateService, SeoInfo } from '@capillarytech/pwa-framework';
import {BaseComponent} from "@capillarytech/pwa-components";
import { ArabicTermsPageText, EnglishTermsPageText } from '@assets/i18n/terms.text';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage extends BaseComponent {
  seoInfo: SeoInfo;
  activeAccordion: number = null;

  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super();
    this.seoInfo = this.configService.getConfig()['seo']['termsAndConditions'];
  }

  async ionViewWillEnter() {
    this.addPageTagsViaSeoInfo(this.seoInfo[this.getCurrentLanguageCode()]);
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      {language: 'en', text: EnglishTermsPageText},
      {language: 'ar', text: ArabicTermsPageText}
    ]);
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
