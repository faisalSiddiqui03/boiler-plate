import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { pwaLifeCycle, LifeCycle, WidgetNames, ConfigService } from "@capillarytech/pwa-framework";
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

@pwaLifeCycle()
export class BannerComponent implements OnInit {
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
  slideOptions = {
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets'
    },
    speed: 500,
    initialSlide: 1
  };

  constructor(private router: Router, private config: ConfigService) {
    console.log("IA MA ", this.config.getConfig());
    this.bannerUrl = this.config.getConfig()['banner_base_url'];
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
        console.log("URL")
        break;
    }
  }

  getFullBannerUrl(src) {
    return src ? this.bannerUrl + src + '?height=170&width=340&builder=freeimage' : null;
  }

}
