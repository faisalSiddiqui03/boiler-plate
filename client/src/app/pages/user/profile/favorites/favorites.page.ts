import { Component, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
  ConfigService,
} from '@capillarytech/pwa-framework';
import { ProductType } from '@cap-widget/product-modules';
import { TranslateService } from '@ngx-translate/core';
import { FavoritesComponent } from '@capillarytech/pwa-components';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { ProductModalService } from '../../../../helpers/product-modal/product-modal.component';

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
    private alertService: AlertService,
    private productModal: ProductModalService
  ) {
    super();
    this.currencyCode = this.config.getConfig()['currencyCode'];
  }

  goToPage(pageName) {
    this.capRouter.routeByUrl(pageName);
  }

  openProduct(product) {
    let componentProps = {
      productId: product.id,
      fromFavorites: true,
    };
    this.productModal.openProductModal(product.type, componentProps);
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
