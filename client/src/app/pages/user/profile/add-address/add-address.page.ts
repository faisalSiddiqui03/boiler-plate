import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { UserAddressWidgetActions } from '@cap-widget/user-address';
import { UtilService } from '../../../../helpers/utils';
import { ActivatedRoute } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class AddAddressPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {


  titleValue = '';
  addAddressForm: FormGroup;
  addressId: Number;
  singleUserAddressWidgetActions = new EventEmitter();
  addressModel;
  addressTypes = [];
  newLatLngDetails = {
    latitude: '0',
    longitude: '0'
  };

  constructor(
    private utilService: UtilService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private capRouter: CapRouterService
  ) {
    super();

    this.translate.use(this.getCurrentLanguageCode());

    this.addAddressForm = this.formBuilder.group({
      addressDetails: ['', Validators.compose([Validators.required])],
      landMark: [''],
      addressType: ['']
    });
  }

  ngOnInit() {
    this.addressId = parseInt(this.actRoute.snapshot.params['addressId'], 10);

    this.translate.get('add_address_page.add_address').subscribe(value => {
      this.titleValue = value;
    });

    this.addressTypes = this.utilService.getAddressTypes();
  }


  async widgetActionFailed(name: string, data: any) {
    this.loaderService.stopLoading();
    console.log(name, 'Action Failed');
    switch (name) {
      case 'saveAddress':
        const failedMsg1 = await this.translate.instant('add-address.failed_to_save');
        await this.alertService.presentToast(failedMsg1, 1000, 'top');
        console.log(name, 'error', data);
        break;
      case 'updateAddress':
        const failedMsg2 = await this.translate.instant('add-address.failed_to_update');
        await this.alertService.presentToast(failedMsg2, 1000, 'top');
        console.log(name, 'error', data);
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    this.loaderService.stopLoading();
    console.log(name, 'Action Success');
    switch (name) {
      case 'saveAddress':
        console.log(name, data);
        this.capRouter.goBack();
        break;
      case 'updateAddress':
        console.log(name, data);
          this.capRouter.goBack();
        break;
    }
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
    switch (name) {
      case 'singleUserAddress':
        console.log(name, 'error', data);
        break;
    }
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  async widgetLoadingSuccess(name: string, data: any) {
    console.log(name, 'Loading Success');
    switch (name) {
      case 'singleUserAddress':
        this.addAddressForm.setValue({
          addressDetails: data.detail || '',
          landMark: data.landmark || '' ,
          addressType: data.addressType ? data.addressType.toLowerCase() : ''
        });
        this.addressModel = data;
        if (data.locationDetail.latitude && data.locationDetail.longitude) {
          this.newLatLngDetails = data.locationDetail;
        } else {
          const store = await this.getCurrentStoreAsync();
          this.newLatLngDetails = store.locationDetail;
        }
        break;
    }
  }

  async saveAddress(addressForm, type) {
    this.addressModel.locationDetail = this.newLatLngDetails;
    this.addressModel.detail = addressForm.value.addressDetails;
    this.addressModel.landmark = addressForm.value.landMark;
    this.addressModel.addressType = addressForm.value.addressType;
    if (type === 'save') {
      await this.loaderService.startLoading();
      this.singleUserAddressWidgetActions.emit(
        new Action(UserAddressWidgetActions.SAVE, this.addressModel)
      );
    } else if (type === 'update') {
      await this.loaderService.startLoading();
      this.singleUserAddressWidgetActions.emit(
        new Action(UserAddressWidgetActions.UPDATE, this.addressModel)
      );
    }
  }

  updateLatLongDetails(event) {
    this.newLatLngDetails.latitude = event.latitude;
    this.newLatLngDetails.longitude = event.longitude;
  }
}
