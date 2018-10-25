import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage extends BaseComponent implements OnInit {

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
    this.translate.get('nutrition_page.nutrition').subscribe(value => {
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
