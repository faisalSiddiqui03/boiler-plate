import { Component } from '@angular/core';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage {

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
