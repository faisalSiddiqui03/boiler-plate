import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import { pwaLifeCycle, pageView, OnWidgetActionsLifecyle, OnWidgetLifecyle } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()

export class FavoritesPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  titleValue = '';

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
    this.translate.get('favorites_page.my_favorites').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  getProductImageUrl(product) {
    if (product && product.multipleImages && product.multipleImages.length) {
      return `https://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
    } else if (product && product.largeImage) {
      return `https:${product.largeImage}`;
    }
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name: string, data: any): any {
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('-------', data)
  }

}
