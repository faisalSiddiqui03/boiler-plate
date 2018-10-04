import { Component, OnInit } from '@angular/core';
import { LanguageService } from '@capillarytech/pwa-framework';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RoutingState } from '../routing-state';

@Component({
  selector: 'app-checker',
  templateUrl: './checker.page.html',
  styleUrls: ['./checker.page.scss'],
})
export class CheckerPage implements OnInit {

  constructor(
    private router: Router,
    private langService: LanguageService,
    private activatedRoute: ActivatedRoute,
    private routingState: RoutingState
  ) {
  }

  async ngOnInit() {
    const lang = await this.langService.getInstancePromise();
    console.log('Check kar language: ', lang.code);

    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   console.log('Check kar route: ', this.activatedRoute.root);
    // });

    // this.router.events.subscribe(() => {
    //   console.log('Check kar route: ', this.activatedRoute.root);
    // });
    console.log('Check kar: ', this.routingState.getPreviousUrl());
  }

}
