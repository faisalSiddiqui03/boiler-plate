import {Component, EventEmitter, OnInit} from '@angular/core';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {UtilService} from '../../../helpers/utils';
import {BaseComponent} from '../../../base/base-component';
import {CapRouterService, SurveyWidgetActions, Action, pwaLifeCycle} from '@capillarytech/pwa-framework';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
@pwaLifeCycle()
export class FeedbackPage extends BaseComponent implements OnInit {
  feedBackForm: FormGroup;
  feedbackWidgetAction = new EventEmitter();
  feedbackWidgetExecutor = new EventEmitter();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService,
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

  widgetActionSuccess(name: string, data: any) {
    switch (name) {
      case SurveyWidgetActions.ACTION_ADD_SURVEY:
        console.log(name, data);
        break;
    }
  }

  goToPage(pageName) {
    this.capRouter.routeByUrlWithLanguage(pageName);
    // this.router.navigateByUrl(this.utilService.getLanguageCode() + '/' + pageName);
  }

  sendFeedback() {
    const map = new Map<String, String>();
    // console.log(this.feedBackForm.value);
    Object.keys(this.feedBackForm.value).forEach((key) => {
      console.log(key);
      map.set(key, this.feedBackForm.value[key]);
    });
    this.feedbackWidgetAction.emit(
      new Action(SurveyWidgetActions.ACTION_ADD_SURVEY, map)
    );
  }
}
