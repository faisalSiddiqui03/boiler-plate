import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from '../../../helpers/utils';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService, AlertService } from '@capillarytech/pwa-ui-helpers';
import { pwaLifeCycle, LifeCycle, Action, pageView, ConfigService, OnWidgetActionsLifecyle, OnWidgetLifecyle } from '@capillarytech/pwa-framework';
import { BaseComponent } from '../../../base/base-component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'], 
})

@pwaLifeCycle()
@pageView()


export class CheckoutPage extends BaseComponent implements OnInit, OnWidgetLifecyle, OnWidgetActionsLifecyle {

  checkoutForm: FormGroup;
  currencyCode:string;

  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    private config: ConfigService,
  ) {

    super();
    
    this.translate.use(Utils.getLanguageCode());

    this.currencyCode = this.config.getConfig()['currencyCode'];

    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      building: ['', Validators.compose([Validators.required])],
      street: ['', Validators.compose([Validators.required])],
      comment: [''],
    }, { validator: this.validateMobile });
  }

  titleValue = '';

  ngOnInit() {
    this.translate.get('checkout_page.secure_checkout').subscribe(value => {
      this.titleValue = value;
    });
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

  validateMobile(group: FormGroup) {
    let mobile = group.controls.mobile.value;
    return (mobile.slice(0,1) != (2 || 5 || 6 || 9)) ? true : false;
  }

  widgetActionFailed(name: string, data: any): any {
    console.log(name, 'Action Failed');
  }

  widgetActionSuccess(name: string, data: any): any {
    console.log(name, 'Action Success');
  }

  widgetLoadingFailed(name: string, data: any): any {
    console.log(name, 'Loading Failed');
  }

  widgetLoadingStarted(name: string, data: any): any {
    console.log(name, 'Loading Started');
  }

  widgetLoadingSuccess(name: string, data: any): any {
    console.log(name, 'Loading Success');
  }

}
