import { ProviderList } from './../_models/_admin/providerList';
import { MessageCounts, ProviderHeader } from './../_navigations/provider.layout/view.notification.service';
import { SecureCreds } from './../_models/_account/user';
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
    if (v == null) v = new ViewModel();
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
    //console.log(creds);
    let observable = this.http.post<ResponseData>(endpointUrl, creds).pipe<ResponseData>(
      tap(resp => {
        //console.log(resp);
        if (resp.IsSuccess) {
          this.userSubject = new BehaviorSubject<User>(resp.Result as User);
          if (this.userValue.IsSuccess) {
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isProvider) {
              if (!this.isProviderVerfied)
                this.logout(ERROR_CODES["EL006"]);
              else if (!this.isProviderActive)
                this.logout(ERROR_CODES["EL008"]);
              else if (this.isUserLocked) {
                this.router.navigate(
                  ['provider/smartschedule'],
                  { queryParams: { name: 'Smart Schedule' } }
                );
              }
              else if (!this.isProviderInTrialPeriod && !this.isProviderTrialPeriodClosed) {
                // Provider trial period is closed please do subscribe for accessing application.
                // alert('Provider trial period is closed please do subscribe for accessing application.');
                this.logout(ERROR_CODES["EL012"]);
              }
              else
              this.router.navigate(
                ['provider/smartschedule'],
                { queryParams: { name: 'Smart Schedule' } }
              );
            }
            else if (this.isAdmin)
              if (this.isUserLocked)
                this.logout(ERROR_CODES["EL010"]);
              else if (this.isUserLocked)
                this.logout(ERROR_CODES["EL011"]);
              else
                this.router.navigate(
                  ['admin/dashboard'],
                  { queryParams: { name: 'Providers' } }
                );
            else if (this.isPatient)
              this.logout(ERROR_CODES["EL001"]);
          } else if (this.isFirstTimeLogin) {
            if (this.isProvider)
              this.logout(ERROR_CODES["EL006"]);
            else if (this.isAdmin)
              this.logout(ERROR_CODES["EL007"]);
          } else {
            this.logout(ERROR_CODES["EL001"]);
          }
        } else {
          this.logout(ERROR_CODES["EL001"]);
        }
      }, err => {
        this.logout(ERROR_CODES["EL002"]);
      }),

    );
    return observable;
  }

  SecurePasswordChangeForProvider(creds: SecureCreds) {
    const endpointUrl = this.baseUrl + "SecurePasswordChange";
    return this.http.post<any>(endpointUrl, creds);
  }
  UpdatePasswordOnRequest(creds: any) {
    const endpointUrl = this.baseUrl + "UpdatePasswordOnRequest";
    return this.http.post<any>(endpointUrl, creds);
  }

  ValidatePatientChangePasswordInputs(creds: any) {
    const endpointUrl = this.baseUrl + "ValidatePatientChangePasswordInputs";
    return this.http.post<any>(endpointUrl, creds);
  }



  SwitchUser(data: { SwitchUserKey: string, SwitchUserEncKey: string }) {
    if (this.isAdmin) {
      const endpointUrl = this.baseUrl + "SwitchUser/";
      //console.log(data);
      let observable = this.http.post<ResponseData>(endpointUrl, data).pipe<ResponseData>(
        tap(resp => {
          //console.log(resp);
          if (resp.IsSuccess) {
            this.revokeToken();
            localStorage.clear();
            this.userSubject = new BehaviorSubject<User>(resp.Result as User);
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isProvider) {
              if (!this.isProviderVerfied) {
                this.logout(ERROR_CODES["EL006"])
              }
              else if (!this.isProviderTrialPeriodClosed) {
                this.logout(ERROR_CODES["EL012"])
              }
              else
                this.router.navigate(
                  ['/provider/smartschedule'],
                  { queryParams: { name: 'Smart Schedule' } }
                );
            }

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

  SwitchToPatientUser(data: { SwitchUserKey: string, SwitchUserEncKey: string }) {
    if (this.isAdmin) {
      //console.log(data);
      const endpointUrl = this.baseUrl + "SwitchToPatientUser/";
      let observable = this.http.post<ResponseData>(endpointUrl, data).pipe<ResponseData>(
        tap(resp => {
          //console.log(resp);
          if (resp.IsSuccess) {
            this.revokeToken();
            localStorage.clear();
            this.userSubject = new BehaviorSubject<User>(resp.Result as User);
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isPatient) {
              this.router.navigate(
                ['/patient/dashboard'],
                { queryParams: { name: 'dashboard' } }
              );
            }
          } else {
            this.logout(ERROR_CODES["EL005"]);
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
        this.SetViewParam("View", "dashboard")
        if(this.isPatient && this.isFirstTimeLogin){

        }
        else if (this.isPatient || this.isRepresentative)
          this.router.navigate(['patient/dashboard']);
        else {
          this.logout(ERROR_CODES["EL001"]);
        }
      } else {
        this.logout(ERROR_CODES["EL001"]); // EL002
      }
    }),
      (error) => {
        this.logout(ERROR_CODES["EL002"]);
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
    if (!this.userValue) return false;
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

  get isProviderVerfied(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.EmailConfirmation;
  }

  get isPatient(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.Role.toLowerCase() == "patient"
  }

  get isRepresentative(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.Role.toLowerCase() == "representative"
  }

  get isFirstTimeLogin(): boolean {
    return this.userValue.IsFirstTimeLogin;
  }

  get isProviderActive(): boolean {
    return this.userValue.ProviderActive;
  }

  get isUserLocked(): boolean {
    return this.userValue.UserLocked;
  }

  get isAdminActive(): boolean {
    return this.userValue.AdminActive;
  }

  get isProviderInTrialPeriod(): boolean {
    return this.userValue.TrialDaysLeft > 0;
  }

  get isProviderTrialPeriodClosed(): boolean {
    return this.userValue.TrialDaysLeft == null;
  }

  updateMessageCounts(counts: MessageCounts) {
    let u = this.userValue;
    u.UnReadMails = counts.UnreadCount;
    u.UrgentMessages = counts.UrgentCount;
    this.userSubject.next(u);
    localStorage.setItem('user', JSON.stringify(u as User));
  }

  updateProviderHeader(provider: ProviderHeader) {
    let u = this.userValue;
    u.FirstName = provider.FirstName;
    u.LastName = provider.LastName;
    this.userSubject.next(u);
    localStorage.setItem('user', JSON.stringify(u as User));
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
