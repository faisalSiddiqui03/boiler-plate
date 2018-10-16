import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { CapRouterService } from '@capillarytech/pwa-framework';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private capRouter: CapRouterService,
    private alertService: AlertService
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
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.utilService.getLanguageCode() + '/' + pageName);
  }

  ionViewWillEnter() {
    this.closeToast();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }
}
