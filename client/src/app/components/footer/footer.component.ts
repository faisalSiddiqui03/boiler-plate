import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base-component';
import { Utils } from '../../helpers/utils';
import { pwaLifeCycle } from "@cap-core/lifecycle";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
@pwaLifeCycle()
export class FooterComponent extends BaseComponent implements OnInit {

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

  navigateToCategory(item) {
    this.router.navigateByUrl('/products/listing/(' + (item.sequence - 1) + ':' + (item.sequence - 1) +')?category=' + item.name + '&id=' + item.categoryId);
  }
}
