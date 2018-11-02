import { Component } from '@angular/core';
import { CapRouterService, TranslateService } from '@capillarytech/pwa-framework';
import { SeoComponent } from "@capillarytech/pwa-components";
import { ArabicPrivacyPageText, EnglishPrivacyPageText } from '@assets/i18n/privacy.text';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage extends SeoComponent {
  activeAccordion: number = null;
  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super({ pageKey: 'privacyPolicy' });
  }

  ionViewWillEnter() {
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
