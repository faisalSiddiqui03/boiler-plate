import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BasePage } from '../../base/base-page';
import { Utils } from '../../helpers/utils';
import {pwaLifeCycle} from "@cap-core/lifecycle";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
@pwaLifeCycle()
export class FooterComponent extends BasePage implements OnInit {

  categoryArray = Array(5);
  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    super();
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  navigatePage(page) {
    this.router.navigateByUrl(page);
  }

  navigateToCategory(navigationItem) {
    console.log(navigationItem);
  }
}
