import { Component, OnInit } from '@angular/core';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage {

  activeAccordion: number = null;
  constructor(
    private capRouter: CapRouterService
  ) {}

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }
}
