import { environment } from './../../environments/environment.prod';
import { AuthenticationService } from '../_services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class EhrInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url

    const currentUser = this.authenticationService.userValue;
    const isLoggedIn = currentUser && currentUser.JwtToken;
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    if (isLoggedIn && isApiUrl) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${currentUser.JwtToken}`
            }
        });
    }

    return next.handle(request);
  }
}
