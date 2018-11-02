import { Component, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SeoComponent } from '@capillarytech/pwa-components/base-component';
import { CapRouterService, Action, pwaLifeCycle } from '@capillarytech/pwa-framework';
import { SurveyWidgetActions } from '@cap-widget/survey';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})

@pwaLifeCycle()
export class FeedbackPage extends SeoComponent {
  feedBackForm: FormGroup;
  feedbackWidgetAction = new EventEmitter();
  feedbackWidgetExecutor = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private capRouter: CapRouterService,
  ) {
    super({ pageKey: 'feedback' });
    this.feedBackForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: [
        '',
        Validators.compose([Validators.required, Validators.minLength(8),
        Validators.maxLength(8), Validators.pattern('^[2,5,6,9][0-9]*$')])
      ],
      orderNumber: ['', Validators.compose([Validators.required, Validators.pattern('^\\d+$')])],
      orderType: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])],
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
    this.capRouter.routeByUrl(pageName);
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
