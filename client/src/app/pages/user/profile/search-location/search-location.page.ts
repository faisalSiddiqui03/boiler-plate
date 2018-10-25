import { Component, OnInit, ViewEncapsulation, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import {
  Action,
  pwaLifeCycle,
  pageView,
  OnWidgetActionsLifecyle,
  OnWidgetLifecyle,
} from '@capillarytech/pwa-framework';
import { LocationWidget, LocationWidgetActions } from '@cap-widget/location';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
  encapsulation: ViewEncapsulation.None
})
@pwaLifeCycle()
@pageView()
export class SearchLocationPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {
  locationWidgetAction = new EventEmitter();
  showRecentSearches = false;
  enteredSearchValue = '';
  minSearchLength = 4;
  @ViewChild('focusInput') myInput;
  @ViewChild(LocationWidget) locationWidgetTemplate;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private modalController: ModalController) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    setTimeout(() => {
        this.myInput.setFocus();
    }, 800);
  }

  async searchAddress(event) {
    if (this.enteredSearchValue.length < this.minSearchLength) {
      const coupon_error = await this.translate.instant('search_location_page.min_charecters_not_passed');
      this.alertService.presentToast(coupon_error, 3000, 'bottom');
      return;
    } else {
      this.locationWidgetAction.emit(
        new Action(LocationWidgetActions.ACTION_FETCH_AREA_PREDICTIONS, this.enteredSearchValue)
      );
      return;
    }
  }

  fetchAddress(location) {
    if (!location || !location.placeId) {
      return;
    }
    this.loaderService.startLoading();
    this.locationWidgetAction.emit(
      new Action(LocationWidgetActions.ACTION_FETCH_PLACE_DETAILS, location.placeId)
    );
  }

  closeSearchModal() {
    this.modalController.dismiss(null);
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
    switch (name) {
      case LocationWidgetActions.ACTION_FETCH_AREA_PREDICTIONS:
        console.log('no predictions available');
        break;
    }
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
    switch (name) {
      case LocationWidgetActions.ACTION_FETCH_AREA_PREDICTIONS:
        console.log('got predictions');
        break;
      case LocationWidgetActions.ACTION_FETCH_PLACE_DETAILS:
        this.loaderService.stopLoading();
        this.extractLatLongFromModel(this.locationWidgetTemplate);
        break;
    }
  }

  extractLatLongFromModel(template) {
    if (!template.model.placeDetails.geometry) {
      console.log('unable to find place details');
      return null;
    }
    this.modalController.dismiss({
      formattedAddress: template.model.placeDetails.formattedAddress,
      latitude: template.model.placeDetails.geometry.location.lat,
      longitude: template.model.placeDetails.geometry.location.lng
    });
    return;
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
