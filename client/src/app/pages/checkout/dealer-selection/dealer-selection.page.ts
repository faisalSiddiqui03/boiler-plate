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

  asSoonPossible:boolean = false;
  constructor( private loaderService: LoaderService, private alertService: AlertService, private translate: TranslateService) {
    super();

    // this.loaderService.startLoading();

    this.translate.use(Utils.getLanguageCode());
  }
  
  ngOnInit() {
  }

  toggleCheckbox(){
    this.asSoonPossible = !this.asSoonPossible;
  }

}
