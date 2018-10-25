import { Component } from '@angular/core';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage {

  constructor(
    private capRouter: CapRouterService,
  ) {}

  activeAccordion: number = null;
  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
