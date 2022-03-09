import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { EndpointBase } from "./endpoint.base.service";

@Injectable()
export class Accountserviceendpoint extends EndpointBase {
  baseUrl: string = environment.baseUrl;
  private readonly _GetNumeDenomicount = "GetNumeDenomicount";
  private readonly _GetProvidersLocationwise =
    "CQMReports/GetProvidersLocationwise";
  private readonly _GetEncountersList = "GetEncountersList";
  private readonly _GetPatientsList = "GetPatientsList";
  private readonly _GetSessionwiseMUStage3Reports =
    "GetSessionwiseMUStage3Reports";
  private readonly _GetStage2NumeDenomiCount = "GetStage2NumeDenomiCount";
  private readonly _GetStage2SessionwiseMUReports =
    "GetStage2SessionwiseMUReports";
  private readonly _GetProblemListReportByProviderId = "GetProblemList";
  private readonly _GetProvidersList = "GetProvidersList?Location_Id=";
  private readonly _GetLocationsList = "GetLocationsList?provider_Id=";
  private readonly _Creatreport: string = "Creatreport";
  private readonly _GetProviders = "GetProviders";
  private readonly _GetDashBoardReport = "GetDashBoardReport";
  private readonly _GetUserLogin = "UserLogin";
  private readonly _SetUserCredentials = "SetUserCredentials";
  private readonly _GetUserCredentials = "GetUserCredentials";
  private readonly _VerifyUserCredentials = "VerifyUserCredentials";
  //  private readonly _LoginCredentials = 'LoginCredentials'
  private readonly _GetCQMReportsBySessionName =
    "CQMReports/GetCQMReportsBySessionName";
  private readonly _CreateQueuedReport = "CQMReports/CreateQueueReports";

  private readonly _CQMReportsMeasurePatientMetInfo =
    "CQMReports/CQMReportsMeasurePatientMetInfo";

  private readonly _DrilldownViewConditions =
    "CQMReports/DrilldownViewConditions";

    private readonly _GetPractiseLocations =
  "GetLocationsList?Provider_Id";
  private readonly _DateTimeZone ="DisplayTimeZone?timeZoneId=";
  private readonly _TimeZoneList ="GetTimeZone";
  private readonly _AddressVerification ="AddressVerification"; 
  private readonly _ProvdierAdminAccess = "CQMReports/TimeZoneList";
  private readonly _AddUpdateLocation = "AddUpdateLocation";
  private readonly _GetLocationById = "GetLocationById?id";
  private readonly _GetProviderDetails = "GetProviderListByLocation";
  private readonly _UserRegistration = "CreateRegistration";

  get GetProvidersLocationwise() {
    return this.baseUrl + this._GetProvidersLocationwise;
  }
  get GetNumeDenomicountUrl() {
    return this.baseUrl + this._GetNumeDenomicount;
  }
  get getPatientListUrl() {
    return this.baseUrl + this._GetSessionwiseMUStage3Reports;
  }
  get getAllPatientListUrl() {
    return this.baseUrl + this._GetPatientsList;
  }
  get getEncountersListUrl() {
    return this.baseUrl + this._GetEncountersList;
  }
  get _GetStage2NumeDenomiCountUrl() {
    return this.baseUrl + this._GetStage2NumeDenomiCount;
  }
  get getStage2PatientListUrl() {
    return this.baseUrl + this._GetStage2SessionwiseMUReports;
  }
  get getProblemListReportByProviderIdUrl() {
    return this.baseUrl + this._GetProblemListReportByProviderId;
  }
  get getProvidersListUrl() {
    return this.baseUrl + this._GetProvidersList;
  }
  get getLocationsListUrl() {
    return this.baseUrl + this._GetLocationsList;
  }
  get VerifyUserCredentialsUrl() {
    return this.baseUrl + this._VerifyUserCredentials;
  }
  get CreatreportUrl() {
    return this.baseUrl + this._Creatreport;
  }
  get GetProvidersUrl() {
    return this.baseUrl + this._GetProviders;
  }
  get GetDashBoardReportUrl() {
    return this.baseUrl + this._GetDashBoardReport;
  }
  get GetUserLoginUrl() {
    return this.baseUrl + this._GetUserLogin;
  }
  get SetUserCredentialsUrl() {
    return this.baseUrl + this._SetUserCredentials;
  }
  get GetUserCredentialsUrl() {
    return this.baseUrl + this._GetUserCredentials;
  }

  get CQMReportsMeasurePatientMetInfoUrl() {
    return this.baseUrl + this._CQMReportsMeasurePatientMetInfo;
  }

  // get LoginCredentialsUrl() { return this.baseUrl + this._LoginCredentials}_GetCQMReportsBySessionName

  get GetCQMReportsBySessionNameUrl() {
    return this.baseUrl + this._GetCQMReportsBySessionName;
  }
  get CreateQueuedReportUrl() {
    return this.baseUrl + this._CreateQueuedReport;
  }

  get DrilldownViewConditionsUrl() {
    return this.baseUrl + this._DrilldownViewConditions;
  }
  get getPractiseLocationsUrl() {
    return this.baseUrl + this._GetPractiseLocations;
  }
  get DateTimeZoneUrl() {
    return this.baseUrl + this._DateTimeZone;
  }
  get TimeZoneListUrl() {
    return this.baseUrl + this._TimeZoneList;
  }
  get AddressVerificationUrl() {
    return this.baseUrl + this._AddressVerification;
  }
  get ProvdierAdminAccessUrl() {
    return this.baseUrl + this._ProvdierAdminAccess;
  }
  get AddUpdateLocationUrl() {
    return this.baseUrl + this._AddUpdateLocation;
  }
  get GetLocationByIdUrl() {
    return this.baseUrl + this._GetLocationById;
  }
  get GetProviderDetailsUrl() {
    return this.baseUrl + this._GetProviderDetails;
  }
  get UserRegistrationUrl() {
    return this.baseUrl + this._UserRegistration;
  }

  constructor(private http: HttpClient) {
    super();
  }

  Creatreport<T>(data: any): Observable<T> {
    const endpointUrl = this.CreatreportUrl;
    return this.http.post<T>(endpointUrl, data, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  GetAllProviders<T>(): Observable<T> {
    const endpointUrl = this.GetProvidersUrl;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  GetDashBoardReport<T>(data: any): Observable<T> {
    const endpointUrl = this.GetDashBoardReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  GetUserLogin<T>(data: any): Observable<T> {
    const endpointUrl = this.GetUserLoginUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  GetUserCreds<T>(): Observable<T> {
    const endpointUrl = this.GetUserCredentialsUrl;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  SetUserCreds<T>(): Observable<T> {
    const endpointUrl = this.SetUserCredentialsUrl;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getNumerator<T>(data1: any): Observable<T> {
    const endpointUrl = this.GetNumeDenomicountUrl;
    return this.http.post<T>(endpointUrl, data1).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getPatientList<T>(data: any): Observable<T> {
    const endpointUrl = this.getPatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getProvidersLocationwise<T>(): Observable<T> {
    const endpointUrl = this.GetProvidersLocationwise;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getAllPatientList<T>(data: any): Observable<T> {
    const endpointUrl = this.getAllPatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getEncountersList<T>(data: any): Observable<T> {
    const endpointUrl = this.getEncountersListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getStage2NumeDenomiCount<T>(data: any): Observable<T> {
    const endpointUrl = this._GetStage2NumeDenomiCountUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getStage2PatientList<T>(data: any): Observable<T> {
    const endpointUrl = this.getStage2PatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getProblemListReportByProviderId<T>(data: any): Observable<T> {
    const endpointUrl = this.getProblemListReportByProviderIdUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getProviderList<T>(req: any): Observable<T> {
    const endpointUrl = this.getProvidersListUrl + req.LocationId;
    return this.http.post<T>(endpointUrl, req.LocationId).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getLocationsList<T>(LocationId: any): Observable<T> {
    const endpointUrl = this.getLocationsListUrl + LocationId;
    return this.http.post<T>(endpointUrl, LocationId).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  // login credentials
  // loginCredentials<T>(Data:any): Observable<T> {

  //     const endpointUrl = this.LoginCredentialsUrl;
  //     return this.http.post<T>(endpointUrl, Data).pipe(tap(data => {
  //         return data;
  //     }),
  //         catchError(this.handleError)
  //     );
  // }

  getCQMReportsQueuedReports<T>(data: any): Observable<T> {
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getCQMReportsDashboard<T>(data: any): Observable<T> {
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getCQMReportsPatientList<T>(data: any): Observable<T> {
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  CreateQueuedReport<T>(data: any): Observable<T> {
    const endpointUrl = this.CreateQueuedReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  getCQMReportsMeasurePatientMetInfo<T>(cmscoditions_data: any): Observable<T> {
    const endpointUrl = this.CQMReportsMeasurePatientMetInfoUrl;
    return this.http.post<T>(endpointUrl, cmscoditions_data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  DrilldownViewConditions<T>(data: any): Observable<T> {
    const endpointUrl = this.DrilldownViewConditionsUrl;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  //Handel Errorss
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error("serverside error", error.error);
    }
    return throwError(error.error.Message);
  }
  VerifyUserCreds<T>(data): Observable<T> {
    const endpointUrl = this.VerifyUserCredentialsUrl + "/" + data;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  GetDateTimeZone<T>(data: any): Observable<T> {
    const endpointUrl = this.DateTimeZoneUrl +data;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  GetTimeZoneList<T>(): Observable<T> {
    const endpointUrl = this.TimeZoneListUrl;
    return this.http.get<T>(endpointUrl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  getPractiseLocations<T>(LocationId: any): Observable<T> {
    const endpointUrl = this.getPractiseLocationsUrl + '=';
    return this.http.post<T>(endpointUrl, LocationId).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }
  PostAddressVerification<T>(reqparams: any): Observable<T> {
    debugger;
    const endpointUrl = this.AddressVerificationUrl;
    return this.http.post<T>(endpointUrl, reqparams).pipe(
      tap((messageinfo) => {       
        return messageinfo;
      }),
      catchError(this.handleError)
    );
  }
  PostProvdierAdminAccess<T>(data: any): Observable<T> {
    const endpointUrl = this.ProvdierAdminAccessUrl ;
    return this.http.post<T>(endpointUrl, data).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  PostAddUpdateLocation<T>(reqparams:any): Observable<T>{
    const endpointUrl = this.AddUpdateLocationUrl;
    return this.http.post<T>(endpointUrl, reqparams).pipe(
      tap((messageinfo) => {
        return messageinfo;
      }),
      catchError(this.handleError)
    );
  }
  
  GetLocationById<T>(reqparam: any): Observable<T> {
    const endpointUrl = this.GetLocationByIdUrl + "=" + reqparam;
    return this.http.get<T>(endpointUrl).pipe(
      tap((locationAndWeekList) => {
        return locationAndWeekList;
      }),
      catchError(this.handleError)
    );
  }
  GetProviderDetails<T>(reqparams: any): Observable<T> {
    debugger;
    const endpointUrl = this.GetProviderDetailsUrl ;
    return this.http.post<T>(endpointUrl,reqparams).pipe(
      tap((UserList) => {
        return UserList;
      }),
      catchError(this.handleError)
    );
  }
  PostUserRegistration<T>(reqparams:any): Observable<T>{
    debugger;
    const endpointUrl = this.UserRegistrationUrl;
    return this.http.post<T>(endpointUrl, reqparams).pipe(
      tap((messageinfo) => {
        return messageinfo;
      }),
      catchError(this.handleError)
    );
  }
}
