import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { pwaLifeCycle, DeliveryModes } from '@capillarytech/pwa-framework';
import { AlertService, LoaderService } from '@capillarytech/pwa-ui-helpers';
import { ActivatedRoute } from '@angular/router';
import {
  OnWidgetLifecyle,
  OnWidgetActionsLifecyle,
  CapRouterService
} from '@capillarytech/pwa-framework';

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

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private alertService: AlertService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cityId = params.cityId;
      this.latitude = params.latitude;
      this.longitude = params.longitude;
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
