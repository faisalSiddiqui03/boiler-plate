import { Component } from '@angular/core';
import { CapRouterService, TranslateService, SeoInfo } from '@capillarytech/pwa-framework';
import { BaseComponent } from "@capillarytech/pwa-components";
import { ArabicNutritionPageText, EnglishNutritionPageText } from '@assets/i18n/nutrition.text';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage extends BaseComponent {
  seoInfo: SeoInfo;
  constructor(
    private capRouter: CapRouterService,
    private translate: TranslateService
  ) {
    super();
    this.seoInfo = this.configService.getConfig()['seo']['nutrition'];
  }

  activeAccordion: number = null;

  async ionViewWillEnter() {
    this.addPageTagsViaSeoInfo(this.seoInfo[this.getCurrentLanguageCode()]);
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
