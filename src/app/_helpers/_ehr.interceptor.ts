import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdService} from './_id.service';


@Injectable()
export class EhrInterceptor implements HttpInterceptor {
  constructor(private idService: IdService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url
    let token = localStorage.getItem("session_token");

    if (this.idService.idExists(token)) {
      request = request.clone({
        setHeaders: {
          'Authorization': token,
          'Content-Type': 'application/json',
        }
      });
    }

    return next.handle(request);
  }
}
