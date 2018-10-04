import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { pwaLifeCycle, LifeCycle, WidgetNames, ConfigService } from "@capillarytech/pwa-framework";
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
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

  bannerUrl: string;

  constructor(
    private router: Router,
    private config: ConfigService,
    private utilService: UtilService,
    private translate: TranslateService) {
    super();
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
    this.translate.use(this.utilService.getLanguageCode());
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
        this.router.navigateByUrl('/category/' + banner.targetId);
        break;
      case 'URL':
        this.navigateToDeals();
        break;
    }
  }

  navigateToDeals() {
    this.router.navigateByUrl('/products/listing/(0:0)?category=deals&id=CU00215646');
  }

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }

}
