import { environment } from './../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, finalize, switchMap, take } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class EhrInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url

    const isApiUrl = request.url.startsWith(environment.baseUrl);
    const currentUser = this.authenticationService.userValue;
    const isLoggedIn = this.authenticationService.isLoggedIn();

    if (isLoggedIn && isApiUrl) {
      const req = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, currentUser.JwtToken)
      });
      return next.handle(req);
    }

    return next.handle(request)

  };

  private refreshAccessToken(): Observable<any> {
    return of(this.authenticationService.refreshToken());
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.

    // If you are calling an outside domain then do not add the token.
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    if (!isApiUrl) {
      return request;
    }
    return request.clone({
      headers: request.headers.set("Authorization", `Bearer ${this.authenticationService.userValue.JwtToken}`)
    });
  }
}

function catchError(arg0: (error: HttpErrorResponse) => any):
import("rxjs").OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
  throw new Error('Function not implemented.');
}

