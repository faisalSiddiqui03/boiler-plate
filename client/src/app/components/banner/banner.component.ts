import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { pwaLifeCycle, LifeCycle, WidgetNames, CapRouterService } from "@capillarytech/pwa-framework";
import { Router } from '@angular/router';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../helpers/utils';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

@pwaLifeCycle()
export class BannerComponent extends BaseComponent implements OnInit {
  loaded = false;
  bundleWidgetAction = new EventEmitter();
  bundleWidgetExecutor = new EventEmitter();

  @Input('type')
  type: string;

  @Input('value')
  value: string;

  @Input('isPager')
  isPager: boolean = true;

  @Input('bannerClass')
  bannerClass: string = "";

  bannerRefCode: string;
  bannerUrl: string;
  sizeConfig: Array<any> = [];
  //  = [{ height: 200, width: 400, type: 'mobile' }, { height: 400, width: 1200, type: 'desktop' }];
  constructor(
    private router: Router,
    private utilService: UtilService,
    private translate: TranslateService,
    private capRouter: CapRouterService
  ) {
    super();
    this.bannerRefCode = this.configService.getConfig()['footerBannerRefCode'];
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  widgetLoadingSuccess(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.BANNER:
        this.loaded = true;
        console.log('banner widget model', model);
        break;
    }
  }

  widgetLoadingFailed(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.BANNER:
        this.loaded = true;
        break;
    }
  }

  onBannerClicked(banner) {
    console.log(banner);
    switch (banner.targetType) {
      case 'Category':
        this.capRouter.routeByUrl('/products?category=banner&id=' + banner.targetId);
        // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=banner&id=' + banner.targetId));
        break;
      case 'URL':
        this.navigateToDeals();
        break;
    }
  }

  navigateToDeals() {
    // http://localhost:8100/en/products?category=deals&id=CU00215646
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport('/products?category=deals&id=CU00215646'));
  }

  getFullBannerUrl(src) {
    return src ? src + '?height=170&width=340&builder=freeimage' : null;
  }

  getBannerRefCodeWithLangCode(refCode: string) {
    return refCode + this.getCurrentLanguageCode();
  }

}
