import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
import { UtilService } from '../../helpers/utils';
import { pwaLifeCycle } from "@cap-core/lifecycle";
import { CapRouterService } from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
export class FooterComponent extends BaseComponent implements OnInit {

  categoryArray = Array(5);

  constructor(
    private translate: TranslateService,
    private utilService: UtilService,
    private router: Router,
    private capRouter: CapRouterService,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  navigatePage(page) {
    this.capRouter.routeByUrlWithLanguage(page);
    //this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(page));
  }

  navigateToCategory(item) {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=' + item.name + '&id=' + item.categoryId));
  }
}
