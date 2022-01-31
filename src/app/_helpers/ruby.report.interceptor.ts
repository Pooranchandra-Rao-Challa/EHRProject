import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { AuthenticationService } from '../Services/authentication.service';


// array in local storage for registered users
/*let users = JSON.parse(localStorage.getItem('user') ||'{}') || [];*/

@Injectable({providedIn:'root'})
export class RubyReportInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const { url, method, headers, body } = request;
    
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(() => {
        //rubyrails/authenticate/
        if (url.indexOf("rubyrails/authenticate/") > -1) {
          const user = this.authenticationService.loginWithRubyCredentials(rubySessionId());
          /*console.log(user);
          if (user)
            return ok(JSON.stringify(user))*/
        }
        return next.handle(request);
      }))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());


    // helper functions

    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message: any) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization').startsWith('ehr-token:');
    }

    function rubySessionId() {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1].replace("?","").split('&')[0].split('=')[1];
    }
  }
}

