import { ReferralInfo } from './../_models/_provider/encounter';
import { MessageCounts, ProviderHeader } from './../_navigations/provider.layout/view.notification.service';
import { SecureCreds } from './../_models/_account/user';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Observer, observable, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { APIEndPoint } from './api.endpoint.service';
import { environment } from "src/environments/environment";
import { User, ResponseData, ViewModel, AdminViewModal, DrFirstAttributes } from '../_models';
import { ERROR_CODES, AlertMessage } from 'src/app/_alerts/alertMessage'
import Swal from 'sweetalert2'
import { getLogger } from "../logger.config";
import { PatientRelationInfo } from '../_models/_provider/patientRelationship';
import { EncryptDescryptService } from 'src/app/_services/encrypt.decrypt.service';
import jwtdecode from 'jwt-decode'
const logModel = getLogger("ehr");
const logger = logModel.getChildCategory("AuthenticationService");

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  baseUrl: string = environment.baseUrl;
  private userIP: string;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  public resp: Observable<ResponseData>;
  private refreshTokenTimer;

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
    private apiEndPoint: APIEndPoint,
    private encryptDescryptService: EncryptDescryptService
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
          if (this.userValue.IsSuccess) {
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isProvider) {
              if (!this.isProviderVerfied)
                this.logout(ERROR_CODES["EL006"]);
              else if (!this.isProviderActive && !this.hasEmergencyAccess)
                this.logout(ERROR_CODES["EL008"]);
              else if (this.isUserLocked && !this.hasEmergencyAccess) {
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
  ResetPasswordForPatient(creds: any) {
    const endpointUrl = this.baseUrl + "ResetPasswordForPatient";
    return this.http.post<any>(endpointUrl, creds);
  }

  PatientSecurityQuestion(userInfo: any) {
    const endpointUrl = this.baseUrl + "PatientSecurityQuestion";
    return this.http.post<any>(endpointUrl, userInfo);
  }

  SwitchUser(data: { SwitchUserKey: string, SwitchUserEncKey: string, UserIP: string }) {
    if (this.isAdmin) {
      const endpointUrl = this.baseUrl + "SwitchUser/";
      let observable = this.http.post<ResponseData>(endpointUrl, data).pipe<ResponseData>(
        tap(resp => {
          if (resp.IsSuccess) {
            localStorage.clear();
            this.userSubject = new BehaviorSubject<User>(resp.Result as User);
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            if (this.isProvider) {
              if (!this.isProviderActive) {
                this.logout(ERROR_CODES["EL008"])
              }
              else if (!this.isProviderVerfied) {
                this.logout(ERROR_CODES["EL006"])
              }
              else if (!this.isProviderInTrialPeriod && !this.isProviderTrialPeriodClosed) {
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

  SwitchToPatientUser(data: { SwitchUserKey: string, SwitchUserEncKey: string, UserIP: string }) {
    if (this.isAdmin) {
      const endpointUrl = this.baseUrl + "SwitchToPatientUser/";
      let observable = this.http.post<ResponseData>(endpointUrl, data).pipe<ResponseData>(
        tap(resp => {
          if (resp.IsSuccess) {
            localStorage.clear();
            this.userSubject = new BehaviorSubject<User>(resp.Result as User);
            localStorage.setItem('user', JSON.stringify(resp.Result as User));
            this.updateViewModel();
            this.startRefreshTokenTimer();
            // will have to show msg when the user(patient) is not login for first time
            if (this.isPatient) {
              if (!this.isPatientActive) {
                this.logout(ERROR_CODES["EL014"])
              } else {
                this.router.navigate(
                  ['/patient/dashboard'],
                  { queryParams: { name: 'dashboard' } }
                );
              }

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

        if (this.isPatient && !this.hasSecureQuestion && this.isFirstTimeLogin) {
          this.router.navigate(['/account/security-question']);
        }
        else if (this.isPatient && this.hasSecureQuestion && this.isFirstTimeLogin) {
          this.router.navigate(['/account/reset-password']);
        }
        else if (this.isPatient && this.hasPatientRelations && this.isPatientActive) {
          this.router.navigate(['/account/patient-relations']);
        } else if (this.isPatient && !this.isPatientActive) {
          this.logout(ERROR_CODES["EL014"])
        } else if (this.isRepresentative && !this.isRepresentaiveActive) {
          this.logout(ERROR_CODES["EL015"])
        }
        else if (this.isPatient || this.isRepresentative)
          this.router.navigate(['patient/dashboard']);
        else {
          this.logout(ERROR_CODES["EL001"]);
        }
      } else {
        this.logout(ERROR_CODES["EL001"]);
      }
    }),
      (error) => {
        this.logout(ERROR_CODES["EL002"]);
      };
    return observable;
  }

  refreshToken() {
    var url = this.baseUrl + 'refreshtoken';
    this.http.post<any>(url, { Refresh: this.userValue.RefreshToken, UserIP: this.userIP })
      .subscribe((resp) => {
        if (resp.IsSuccess) {
          const u = resp.Result as User;
          this.userValue.JwtToken = u.JwtToken;
          this.userValue.RefreshToken = u.RefreshToken;
          this.userSubject = new BehaviorSubject<User>(this.userValue);
          localStorage.setItem('user', JSON.stringify(this.userValue));
          this.startRefreshTokenTimer();
        }

      })
  }
  openRefeshDialog() {
    this.UserIp().subscribe(resp => {
      this.userIP = resp.ip;
      Swal.fire({
        title: 'Do you want extend the session?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Refresh Session',
        denyButtonText: `Revoke Session`,
        customClass: {
          confirmButton: 'confirm-refresh-session'
        }
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.refreshToken()
        } else if (result.isDenied) {
          this.logout();
        }
      })
    });

  }

  revokeToken(error: any = '') {
    var url = this.baseUrl + 'revoketoken';
    this.http.post<any>(url, { Refresh: this.userValue.RefreshToken, UserIP: this.userIP })
      .subscribe({
        next: (resp) => {
          this.stopRefreshTokenTimer();
          localStorage.removeItem('user');
          if (error != '' && error != null)
              localStorage.setItem('message', error);
          this.router.navigate(['/account/home'])
          //.then(() => {window.location.reload();});
        },
        error: (error) => {
          this.stopRefreshTokenTimer();
          localStorage.removeItem('user');
          if (error != '' && error != null)
              localStorage.setItem('message', error);
          this.router.navigate(['/account/home']);
          //.then(() => {window.location.reload();});
        },
        complete: () =>{

        }
      }

      );
  }

  logout(error: any = '') {
    this.revokeToken(error);
  }

  isLoggedIn() {
    if (!this.userValue) return false;
    if (!this.userValue.JwtToken) return false;
    const jwtToken = jwtdecode(this.userValue.JwtToken) as unknown as any;
    const exp = new Date(jwtToken.exp * 1000);
    const iat = new Date(jwtToken.iat * 1000);
    const nbf = new Date(jwtToken.nbf * 1000);
    exp.setSeconds(0);
    iat.setSeconds(0);
    nbf.setSeconds(0);
    const today = new Date();
    const flag = today >= nbf && today >= iat && today <= exp;
    return flag
  }

  public startRefreshTokenTimer() {
    const jwtToken = jwtdecode(this.userValue.JwtToken) as unknown as any;
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - (new Date()).getTime();
    if (this.refreshTokenTimer) clearInterval(this.refreshTokenTimer);
    this.refreshTokenTimer = setInterval(() => this.openRefeshDialog(), timeout);
  }

  public clearTimer(){
    clearInterval(this.refreshTokenTimer);
  }



  permissions() {
    if (!this.userValue) return false;
    if (!this.userValue.Permissions) return false;
    return JSON.parse(this.userValue.Permissions);
  }


  UpdateUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  UpdatePatientUser(patientRelation: PatientRelationInfo): boolean {
    this.userValue.PatientId = patientRelation.PatientId;
    this.userValue.FirstName = patientRelation.FirstName;
    this.userValue.LastName = patientRelation.LastName;
    this.userValue.Role = patientRelation.Role;
    this.userValue.Username = patientRelation.UserName;
    this.userValue.UserId = patientRelation.UserId;
    this.userValue.UrgentMessages = patientRelation.UrgentMessages;
    this.userValue.UnReadMails = patientRelation.UnreadMessages;
    localStorage.setItem('user', JSON.stringify(this.userValue));
    return true;
  }

  SetDrFirstAttributes(drFirstAttributes: DrFirstAttributes) {

    let strAttributes = JSON.stringify(drFirstAttributes);
    this.userValue.DrFirstAttributes = this.encryptDescryptService.set("DrFirstKeyEncryption", strAttributes);;
    localStorage.setItem('user', JSON.stringify(this.userValue));
  }

  GetDrFirstAttributes() {
    if (!this.userValue.DrFirstAttributes) return undefined;
    let strAttributes = this.encryptDescryptService.get("DrFirstKeyEncryption", this.userValue.DrFirstAttributes);
    return (JSON.parse('[' + strAttributes + ']')[0] as unknown as DrFirstAttributes);
  }

  UpdateTimeZone(user: User) {
    localStorage.setItem('user', JSON.stringify(user as User));
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
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.IsFirstTimeLogin;
  }

  get hasSecureQuestion(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.HasSecureQuestion;
  }

  get hasPatientRelations(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.HasPatientRelations;
  }

  get resetToken(): string {
    if (this.userValue == undefined || this.userValue == null) return "";
    return this.userValue.ResetToken;
  }

  get isProviderActive(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.ProviderActive;
  }

  get hasEmergencyAccess(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.EmergencyAccess;
  }

  get isUserLocked(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.UserLocked;
  }

  get isAdminActive(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.AdminActive;
  }

  get isPatientActive(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.PatientActive;
  }

  get isRepresentaiveActive(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.RepresentativeActive;
  }

  get isProviderInTrialPeriod(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
    return this.userValue.TrialDaysLeft > 0;
  }

  get isProviderTrialPeriodClosed(): boolean {
    if (this.userValue == undefined || this.userValue == null) return false;
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

  UpdateEmergencyAccess() {
    this.userValue.EmergencyAccess = false;
    this.userSubject.next(this.userValue);
    localStorage.setItem('user', JSON.stringify(this.userValue as User));
  }



  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimer);
  }

  private updateViewModel() {
    let viewModel: ViewModel = new ViewModel;
    localStorage.setItem('viewModel', JSON.stringify(viewModel));
  }

  public UserIp(): Observable<any> {
    return this.http.get('https://jsonip.com/')
  }

}
