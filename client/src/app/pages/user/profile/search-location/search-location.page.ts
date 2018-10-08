import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../../../base/base-component';
import { pwaLifeCycle, pageView, OnWidgetActionsLifecyle, OnWidgetLifecyle, UserAddressWidgetActions, ConfigService } from '@capillarytech/pwa-framework';
import { UtilService } from '../../../../helpers/utils';
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

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private utilService: UtilService,
    private config: ConfigService,
    private modalController: ModalController) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  closeSearchModal() {
    this.modalController.dismiss();
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
