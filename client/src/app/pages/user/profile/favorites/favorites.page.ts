import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  FavoritesWidgetActions,
  CapRouterService,
  ConfigService,
  ProductType
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { ProductDetailsComponent } from '../../../../components/product-details/product-details.component';
import { PizzaComponent } from '../../../../components/pizza/pizza.component';
import { ModalController } from '@ionic/angular';

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
  currencyCode: string;
  favoriteInProgress = new Map();

  constructor(
    private translate: TranslateService,
    private capRouter: CapRouterService,
    private config: ConfigService,
    private modalController: ModalController
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  ngOnInit() {
    this.translate.get('favorites_page.my_favorites').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.getNavigationUrlWithLangSupport(pageName));
  }

  getProductImageUrl(product) {
    if (!product.multipleImages || !(product.multipleImages.length > 0)) {
      return this.getUrl(product.image);
    } else {
      let lastItem = product.multipleImages.slice().pop();
      if (!lastItem.image) {
        return this.getUrl(product.image);
      }
      return this.getUrl(lastItem.image);
    }
  }

  getUrl(url: string) {
    return `https://${url}`;
  }

  removeFavorite(product) {
    this.favoriteInProgress.set(product.id, true);
    this.favoritesWidgetAction.emit(new Action(FavoritesWidgetActions.ACTION_REMOVE_ITEM, product));
  }

  async openProduct(product) {
    let component;
    switch (product.type) {
      case ProductType.Product:
        component = ProductDetailsComponent
        break;
      case ProductType.Bundle:
        component = PizzaComponent;
        break;
    }

    const modal = await this.modalController.create({
      component: component,
      componentProps: {
        productId: product.id,
        fromFavorites: true,
      }
    });

    await modal.present();
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('name action failed: ' + name + ' data: ' + data);
    switch (name) {
      case FavoritesWidgetActions.ACTION_REMOVE_ITEM:
        console.error('remove failed', data);
        console.log('error removing item');
        this.favoriteInProgress.delete(data.product.id);
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('name action success: ' + name + ' data: ' + data);
    switch (name) {
      case FavoritesWidgetActions.ACTION_REMOVE_ITEM:
        console.error('remove success', data);
        this.favoriteInProgress.delete(data.product.id);
        console.log('successfully removed item');
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log('Favorites data', data)
  }

}
