import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Utils } from '../../helpers/utils';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

  /**To get heading in the sub-header for each page */
  @Input() title: string;

  constructor(
    private translate: TranslateService
  ) {
    this.translate.use(Utils.getLanguageCode());
  }

  ngOnInit() {
  }

}
