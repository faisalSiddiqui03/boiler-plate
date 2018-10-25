import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  titleValue = '';
  activeAccordion: number = null;

  ngOnInit() {
    this.translate.get('terms_page.terms_conditions').subscribe(value => {
      this.titleValue = value;
    });
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

}
