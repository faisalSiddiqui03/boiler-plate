import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  titleValue = '';
  activeAccordion:number = null;

  ngOnInit() {
    this.translate.get('privacy_page.privacy_policy').subscribe(value => {
      this.titleValue = value;
    });
  }

  openAccordion(acc){
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

}
