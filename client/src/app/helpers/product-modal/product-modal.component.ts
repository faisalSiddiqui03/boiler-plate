import { ModalController } from '@ionic/angular';
import { PizzaComponent } from '../../components/pizza/pizza.component';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { ProductType } from '@capillarytech/pwa-framework';
import { Injectable } from '@angular/core';

@Injectable()
export class ProductModalService {
    modal;
    constructor(
        private modalController: ModalController
    ){}

    async openProductModal(productType, props, cb = null) {
        let component;
        switch (productType) {
            case ProductType.Product:
                component = ProductDetailsComponent
                break;
            case ProductType.Bundle:
                component = PizzaComponent;
                break;
        }
        this.modal = await this.modalController.create({
            component: component,
            componentProps: props
        });
        this.modal.onDidDismiss((data) => {
            if (!cb) return;
            cb(data);
        });
        await this.modal.present();
    }

}