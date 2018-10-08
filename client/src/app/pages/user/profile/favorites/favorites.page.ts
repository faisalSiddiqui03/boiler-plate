import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  FavoritesWidgetActions,
  FavoritesWidget
} from '@capillarytech/pwa-framework';
import { UtilService } from '../../../../helpers/utils';
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
  favoritesWidgetAction = new EventEmitter();

  constructor(private router: Router,
    private utilService: UtilService,
    private loaderService: LoaderService,
    private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.translate.get('favorites_page.my_favorites').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  getProductImageUrl(product) {
    if (product && product.multipleImages && product.multipleImages.length) {
      return `https://${product.multipleImages[product.multipleImages.length > 1 ? 1 : 0].largeImage}`;
    } else if (product && product.largeImage) {
      return `https:${product.largeImage}`;
    }
  }

  updateFavorites(product) {
    this.favoritesWidgetAction.emit(new Action(FavoritesWidgetActions.ACTION_REMOVE_ITEM, product));
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
    switch (name) {
      case FavoritesWidgetActions.ACTION_REMOVE_ITEM:
        console.log('error removing item');
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case FavoritesWidgetActions.ACTION_REMOVE_ITEM:
        console.log('successfully removed item');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('-------', data)
  }

}
