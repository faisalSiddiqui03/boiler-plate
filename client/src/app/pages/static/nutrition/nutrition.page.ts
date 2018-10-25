import { Component } from '@angular/core';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage {

  constructor(
    private capRouter: CapRouterService
  ) {}

  activeAccordion: number = null;
  
  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
