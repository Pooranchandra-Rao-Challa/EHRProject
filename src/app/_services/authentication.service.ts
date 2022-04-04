import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Observer, observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, observeOn, tap, retry, catchError } from 'rxjs/operators';
import { APIEndPoint } from './api.endpoint.service';


import { environment } from "src/environments/environment";
import { User, ResponseData } from '../_models';
import { getLogger } from "../logger.config";
const logModel = getLogger("ehr");
const logger = logModel.getChildCategory("AuthenticationService");
@Injectable({ providedIn: 'root' })
export class AuthenticationService {


  baseUrl: string = environment.baseUrl;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public resp: Observable<ResponseData>;
  private refreshTokenTimeout;

  public get userValue(): User {
    if (this.userSubject != undefined)
      return this.userSubject.getValue();
    else return undefined;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private apiEndPoint: APIEndPoint
  ) {
    if (localStorage.getItem('user')) {
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user') || '{}'));
      this.user = this.userSubject.asObservable();
    }

  }

  loginWithFormCredentials(creds: any): Observable<ResponseData> {
    const endpointUrl = this.baseUrl + "Authenticate/";
    logger.info("endpointurl: " + endpointUrl);
    console.log(endpointUrl)
    let observable = this.http.post<ResponseData>(endpointUrl, creds);
    console.log(observable);
    observable.subscribe(resp => {
      console.log(resp.IsSuccess);
      if (resp.IsSuccess) {
        //let sessionToken = this.idService.generate();
        this.userSubject = new BehaviorSubject<User>(resp.Result as User);
        //this.userSubject.value.JwtToken = sessionToken;
        localStorage.setItem('user', JSON.stringify(resp.Result as User));

        this.startRefreshTokenTimer();
        if (this.isProvider)
          // this.router.navigate(['/provider/smartschedule']);
          this.router.navigate(
            ['/provider/smartschedule'],
            { queryParams: { name: 'Smart Schedule' } }
          );
        else if (this.isAdmin)
          this.router.navigate(['/admin/dashboard']);
        else if (this.isPatient)
          this.router.navigate(['/patinet/patientview']);
        //else
        //this.router.navigate(['/reports/categoryreports']);
      }else{

      }
    }),
      (error) => {
        this.logout();
      };
    return observable;
  }
  patientLoginWithFormCredentials(creds: any): Observable<ResponseData> {
    const endpointUrl = this.apiEndPoint._authenticatePatientUrl;
    logger.info("endpointurl: " + endpointUrl);
    console.log(endpointUrl)
    let observable = this.http.post<ResponseData>(endpointUrl, creds);
    console.log(observable);
    observable.subscribe(resp => {
      debugger;
      console.log(resp.IsSuccess);
      if (resp.IsSuccess) {
        //let sessionToken = this.idService.generate();
        this.userSubject = new BehaviorSubject<User>(resp.Result as User);
        //this.userSubject.value.JwtToken = sessionToken;
        localStorage.setItem('user', JSON.stringify(resp.Result as User));

        this.startRefreshTokenTimer();
        console.log(this.userValue);
        console.log(this.userValue.LocationInfo);
        if (this.isProvider)
          // this.router.navigate(['/provider/smartschedule']);
          this.router.navigate(
            ['/provider/smartschedule'],
            { queryParams: { name: 'Smart Schedule' } }
          );
        else if (this.isAdmin)
          this.router.navigate(['/admin/providers']);
        else if (this.isPatient)
          this.router.navigate(['/patient/dashboard']);
        //else
        //this.router.navigate(['/reports/categoryreports']);
      }
    }),
      (error) => {
        this.logout();
      };
    return observable;
  }
  refreshToken() {
    return this.http.post<any>('${this.baseUrl + /refreshtoken', {}, { withCredentials: true })
      .pipe(map((resp) => {
        this.userSubject.next(resp.Result as User);
        this.startRefreshTokenTimer();
        return resp;
      }));
  }

  revokeToken() {
    return this.http.post<any>('${this.baseUrl + /revoketoken', {}, { withCredentials: true })
      .pipe(map((resp) => {
        this.userSubject.next(resp.Result as User);
        this.startRefreshTokenTimer();
        return resp.Result;
      }));
  }
  logout() {
    localStorage.removeItem('user');
    this.revokeToken();
    // this.router.navigate(['/account/login']);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/account/home']);
  }

  isLoggedIn() {
    const jwtToken = JSON.parse(atob(this.userValue.JwtToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timediff = expires.getTime() - Date.now();
    return timediff > 0;
  }

  get isProvider(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.Role.toLowerCase() == "provider"
  }

  get isAdmin(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.Role.toLowerCase() == "admin"
  }

  get isPatient(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.Role.toLowerCase() == "patient"
  }

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.JwtToken.split('.')[1]));
    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
