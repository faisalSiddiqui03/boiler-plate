import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaseComponent } from '../../base/base-component';
import { ConfigService, pwaLifeCycle, Action, DeliveryModes } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../helpers/utils';
import { StoreLocatorWidgetActions, OnWidgetLifecyle, OnWidgetActionsLifecyle, CapRouterService } from '@capillarytech/pwa-framework';
import { Location } from '@angular/common';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
})

@pwaLifeCycle()
export class StoreListComponent extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  @Input() cityId;
  @Input() latitude;
  @Input() longitude;
  storeLocatorWidgetAction = new EventEmitter();
  stores: Array<any>;
  titleValue = '';
  deliveryModes: any;
  @Input() isModal: false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
    private location: Location,
    private utilService: UtilService,
    private capRouter: CapRouterService,
    private modalController: ModalController,
  ) {
    super();
    this.deliveryModes = DeliveryModes;
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    if (!this.isModal) {
      this.route.queryParams.subscribe(params => {
        this.cityId = params.cityId;
        this.latitude = params.latitude;
        this.longitude = params.longitude;
        if (!this.cityId && !this.latitude && !this.longitude) {
          this.goToHome();
        }
      });
    }

    this.translate.get('store_selection_page.stores_selection').subscribe(value => {
      this.titleValue = value;
    });
  }

  ionViewDidEnter(){
    this.loaderService.stopLoading();
  }

  navigateToDeals() {
    if(this.isModal) {
      this.modalController.dismiss(true);
      return;
    }
    this.capRouter.routeByUrl('/products?category=desls&id=CU00215646');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log('failed name: ', name, ' data: ', data);
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log('started name: ', name, ' data: ', data);
  }

  async widgetLoadingSuccess(name: string, data: any) {
    console.log('success name: ', name, ' data: ', data);
    if (name === 'STORE_SELECTOR' && this.getDeliveryMode()) {
      if (this.cityId) {
        await this.getDeliveryModeAsync();
        const stores = this.storeLocatorWidgetAction.emit(new Action(
          StoreLocatorWidgetActions.FIND_BY_CITY, [this.cityId, this.getDeliveryMode()])
        );
      } else if (this.latitude && this.longitude) {
        const stores = this.storeLocatorWidgetAction.emit(new Action(
          StoreLocatorWidgetActions.FIND_BY_LOCATION, [this.latitude, this.longitude, this.getDeliveryMode()])
        );
      }
    }
  }

  widgetActionFailed(name: string, data: any): any {
    console.log('failed action name: ', name, ' data: ', data);
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log('success action name: ', name, ' data: ', data);
    switch (name) {
      case StoreLocatorWidgetActions.FIND_BY_CITY:
      case StoreLocatorWidgetActions.FIND_BY_LOCATION:
        if (!data || data.length === 0) {
          this.goToHome();
        }
        this.stores = this.filterTakeawayStores(data);
        break;
    }
  }

  filterTakeawayStores(storesList) {
    const stores = storesList.filter(store =>
      store.deliveryModes.includes(this.deliveryModes.PICKUP)
    );
    return stores;
  }

  selectStore(store) {
    if(store && store.id) {
      store.city.code = this.cityId;
    }

    this.setCurrentStore(store);
    this.navigateToDeals();
  }

  goToHome() {
    if(this.isModal) {
      this.modalController.dismiss(false);
      return;
    }
    this.capRouter.routeByUrl('/home');
  }

  getTime(store, time) {
    let storeTiming;
    if (time === 'onTime') {
      storeTiming = store.currentDateStoreTime.get(this.deliveryModes.PICKUP).onTime;
    } else if (time === 'offTime') {
      storeTiming = store.currentDateStoreTime.get(this.deliveryModes.PICKUP).offTime;
    }
    if(isNaN(storeTiming)){
      return '';
    }
    const min = storeTiming.getMinutes() < 10 ? '0' + storeTiming.getMinutes() : storeTiming.getMinutes();
    const hours = storeTiming.getHours() > 10 ? storeTiming.getHours() : '0' + storeTiming.getHours();
    const meridiem = storeTiming.getHours() < 12 ? 'AM' : 'PM';

    return hours + ':' + min + ' ' + meridiem;
  }

}
