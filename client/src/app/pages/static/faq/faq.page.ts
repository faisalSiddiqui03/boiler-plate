import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage extends BaseComponent implements OnInit {

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
    this.translate.get('faq_page.faq').subscribe(value => {
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
