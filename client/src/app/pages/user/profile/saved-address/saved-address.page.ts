import { Component, ViewEncapsulation } from '@angular/core';
import {
  pwaLifeCycle,
  pageView,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { SavedAddressComponent } from '@capillarytech/pwa-components/saved-address/saved-address.component';

@Component({
  selector: 'app-saved-address',
  templateUrl: './saved-address.page.html',
  styleUrls: ['./saved-address.page.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class SavedAddressPage extends SavedAddressComponent {

  toggleDeleteModal = false;
  addressToBeDeleted: '';

  constructor(
    private alertService: AlertService,
    private translate: TranslateService,
    private capRouter: CapRouterService,
  ) {
    super();
  }

  getFlatAddress(address, index = 0) {
      const storeConfig = this.configService.getConfig()['address'];
      const sep = storeConfig.storeSep;
      const addresses = address.split(sep);
      return addresses[index] ? addresses[index] : address.split(',')[index];
  }

  triggerDeleteAddress(address) {
    this.addressToBeDeleted = address.id;
    this.toggleDeleteModal = !this.toggleDeleteModal;
  }

  goToPage(pageName, params = null) {
    if (params || params === 0) {
      const route = pageName + '/' + params;
      this.capRouter.routeByUrl(route);
      return;
    }
    this.capRouter.routeByUrl(pageName);
  }

  dismissAddressModal(isTrue) {
    if (isTrue && this.addressToBeDeleted) {
      this.deleteAddress(this.addressToBeDeleted);
    }
    this.toggleDeleteModal = !this.toggleDeleteModal;
  }

  async handleWidgetActionDeleteAddressFailed(data) {
    const error_deleting_address = await this.translate.instant('saved_address_page.error_deleting_address');
    await this.alertService.presentToast(error_deleting_address, 3000, 'bottom');
  }

  async handleWidgetActionDeleteAddressSuccess(data) {
    const coupon_error = await this.translate.instant('saved_address_page.successfully_deleted_address');
    await this.alertService.presentToast(coupon_error, 3000, 'bottom');
    console.log('successfully deleted the address');
    this.refreshAddresses();
  }

  ionViewDidEnter() {
    this.refreshAddresses();
  }

  handleUserAddressLoadingFailed(data) {
    console.log('User Address widget loading failed');
  }

  handleWidgetActionRefreshFailed(data) {
    console.log('User Address widget Refresh action loading failed');
  }
}
