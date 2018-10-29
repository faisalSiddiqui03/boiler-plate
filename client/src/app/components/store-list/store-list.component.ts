import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@cap-service/store';
import { Utils } from '@capillarytech/pwa-components';
import { AlertController, ModalController } from '@ionic/angular';
import { pwaLifeCycle } from '@capillarytech/pwa-framework';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { ActivatedRoute } from '@angular/router';
import { CapRouterService } from '@capillarytech/pwa-framework';
import { StoreSelectionComponent } from '@capillarytech/pwa-components/selection-component/store-selection';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-store-list',
    templateUrl: './store-list.component.html',
    styleUrls: ['./store-list.component.scss'],
})
@pwaLifeCycle()
export class StoreListComponent extends StoreSelectionComponent implements OnInit {

    @Input() cityId;
    @Input() latitude;
    @Input() longitude;
    @Input() isModal: false;

    stores = [];
    clearCartPromise = {
        resolve: null,
        reject: null
    };

    constructor(
        private route: ActivatedRoute,
        private loaderService: LoaderService,
        private capRouter: CapRouterService,
        private modalController: ModalController,
        private translate: TranslateService,
        private alertController: AlertController,
        private alertService: AlertService
    ) {
        super(capRouter);
    }

    ngOnInit() {

        if (!this.isModal) {

            this.route.queryParams.subscribe(params => {
                this.cityId = params.cityId;
                this.latitude = params.latitude;
                this.longitude = params.longitude;
                if (!this.cityId && (!this.latitude || !this.longitude) ) {
                    this.goToHome();
                }
            });

            return;
        }

        if (!this.cityId && (!this.latitude || !this.longitude) ) {
            this.goToHome();
        }
    }

    getTime(store, time) {
        return Utils.getTimeDelSlotTime(store, time, this.deliveryModes);
    }

    handleStoreLocatorWidgetLoadingSuccess() {

        if(this.cityId) {

            this.findStoresByCity({"code":this.cityId, "name": this.cityId});
            return;
        }

        this.findStoresByLocation({"latitude":this.latitude, "longitude":this.longitude});
    }

    dismissRemoveItemPopup(store) {

        console.log('dismissed the pop up');
    }

    async removeCartItem(store) {

        this.clearCart();
        await this.loaderService.startLoadingByMode('', this.getDeliveryMode());
        const promise = new Promise((resolve, reject) => {

            this.clearCartPromise.resolve = resolve;
            this.clearCartPromise.reject = reject;
        }).then(() => {

            if ( store !== null ) {
                this.setStoreAndRedirect(store);
                return;
            }

            // toggling mode
            this.loaderService.stopLoading();
        }).catch( error => {

            // this should show cart could not be cleared
        });
    }

    selectStore(store) {
        if (!this.isEmptyCart() && store.id != this.getCurrentStore().id) {
            this.presentAlert(store);
            return;
        }

        this.setStoreAndRedirect(store);
    }

    setStoreAndRedirect(store) {

        this.setCurrentStore(store);
        this.navigateToDeals();
    }

    async presentAlert(store) {

        const cartConfirm = await this.translate.instant('cart.confirm');
        const cartDismiss = await this.translate.instant('cart.dismiss');
        const confirmRemove = await this.translate.instant('cart.confirm_remove');
        const alert = await this.alertController.create({
            message: confirmRemove,
            cssClass: 'alert-modal',
            buttons: [
                {
                    text: cartDismiss,
                    role: 'cancel',
                    cssClass: 'btn-dismiss',
                    handler: () => {
                        this.dismissRemoveItemPopup(store);
                    }
                }, {
                    text: cartConfirm,
                    cssClass: 'btn-success',
                    handler: () => {
                        this.dismissRemoveItemPopup(store);
                        this.removeCartItem(store);
                    }
                }
            ]
        });

        await alert.present();
    }

    navigateToDeals() {

        if (this.isModal) {

            this.modalController.dismiss(true);
            return;
        }

        this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
    }

    goToHome() {

        if(this.isModal) {

            this.modalController.dismiss(false);
            return;
        }

        this.capRouter.routeByUrl('/home');
    }

    filterStores(data: Array<Store>) {

        const stores = [];

        if ( !data ) {
            return [];
        }
        Array.from(data).forEach(store => {
            if (store.deliveryModes.includes(this.getDeliveryMode())) {
                stores.push(store);
            }
        });

        return stores;
    }


    async handleWidgetActionClearCartFailed(data: any) {

        const alert_text = await this.translate.instant('cart.item_removed_failure');
        await this.alertService.presentToast(alert_text, 30000, 'bottom');

        if (this.clearCartPromise.reject !== null) {
            this.clearCartPromise.reject();
        }
    }

    async handleWidgetActionClearCartSuccess(data: any) {

        const alert_text = await this.translate.instant('cart.item_removed');
        await this.alertService.presentToast(alert_text, 3000, 'bottom');

        if (this.clearCartPromise.resolve !== null) {
            this.clearCartPromise.resolve();
        }
    }

    async handleWidgetActionFindByCityFailed(data: any) {

        this.loaderService.stopLoading();
        const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
        await this.alertService.presentToast(store_alert, 3000, 'top');
    }

    handleWidgetActionFindByCitySuccess(fetchedStores: any) {

        const data = this.filterStores(fetchedStores);
        if (data && data.length) {

            // check if store has available takeaway store
            this.stores = data;
            return;
        }

        this.handleWidgetActionFindByCityFailed(data);
    }

    async handleWidgetActionFindByLocationFailed(data: any) {
        this.loaderService.stopLoading();
        const store_alert = await this.translate.instant('home_page.unable_to_get_stores');
        await this.alertService.presentToast(store_alert, 3000, 'top');
    }

    async handleWidgetActionFindByLocationSuccess(data: any) {
        const stores = this.filterStores(data);
        if (!stores || stores.length < 1) {
            await this.handleWidgetActionFindByLocationFailed(data);
            return;
        }

        this.stores = data;
    }

    handleAreaSelectionStarted(area: any): any {}
    handleCitySelectionStarted(city: any): any {}
    handleWidgetActionLocateMeFailed(data: any): any {}
    handleWidgetActionFindByAreaFailed(data: any): any {}
    handleWidgetActionFindByAreaSuccess(data: any): any {}
    handleWidgetActionFindAreasByCityFailed(data: any): any {}
    handleWidgetActionFindAreasByCitySuccess(data: any): any {}
}
