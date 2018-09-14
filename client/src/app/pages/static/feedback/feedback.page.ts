import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedBackForm: FormGroup;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.translate.use(Utils.getLanguageCode());

    this.feedBackForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      orderNumber: ['', Validators.compose([Validators.required])],
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
    this.router.navigateByUrl(pageName);
  }

}
