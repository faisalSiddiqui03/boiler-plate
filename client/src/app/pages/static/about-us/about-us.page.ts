import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@capillarytech/pwa-components/base-component';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
  ) {
    super();
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('about_us_page.about_us').subscribe(value => {
      this.titleValue = value;
    });
  }

}
