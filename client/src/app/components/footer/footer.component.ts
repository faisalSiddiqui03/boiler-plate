import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Utils } from '../../helpers/utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

  navigatePage(page) {
    this.router.navigateByUrl(page);
  }

}
