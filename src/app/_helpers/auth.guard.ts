import { Injectable } from "@angular/core";
import {
  Router, CanActivate, ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, UrlTree
} from "@angular/router";
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { ERROR_CODES } from 'src/app/_alerts/alertMessage'



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    } else this.authenticationService.clearTimer();

    // not logged in so redirect to login page with the return url
    localStorage.setItem('message', ERROR_CODES["EL017"]);
    this.router.navigate(['/account/home']);
    return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authenticationService.isLoggedIn()) {
      return true;
    } else this.authenticationService.clearTimer();

    // not logged in so redirect to login page with the return url
    localStorage.setItem('message', ERROR_CODES["EL017"]);
    this.router.navigate(['/account/home']);
    return false;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }


  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return true;
  }
}
