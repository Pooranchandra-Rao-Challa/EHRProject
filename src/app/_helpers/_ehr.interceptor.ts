import { environment } from './../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, finalize, switchMap, take } from 'rxjs/operators';


@Injectable()
export class EhrInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url
    console.log("In Ehr Interceptor ");
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    console.log("isApiUrl: ",isApiUrl);

    const currentUser = this.authenticationService.userValue;
    console.log("currentUser: ",currentUser);

    const isLoggedIn = this.authenticationService.isLoggedIn();

    console.log("isLoggedIn: ",isLoggedIn);

    if (isLoggedIn && isApiUrl) {
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.JwtToken}`
        }
      });
      return next.handle(req);
    }
    return next.handle(request)
    // .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     console.log(error);

    //     if (error && error.status === 401
    //       && this.authenticationService.isLoggedIn()) {
    //       // 401 errors are most likely going to be because we have an expired token that we need to refresh.
    //       if (this.refreshTokenInProgress) {
    //         // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
    //         // which means the new token is ready and we can retry the request again

    //         return this.refreshAccessToken().pipe(
    //           filter(result => result !== null),
    //           take(1),
    //           switchMap(() => next.handle(this.addAuthenticationToken(request)))
    //         );
    //       } else {
    //         this.refreshTokenInProgress = true;

    //         // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
    //         this.refreshTokenSubject.next(null);

    //         return this.authenticationService.refreshToken().pipe(
    //           switchMap((success: boolean) => {
    //             this.refreshTokenSubject.next(success);
    //             return next.handle(this.addAuthenticationToken(request));
    //           }),
    //           // When the call to refreshToken completes we reset the refreshTokenInProgress to false
    //           // for the next time the token needs to be refreshed
    //           finalize(() => this.refreshTokenInProgress = false)
    //         );
    //       }
    //     } else {
    //       return throwError(error);
    //     }
    //   })
    // );
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

