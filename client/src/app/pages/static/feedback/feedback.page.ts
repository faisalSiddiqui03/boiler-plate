import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../../helpers/utils';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage extends BaseComponent implements OnInit {
  feedBackForm: FormGroup;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private utilService: UtilService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.translate.use(this.getCurrentLanguageCode());

    this.feedBackForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])],
      orderNumber: ['', Validators.compose([Validators.required, Validators.pattern('^\\d+$')])],
      orderType: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
    });
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('feedback_page.feedback').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    this.router.navigateByUrl(this.utilService.getLanguageCode() + '/' + pageName);
  }

  sendFeedback() {
    console.log(this.feedBackForm.value);
  }

}
