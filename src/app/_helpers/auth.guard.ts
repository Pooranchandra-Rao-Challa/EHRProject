import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, UrlTree } from "@angular/router";

import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services/authentication.service';
import { IdService } from './_id.service';
import {ERROR_CODES} from 'src/app/_alerts/alertMessage'



@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private idService: IdService
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (this.authenticationService.isLoggedIn()) {
      // authorised so return true
      // console.log(route.url);
      // console.log(state.url);
      // console.log(state.root);
      // console.log(this.router.routerState);
      // console.log(route.url[0]['path'])

      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/account/home'], { queryParams: { message: ERROR_CODES["EL003"] } });
    return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  /*
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }*/

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
