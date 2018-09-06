import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { pwaLifeCycle, pageView, Action, DeliverySlotsWidget } from '@capillarytech/pwa-framework';
=======
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
>>>>>>> cadc1a8dca0517f68e8090b48b5e697369f2ef62
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

<<<<<<< HEAD
  asSoonPossible: boolean = true;
  slotSelected: boolean = false;
  slotContent: string = "";
  activeTimeSlot : number;
  data = ['10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'];
  constructor(private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
=======
  asSoonPossible:boolean = false;
  constructor( private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
>>>>>>> cadc1a8dca0517f68e8090b48b5e697369f2ef62
    super();

    // this.loaderService.startLoading();

<<<<<<< HEAD
    this.slotSelected = this.asSoonPossible;
    this.slotContent = this.asSoonPossible ? "ASAP" : "";
    this.activeTimeSlot = this.asSoonPossible ? 0 : null;

    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  toggleCheckbox() {
    this.asSoonPossible = !this.asSoonPossible;
    this.slotSelected = this.asSoonPossible;
    this.slotContent = this.asSoonPossible ? "ASAP" : "";
    this.activeTimeSlot = this.asSoonPossible ? 0 : null;
  }

  selectTime(time, index){
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
=======
    this.translate.use(Utils.getLanguageCode());
  }
  
  ngOnInit() {
  }

  toggleCheckbox(){
    this.asSoonPossible = !this.asSoonPossible;
>>>>>>> cadc1a8dca0517f68e8090b48b5e697369f2ef62
  }

}
