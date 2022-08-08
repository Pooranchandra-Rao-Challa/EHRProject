
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Observer, observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { APIEndPoint } from './api.endpoint.service';
import { environment } from "src/environments/environment";
import { User, ResponseData, ViewModel, AdminViewModal } from '../_models';
import { ERROR_CODES } from 'src/app/_alerts/alertMessage'
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

  public get viewModel(): ViewModel {
    return JSON.parse(localStorage.getItem("viewModel")) as ViewModel;
  }
  public SetViewParam(key: string, value: any) {
    let v = JSON.parse(localStorage.getItem("viewModel")) as ViewModel;
    v[key] = value;
    localStorage.setItem('viewModel', JSON.stringify(v));
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
    let observable = this.http.post<ResponseData>(endpointUrl, creds).pipe<ResponseData>(
      tap(resp => {
        if (resp.IsSuccess) {
          this.userSubject = new BehaviorSubject<User>(resp.Result as User);
          localStorage.setItem('user', JSON.stringify(resp.Result as User));
          this.updateViewModel();
          this.startRefreshTokenTimer();
          if (this.isProvider)
            this.router.navigate(
              ['provider/smartschedule'],
              { queryParams: { name: 'Smart Schedule' } }
            );
          else if (this.isAdmin)
            this.router.navigate(
              ['admin/dashboard'],
              { queryParams: { name: 'Providers' } }
            );
          else if (this.isPatient)
            this.router.navigate(['patinet/patientview']);
        } else {
          this.logout(ERROR_CODES["EL001"])
        }
      }, err => {
        this.logout(ERROR_CODES["EL002"]);
      }),

    );
    return observable;
  }

  SwitchUser(data: { SwitchUserKey: string, SwitchUserEncKey: string }) {
    if (this.isAdmin) {
      const endpointUrl = this.baseUrl + "SwitchUser/";
      let observable = this.http.post<ResponseData>(endpointUrl, data).pipe<ResponseData>(
        tap(resp => {
          if (resp.IsSuccess) {
            this.revokeToken();
            localStorage.clear();
            this.userSubject = new BehaviorSubject<User>(resp.Result as User);
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isProvider)
              this.router.navigate(
                ['/provider/smartschedule'],
                { queryParams: { name: 'Smart Schedule' } }
              );
          } else {
            this.logout(ERROR_CODES["EL005"])
          }
        }, err => {
          this.logout(ERROR_CODES["EL005"]);
        }),

      );
      return observable;
    }
  }
  patientLoginWithFormCredentials(creds: any): Observable<ResponseData> {
    const endpointUrl = this.apiEndPoint._authenticatePatientUrl;
    let observable = this.http.post<ResponseData>(endpointUrl, creds);
    observable.subscribe(resp => {
      if (resp.IsSuccess) {
        this.userSubject = new BehaviorSubject<User>(resp.Result as User);
        localStorage.setItem('user', JSON.stringify(resp.Result as User));
        this.startRefreshTokenTimer();
        if (this.isProvider)
          this.router.navigate(
            ['provider/smartschedule'],
            { queryParams: { name: 'Smart Schedule' } }
          );
        else if (this.isAdmin)
          this.router.navigate(['admin/providers']);
        else if (this.isPatient)
          this.router.navigate(['patient/dashboard']);
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
  logout(error: any = '') {
    localStorage.removeItem('user');
    this.revokeToken();
    this.stopRefreshTokenTimer();
    if (error == '')
      this.router.navigate(['/account/home']);
    else {
      this.router.navigate(
        ['/account/home'],
        { queryParams: { message: error } }
      );
    }
  }

  isLoggedIn() {
    const jwtToken = JSON.parse(atob(this.userValue.JwtToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timediff = expires.getTime() - Date.now();
    this.startRefreshTokenTimer();
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
    const jwtToken = JSON.parse(atob(this.userValue.JwtToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);

  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  private updateViewModel() {
    let viewModel: ViewModel = new ViewModel;
    localStorage.setItem('viewModel', JSON.stringify(viewModel));
  }



}
