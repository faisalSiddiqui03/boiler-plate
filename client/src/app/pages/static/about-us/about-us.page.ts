import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  constructor(
    private translate: TranslateService
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

}
