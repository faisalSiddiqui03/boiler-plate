import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { BasePage } from '../../../../base/base-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class PasswordResetPage extends BasePage implements OnInit {
  passwordResetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { 
    super();
    this.passwordResetForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

}
