import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  ConfigService,
  ProductType
} from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { ProductDetailsComponent } from '../../../../components/product-details/product-details.component';
import { PizzaComponent } from '../../../../components/pizza/pizza.component';
import { ModalController } from '@ionic/angular';
import { FavoritesComponent } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class FavoritesPage extends FavoritesComponent implements OnInit {

  titleValue = '';
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

  removeProductFromFavorites(product) {
    this.favoriteInProgress.set(product.id, true);
    this.removeFavorite(product);
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
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

  handleWidgetActionRemoveItemFailed(data) {
    this.favoriteInProgress.delete(data.product.id);
    console.error('remove failed', data);
    console.log('error removing item');
  }

  handleWidgetActionRemoveItemSuccess(data) {
    this.favoriteInProgress.delete(data.product.id);
    console.error('remove success', data);
    console.log('successfully removed item');
  }

  handleFavoritesLoadingFailed(data) {
    console.log('favorites widget loading failed');
  }

}
