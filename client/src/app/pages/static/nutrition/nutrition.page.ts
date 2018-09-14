import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  titleValue = '';
  activeAccordion:number = null;

  ngOnInit() {
    this.translate.get('nutrition_page.nutrition').subscribe(value => {
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
