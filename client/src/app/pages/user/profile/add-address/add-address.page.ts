import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  UserAddressWidgetActions,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { UtilService } from '../../../../helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SearchLocationPage } from '../search-location/search-location.page';

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
  newLatLngDetails = {
    latitude: 0,
    longitude: 0
  };

  constructor(private router: Router,
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

    // this.loaderService.startLoading(null, this.getFulfilmentMode().mode === 'H' ? 'delivery-loader': 'pickup-loader');

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
  }


  async widgetActionFailed(name: string, data: any) {
    this.loaderService.stopLoading();
    console.log(name, 'Action Failed');
    switch (name) {
      case 'saveAddress':
        const failedMsg1 = await this.translate.instant('add-address.failed_to_save');
        this.alertService.presentToast(failedMsg1, 1000, 'top');
        console.log(name, 'error', data);
        break;
      case 'updateAddress':
        const failedMsg2 = await this.translate.instant('add-address.failed_to_update');
        this.alertService.presentToast(failedMsg2, 1000, 'top');
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
        this.capRouter.routeByUrlWithLanguage('saved-address');
        break;
      case 'updateAddress':
        console.log(name, data);
        this.capRouter.routeByUrlWithLanguage('saved-address');
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

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
    switch (name) {
      case 'singleUserAddress':
        this.addAddressForm.setValue({
          addressDetails: data.detail || '',
          landMark: data.landmark || '' ,
          addressType: data.addressType ? data.addressType.toLowerCase() : ''
        });
        this.addressModel = data;
        break;
    }
  }

  saveAddress(addressForm, type) {
    this.addressModel.locationDetail = this.newLatLngDetails;
    this.addressModel.detail = addressForm.value.addressDetails;
    this.addressModel.landmark = addressForm.value.landMark;
    this.addressModel.addressType = addressForm.value.addressType;
    if (type === 'save') {
      this.loaderService.startLoading();
      this.singleUserAddressWidgetActions.emit(
        new Action(UserAddressWidgetActions.SAVE, this.addressModel)
      );
    } else if (type === 'update') {
      this.loaderService.startLoading();
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
