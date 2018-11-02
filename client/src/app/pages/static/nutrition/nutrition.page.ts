import { Component } from '@angular/core';
import { CapRouterService, TranslateService } from '@capillarytech/pwa-framework';
import { SeoComponent } from "@capillarytech/pwa-components";
import { ArabicNutritionPageText, EnglishNutritionPageText } from '@assets/i18n/nutrition.text';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage extends SeoComponent {
  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super({ pageKey: 'nutrition' });
  }

  activeAccordion: number = null;

  async ionViewWillEnter() {
    this.translate.use(this.getCurrentLanguageCode());
    this.translate.append([
      { language: 'en', text: EnglishNutritionPageText },
      { language: 'ar', text: ArabicNutritionPageText }
    ]);
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
