import { Component, OnInit, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../base/base-component';
import { ConfigService, pwaLifeCycle, Action, DeliveryModes } from '@capillarytech/pwa-framework';
import { TranslateService } from '@ngx-translate/core';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../helpers/utils';
import {
  StoreLocatorWidgetActions,
  OnWidgetLifecyle,
  OnWidgetActionsLifecyle,
  CapRouterService
} from '@capillarytech/pwa-framework';
import { Location } from '@angular/common';

@Component({
  selector: 'app-store-selection',
  templateUrl: './store-selection.page.html',
  styleUrls: ['./store-selection.page.scss'],
})

@pwaLifeCycle()
export class StoreSelectionPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  cityId;
  latitude;
  longitude;
  titleValue = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cityId = params.cityId;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
    });
    this.translate.get('store_selection_page.stores_selection').subscribe(value => {
      this.titleValue = value;
    });
  }

  widgetActionFailed(name: string, data: any): any {
  }

  widgetActionSuccess(name: string, data: any): any {
  }

  widgetLoadingFailed(name: string, data: any): any {
  }

  widgetLoadingStarted(name: string, data: any): any {
  }

  widgetLoadingSuccess(name: string, data: any): any {
  }

}
