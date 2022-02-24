import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Observer, observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, observeOn, tap, retry, catchError } from 'rxjs/operators';

import { environment } from "src/environments/environment";
import { User, ResponseData } from '../_models';
import { IdService } from '../_helpers/_id.service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  baseUrl: string = environment.baseUrl;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public resp: Observable<ResponseData>;

  public get userValue(): User {
    if (this.userSubject != undefined)
      return this.userSubject.getValue();
    else return undefined;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private idService: IdService
  ) {
    if (localStorage.getItem('user')) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
      this.user = this.userSubject.asObservable();
    }

  }

  loginWithRubyCredentials(ruby_session_id: any) {
    localStorage.setItem('ruby_session_id', ruby_session_id);
    //console.log(this.baseUrl + 'VerifyUserCredentials/' + ruby_session_id);
    try {
      this.http.get<ResponseData>(this.baseUrl + '/VerifyUserCredentials/' + ruby_session_id).subscribe(resp => {
        if (resp.IsSuccess) {
          let sessionToken = this.idService.generate();
          this.userSubject = new BehaviorSubject<User>(resp.Result as User);
          this.userSubject.value.Token = sessionToken;
          this.userSubject.value.RubyId = ruby_session_id;
          localStorage.setItem('user', JSON.stringify(resp.Result as User));
          localStorage.setItem('session_token', sessionToken);
          this.router.navigate(['/reports/categoryreports']);
        } else {
          this.router.navigate(['/account/rubyloginfailed']);
        }
      }),
        (error) => {
          this.router.navigate(['/account/rubyloginfailed']);
        };

    } catch { this.router.navigate(['/account/rubyloginfailed']); }

  }

  loginWithFormCredentials(creds: any): Observable<ResponseData> {
    const endpointUrl = this.baseUrl + "Authenticate/";
    let observable = this.http.post<ResponseData>(endpointUrl, creds);
    observable.subscribe(resp => {
      if (resp.IsSuccess) {
        let sessionToken = this.idService.generate();
        this.userSubject = new BehaviorSubject<User>(resp.Result as User);
        this.userSubject.value.Token = sessionToken;
        localStorage.setItem('user', JSON.stringify(resp.Result as User));
        localStorage.setItem('session_token', sessionToken);
        this.router.navigate(['/reports/categoryreports']);
      }
    }),
      (error) => {
        this.logout();
      };
    return observable;
  }

  logout() {
    if (this.userValue.RubyId) {
      const endpointUrl = this.baseUrl + "RemoveAngularSessionInMongo/";
      this.http.post<ResponseData>(endpointUrl, { "RubyId": this.userValue.RubyId });
    }
    let token = localStorage.getItem("session_token");
    localStorage.removeItem('user');
    localStorage.removeItem('session_token');
    this.idService.remove(token);
    // this.router.navigate(['/account/login']);
    this.router.navigate(['/account/home']);


  }

  isLoggedIn() {
    let token = localStorage.getItem('session_token');
    return token != undefined || token != null;
  }
}
