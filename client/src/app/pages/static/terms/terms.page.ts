import { Component } from '@angular/core';
import { CapRouterService, TranslateService } from '@capillarytech/pwa-framework';
import { SeoComponent } from "@capillarytech/pwa-components";
import { ArabicTermsPageText, EnglishTermsPageText } from '@assets/i18n/terms.text';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage extends SeoComponent {
  activeAccordion: number = null;

  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super({ pageKey: 'termsAndConditions' });
  }

  ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      { language: 'en', text: EnglishTermsPageText },
      { language: 'ar', text: ArabicTermsPageText }
    ]);
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
