import {Component, OnInit} from '@angular/core';
import {
  pwaLifeCycle,
  pageView
} from '@capillarytech/pwa-framework';
import {Utils} from '@capillarytech/pwa-components/util/utils';
import {ActivatedRoute} from '@angular/router';
import {LoaderService, AlertService} from '@capillarytech/pwa-ui-helpers';
import {TranslateService} from '@capillarytech/pwa-framework';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AddEditAddressComponent} from '@capillarytech/pwa-components/add-edit-address/add-edit-address.component';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class AddAddressPage extends AddEditAddressComponent implements OnInit {

  addAddressForm: FormGroup;
  addressId: Number;
  addressModel;
  addressTypes = [];
  newLatLngDetails = {
    latitude: '0',
    longitude: '0'
  };

  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute
  ) {
    super();

    this.addAddressForm = this.formBuilder.group({
      addressDetails: ['', Validators.compose([Validators.required])],
      landMark: [''],
      addressType: ['']
    });
  }

  ngOnInit() {
    this.addressId = parseInt(this.actRoute.snapshot.params['addressId'], 10);
    this.addressTypes = Utils.getAddressTypes();
  }

  async handleWidgetActionSaveAddressFailed(data) {
    this.loaderService.stopLoading();
    const failedMsg = await this.translate.instant('add-address.failed_to_save');
    await this.alertService.presentToast(failedMsg, 1000, 'top');
  }

  async handleWidgetActionUpdateAddressFailed(data) {
    this.loaderService.stopLoading();
    const failedMsg = await this.translate.instant('add-address.failed_to_update');
    await this.alertService.presentToast(failedMsg, 1000, 'top');
  }

  handleWidgetActionUpdateAddressSuccess(data) {
    this.loaderService.stopLoading();
    this.goBack();
  }

  handleWidgetActionSaveAddressSuccess(data) {
    this.loaderService.stopLoading();
    this.goBack();
  }

  async handleSingleUserAddressLoadingFailed(data) {
    const failedMsg = await this.translate.instant('add-address.failed_to_load_address');
    await this.alertService.presentToast(failedMsg, 1000, 'top');
  }

  async handleSingleUserAddressLoadingSuccess(data) {
    if (data) {
      this.addAddressForm.setValue({
        addressDetails: data.detail || '',
        landMark: data.landmark || '',
        addressType: data.addressType ? data.addressType.toLowerCase() : ''
      });
      this.addressModel = data;
      if (data.locationDetail.latitude && data.locationDetail.longitude) {
        this.newLatLngDetails = data.locationDetail;
      } else {
        const store = await this.getCurrentStoreAsync();
        this.newLatLngDetails = store.locationDetail;
      }
    }
  }

  async saveAddress(addressForm, type) {
    this.addressModel.locationDetail = this.newLatLngDetails;
    this.addressModel.detail = addressForm.value.addressDetails;
    this.addressModel.landmark = addressForm.value.landMark;
    this.addressModel.addressType = addressForm.value.addressType;

    if (type === 'save') {
      await this.loaderService.startLoading();
      this.addNewAddress(this.addressModel);
    } else if (type === 'update') {
      await this.loaderService.startLoading();
      this.editAddress(this.addressModel);
    }
  }

  updateLatLongDetails(event) {
    this.newLatLngDetails.latitude = event.latitude;
    this.newLatLngDetails.longitude = event.longitude;
  }

  handleWidgetActionDeleteAddressFailed(data) {
  }

  handleWidgetActionDeleteAddressSuccess(data) {
  }
}
