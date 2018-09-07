import { Component, OnInit } from '@angular/core';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { BasePage } from '../../../base/base-page';

@Component({
  selector: 'app-dealer-selection',
  templateUrl: './dealer-selection.page.html',
  styleUrls: ['./dealer-selection.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class DealerSelectionPage extends BasePage implements OnInit {

  asSoonPossible: boolean = true;
  slotSelected: boolean = false;
  slotContent: string = "";
  activeTimeSlot : number;
  constructor(private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading();
    this.slotSelected = this.asSoonPossible;
    this.slotContent = this.asSoonPossible ? "ASAP" : "";
    this.activeTimeSlot = this.asSoonPossible ? 0 : null;
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  // toggleCheckbox() {
  //   this.asSoonPossible = !this.asSoonPossible;
  //   this.slotSelected = this.asSoonPossible;
  //   this.slotContent = this.asSoonPossible ? "ASAP" : "";
  //   this.activeTimeSlot = this.asSoonPossible ? 0 : null;
  // }

  selectTime(time, index) {
    this.asSoonPossible = (time == 'ASAP') ? true : false;
    this.slotSelected = true;
    this.slotContent = time;
    this.activeTimeSlot = index;
  }

  widgetActionSuccess(name, data) {
    console.log('action success ' + name, data);
  }

  widgetLoadingSuccess(name, data) {
    console.log('loaded ' + name, data);
  }

  widgetLoadingFailed(name, data) {
    console.log('loading failed' + name, data);
  }

  widgetActionFailure(name, data) {
    console.log('action failed ' + name, data);
  }

}
