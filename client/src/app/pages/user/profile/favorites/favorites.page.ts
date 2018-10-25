import { Component, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  ConfigService,
} from '@capillarytech/pwa-framework';
import { ProductType } from '@cap-widget/product-modules';
import { TranslateService } from '@ngx-translate/core';
import { ProductDetailsComponent } from '../../../../components/product-details/product-details.component';
import { PizzaComponent } from '../../../../components/pizza/pizza.component';
import { ModalController } from '@ionic/angular';
import { FavoritesComponent } from '@capillarytech/pwa-components/favorites/favorites.component';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  encapsulation: ViewEncapsulation.None
})

@pwaLifeCycle()
@pageView()
export class FavoritesPage extends FavoritesComponent {

  currencyCode: string;
  constructor(
    private translate: TranslateService,
    private capRouter: CapRouterService,
    private config: ConfigService,
    private modalController: ModalController,
    private alertService: AlertService
  ) {
    super();
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

  // TODO : create a helper in app only
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

  async handleWidgetActionRemoveItemFailed(data) {
    console.error('remove failed', data);
    await this.alertService.presentToast(this.translate.instant('favorites_page.failed_to_unfavorite'), 1000, 'top');
  }

  async handleFavoritesLoadingFailed(data) {
    console.log('favorites widget loading failed');
    await this.alertService.presentToast(this.translate.instant('favorites_page.favorites_loading_failed'), 1000, 'top');
  }

}
