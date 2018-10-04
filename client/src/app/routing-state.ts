import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable()
export class RoutingState {
  private history = [];

  constructor(
    private router: Router
  ) { }

  public loadRouting(): void {
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
    //     this.history = [...this.history, urlAfterRedirects];
    //   });
    this.router.events.subscribe(event => {
      console.log('Check: ',event);
    })
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    console.log('History:', this.history);
    return this.history[this.history.length - 2] || '/index';
  }
}