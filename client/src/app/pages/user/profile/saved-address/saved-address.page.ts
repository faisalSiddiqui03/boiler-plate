import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
    Action,
    pwaLifeCycle,
    pageView,
    OnWidgetActionsLifecyle,
    OnWidgetLifecyle,
    UserAddressWidgetActions,
    ConfigService,
    CapRouterService
} from '@capillarytech/pwa-framework';
import { UtilService } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-saved-address',
    templateUrl: './saved-address.page.html',
    styleUrls: ['./saved-address.page.scss'],
    encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class SavedAddressPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

    titleValue = '';
    toggleDeleteModal = false;
    addressToBeDeleted: '';
    userAddressWidgetActions = new EventEmitter();

    constructor(private router: Router,
        private utilService: UtilService,
        private loaderService: LoaderService, private alertService: AlertService,
        private translate: TranslateService, private config: ConfigService,
        private capRouter: CapRouterService) {
        super();

        this.translate.use(this.getCurrentLanguageCode());
    }

    ngOnInit() {
        this.translate.get('saved_address_page.saved_address').subscribe(value => {
            this.titleValue = value;
        });
    }


    getFlatAddress(address, index = 0) {

        const storeConfig = this.config.getConfig()['address'];
        const sep = storeConfig.storeSep;

        const addresses = address.split(sep);

        return addresses[index] ? addresses[index] : address.split(',')[index];
    }

    deleteAddress(address) {
        this.addressToBeDeleted = address.id;
        this.toggleDeleteModal = !this.toggleDeleteModal;
    }

    goToPage(pageName, params = null) {
        if (params || params === 0) {
            const route = pageName + '/' + params;
            this.capRouter.routeByUrlWithLanguage(route);
            return;
        }
        this.capRouter.routeByUrlWithLanguage(pageName);
    }

    dismissAddressModal(isTrue) {
        if (isTrue && this.addressToBeDeleted) {
            const action = new Action(UserAddressWidgetActions.DELETE, [this.addressToBeDeleted]);
            this.userAddressWidgetActions.emit(action);
        }
        this.toggleDeleteModal = !this.toggleDeleteModal;
    }

    async widgetActionFailed(name: string, data: any) {
        console.log(name, 'Action Failed');
        switch (name) {
            case UserAddressWidgetActions.DELETE:
                const coupon_error = await this.translate.instant('saved_address_page.error_deleting_address');
                this.alertService.presentToast(coupon_error, 3000, 'bottom');
                console.log('failed to delete the address');
                break;
        }
    }

    async widgetActionSuccess(name: string, data: any) {
        console.log(name, 'Action Success');
        switch (name) {
            case UserAddressWidgetActions.DELETE:
                const coupon_error = await this.translate.instant('saved_address_page.successfully_deleted_address');
                this.alertService.presentToast(coupon_error, 3000, 'bottom');
                console.log('successfully deleted the address');
                const action = new Action(UserAddressWidgetActions.REFRESH, []);
                this.userAddressWidgetActions.emit(action);
                break;
        }
    }

    ionViewDidEnter() {
        const action = new Action(UserAddressWidgetActions.REFRESH, []);
        this.userAddressWidgetActions.emit(action);
    }

    widgetLoadingFailed(name: string, data: any): any {}

    widgetLoadingStarted(name: string, data: any): any {}

    widgetLoadingSuccess(name: string, data: any): any {}
}
