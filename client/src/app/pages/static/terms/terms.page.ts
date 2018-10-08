import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage extends BaseComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private utilService: UtilService,
    private router: Router
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());
  }

  titleValue = '';
  activeAccordion: number = null;

  ngOnInit() {
    this.translate.get('terms_page.terms_conditions').subscribe(value => {
      this.titleValue = value;
    });
  }

  openAccordion(acc) {
    this.activeAccordion = acc;
  }

  goToPage(pageName) {
    this.router.navigateByUrl(this.utilService.getLanguageCode() + '/' + pageName);
  }

}
