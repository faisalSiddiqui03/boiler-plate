import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  constructor(
    private translate: TranslateService,
    private utilService: UtilService
  ) {
    this.translate.use(this.utilService.getLanguageCode());
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('about_us_page.about_us').subscribe(value => {
      this.titleValue = value;
    });
  }

}
