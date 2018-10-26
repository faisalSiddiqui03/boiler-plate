import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { pwaLifeCycle } from '@capillarytech/pwa-framework';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PizzaComponent } from '../pizza/pizza.component';

import { DealBuilderShowcaseComponent } from '@capillarytech/pwa-components/deal-builder-showcase/deal-builder-showcase.component';


@Component({
  selector: 'app-deal-showcase-component',
  templateUrl: './deal-showcase.component.html',
  styleUrls: ['../../pages/product/category-listing/category-listing.page.scss', './deal-showcase.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

@pwaLifeCycle()
export class DealShowcaseComponent extends DealBuilderShowcaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
  ) {
    super({
      restrictQuantityForCheckBoxGroup: true
    });
  }

  ngOnInit() {
    this.setDefaults();
    this.translate.get('deal.choose_your').subscribe(value => {
      this.bundleGroupTitle = value + " " + this.bundleGroupTitle;
    });
  }

  handleAddProductToDealSuccess(productAdded) {
    this.modalController.dismiss(productAdded);
  }

  async showProduct(bundleItem) {

    if (!this.isCustomizable(bundleItem)) return;

    let modal;
    modal = await this.modalController.create({
      component: PizzaComponent,
      componentProps: {
        productId: bundleItem.productId,
        productFromDeal: bundleItem,
        toppingsEnabled: this.toppingsEnabled,
      }
    });

    modal.onDidDismiss().then((addedItem) => {
      this.updateItemSelection(bundleItem, addedItem);
    });

    return await modal.present();
  }

  closeModal() {
    this.modalController.dismiss(false);
  }
}
