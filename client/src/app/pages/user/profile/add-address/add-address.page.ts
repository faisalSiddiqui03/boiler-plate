import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import {
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
  UserAddressWidgetActions
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
  addressId;
  singleUserAddressWidgetActions = new EventEmitter();

  constructor(private router: Router,
    private utilService: UtilService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private actRoute: ActivatedRoute
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
    this.addressId = this.actRoute.snapshot.params['addressId'];

    this.translate.get('add_address_page.add_address').subscribe(value => {
      this.titleValue = value;
    });
  }


  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
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
        break;
    }
  }

}
