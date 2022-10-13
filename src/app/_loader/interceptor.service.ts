import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(public loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true); $('body').addClass('loadactive').scrollTop(0);
    this.loaderService.progressValue = 20;
    return next.handle(req).pipe(
      finalize(
        () => {
          setTimeout(() => {
            this.loaderService.progressValue = 40;
          }, 500)

          setTimeout(() => {
            this.loaderService.isLoading.next(false); $('body').removeClass('loadactive');
          }, 2000);

          setTimeout(() => {
            this.loaderService.progressValue = 70;
          }, 500)
          setTimeout(() => {
            this.loaderService.progressValue = 100;
          }, 1300)
        }
      )
    )
  }
}
