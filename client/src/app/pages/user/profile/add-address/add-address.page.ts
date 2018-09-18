import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import { pwaLifeCycle, pageView, OnWidgetActionsLifecyle, OnWidgetLifecyle, UserAddressWidgetActions } from '@capillarytech/pwa-framework';
import { Utils } from '../../../../helpers/utils';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AgmCoreModule, MouseEvent } from '@agm/core';
import { ModalController } from '@ionic/angular';
import { SeacrhLocationPage } from '../seacrh-location/seacrh-location.page';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class AddAddressPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  // google maps zoom level
  private zoom = 8;
  private marker: Marker;

  titleValue: string = '';
  addAddressForm: FormGroup;

  constructor(private router: Router, private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService, private formBuilder: FormBuilder, private modalController: ModalController) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());

    this.addAddressForm = this.formBuilder.group({
      addressDetails: ['', Validators.compose([Validators.required])],
      landMark: [''],
      addressType: ['']
    });
  }

  ngOnInit() {
    this.translate.get('add_address_page.add_address').subscribe(value => {
      this.titleValue = value;
    });
    setTimeout(() => {
      this.marker = {
        lat: this.getCurrentStore().locationDetail.latitude,
        lng: this.getCurrentStore().locationDetail.longitude,
        label: ' ',
        draggable: true
      };
      console.log(this.getCurrentStore());
    }, 500);
  }

  markerDragEnd(m: Marker, $event: MouseEvent) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.updateLocationAddress();
  }

  updateLocationAddress() {
    console.log(this.marker);
    console.log('update location');
  }

  locateMe() {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.marker.lng = +pos.coords.longitude;
        this.marker.lat = +pos.coords.latitude;
      });
    }
  }

  confirmLocation() {
    console.log('select location and proceed');
  }

  async openLocationModal(){
    const modal = await this.modalController.create({
      component: SeacrhLocationPage
    });
    return await modal.present();
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
  }

}




// Interface for type safety.
interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

