import { Component, OnInit, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { pwaLifeCycle, pageView } from '@capillarytech/pwa-framework';
import { BasePage } from '../../../../base/base-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})

@pwaLifeCycle()
@pageView()

export class SignupPage extends BasePage implements OnInit {

  signUpForm:FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    super();
    this.signUpForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: [''],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
   }

  ngOnInit() {
  }

  signUp(){
    console.log(this.signUpForm.value);
  }

  goToPage(pageName) {
    this.router.navigateByUrl(pageName);
  }

}
