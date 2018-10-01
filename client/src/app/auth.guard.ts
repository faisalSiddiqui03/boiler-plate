import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from './base/base-component';
// import { GlobalSharedService } from '@cap-core/service/global-shared.service';
// import { appInjector } from '@cap-core/app.injector';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends BaseComponent implements CanActivate {
  // protected globalSharedService: GlobalSharedService;
  //
  constructor(private router: Router) {
    super()
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.getUserPromise().then( userModel => {
        if (userModel && userModel.type !== 'GUEST') {
            return true;
        } else {
          console.log('access denied');
          this.router.navigateByUrl('home');
          return false;
        }
    });
  }
}
