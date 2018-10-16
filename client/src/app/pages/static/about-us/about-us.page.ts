import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '../../../base/base-component';
import { AlertService } from '@capillarytech/pwa-ui-helpers';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private alertService: AlertService
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('about_us_page.about_us').subscribe(value => {
      this.titleValue = value;
    });
  }

  ionViewWillEnter() {
    this.closeToast();
  }

  async closeToast() {
    await this.alertService.closeToast();;
  }

}
