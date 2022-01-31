import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { EndpointBase } from "./endpoint.base.service";

@Injectable()
export class Accountserviceendpoint extends EndpointBase {

  baseUrl: string = environment.baseUrl;
  private readonly _GetNumeDenomicount = 'GetNumeDenomicount';
  private readonly _GetProvidersLocationwise = 'CQMReports/GetProvidersLocationwise';
  private readonly _GetEncountersList = 'GetEncountersList';
  private readonly _GetPatientsList = 'GetPatientsList';
  private readonly _GetSessionwiseMUStage3Reports = 'GetSessionwiseMUStage3Reports';
  private readonly _GetStage2NumeDenomiCount = 'GetStage2NumeDenomiCount';
  private readonly _GetStage2SessionwiseMUReports = 'GetStage2SessionwiseMUReports';
  private readonly _GetProblemListReportByProviderId = 'GetProblemList';
  private readonly _GetProvidersList = 'GetProvidersList?Location_Id=';
  private readonly _GetLocationsList = 'GetLocationsList?provider_Id=';
  private readonly _DownloadQRDA3Report = 'CQMReports/DownloadQRDA3Report?ReportId=';

  private readonly _Creatreport: string = 'Creatreport';
  private readonly _GetProviders = "GetProviders";

  private readonly _GetDetailsReport = "GetDetailsReport/";
  private readonly _GetSubDetailsReport = "GetSubDetailsReport/";
  private readonly _GetReportByUserid = "GetReportByUserid";
  private readonly _GetBasicReportInfo = "GetBasicReportInfo/";
  private readonly _GetDashBoardReport = "GetDashBoardReport";
  private readonly _GetUserLogin = 'UserLogin';
  private readonly _SetUserCredentials = 'SetUserCredentials';
  private readonly _GetUserCredentials = 'GetUserCredentials';
  private readonly _VerifyUserCredentials = 'VerifyUserCredentials';
  //  private readonly _LoginCredentials = 'LoginCredentials'
  private readonly _GetCQMReportsBySessionName = 'CQMReports/GetCQMReportsBySessionName';
  private readonly _CreateQueuedReport = 'CQMReports/CreateQueueReports';

  get GetProvidersLocationwise() { return this.baseUrl + this._GetProvidersLocationwise; }
  get DownloadQRDA3Report() { return this.baseUrl + this._DownloadQRDA3Report; }

  get GetNumeDenomicountUrl() { return this.baseUrl + this._GetNumeDenomicount; }
  get getPatientListUrl() { return this.baseUrl + this._GetSessionwiseMUStage3Reports; }
  get getAllPatientListUrl() { return this.baseUrl + this._GetPatientsList; }
  get getEncountersListUrl() { return this.baseUrl + this._GetEncountersList; }
  get _GetStage2NumeDenomiCountUrl() { return this.baseUrl + this._GetStage2NumeDenomiCount; }
  get getStage2PatientListUrl() { return this.baseUrl + this._GetStage2SessionwiseMUReports; }
  get getProblemListReportByProviderIdUrl() { return this.baseUrl + this._GetProblemListReportByProviderId; }
  get getProvidersListUrl() { return this.baseUrl + this._GetProvidersList; }
  get getLocationsListUrl() { return this.baseUrl + this._GetLocationsList; }
  get VerifyUserCredentialsUrl() { return this.baseUrl + this._VerifyUserCredentials }


  get CreatreportUrl() { return this.baseUrl + this._Creatreport; }
  get GetProvidersUrl() { return this.baseUrl + this._GetProviders }

  get GetDetailsReportUrl() { return this.baseUrl + this._GetDetailsReport; }
  get GetSubDetailsReportUrl() { return this.baseUrl + this._GetSubDetailsReport; }
  get GetReportByUseridUrl() { return this.baseUrl + this._GetReportByUserid; }
  get GetBasicReportInfoUrl() { return this.baseUrl + this._GetBasicReportInfo; }
  get GetDashBoardReportUrl() { return this.baseUrl + this._GetDashBoardReport; }
  get GetUserLoginUrl() { return this.baseUrl + this._GetUserLogin }
  get SetUserCredentialsUrl() { return this.baseUrl + this._SetUserCredentials }
  get GetUserCredentialsUrl() { return this.baseUrl + this._GetUserCredentials }

  // get LoginCredentialsUrl() { return this.baseUrl + this._LoginCredentials}_GetCQMReportsBySessionName

  get GetCQMReportsBySessionNameUrl() {

    return this.baseUrl + this._GetCQMReportsBySessionName

  }
  get CreateQueuedReportUrl() { return this.baseUrl + this._CreateQueuedReport }



  constructor(private http: HttpClient) { super(); }



  Creatreport<T>(data: any): Observable<T> {

    const endpointUrl = this.CreatreportUrl;
    return this.http.post<T>(endpointUrl, data, this.requestHeaders).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetAllProviders<T>(): Observable<T> {

    const endpointUrl = this.GetProvidersUrl;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }



  GetDetailsReport<T>(data: any): Observable<T> {

    const endpointUrl = this.GetDetailsReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetSubDetailsReport<T>(data: any): Observable<T> {

    const endpointUrl = this.GetSubDetailsReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetReportByUserid<T>(): Observable<T> {

    const endpointUrl = this.GetReportByUseridUrl;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetBasicReportInfo<T>(data: any): Observable<T> {

    const endpointUrl = this.GetBasicReportInfoUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetDashBoardReport<T>(data: any): Observable<T> {

    const endpointUrl = this.GetDashBoardReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }

  GetUserLogin<T>(data: any): Observable<T> {

    const endpointUrl = this.GetUserLoginUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  GetUserCreds<T>(): Observable<T> {

    const endpointUrl = this.GetUserCredentialsUrl;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }

  SetUserCreds<T>(): Observable<T> {

    const endpointUrl = this.SetUserCredentialsUrl;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }

  getNumerator<T>(data1: any): Observable<T> {

    const endpointUrl = this.GetNumeDenomicountUrl;
    return this.http.post<T>(endpointUrl, data1).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  getPatientList<T>(data: any): Observable<T> {

    const endpointUrl = this.getPatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );

  }
  getProvidersLocationwise<T>(): Observable<T> {

    const endpointUrl = this.GetProvidersLocationwise;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );

  }

  getAllPatientList<T>(data: any): Observable<T> {

    const endpointUrl = this.getAllPatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );

  }
  getEncountersList<T>(data: any): Observable<T> {

    const endpointUrl = this.getEncountersListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );

  }
  getStage2NumeDenomiCount<T>(data: any): Observable<T> {

    const endpointUrl = this._GetStage2NumeDenomiCountUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }

  getStage2PatientList<T>(data: any): Observable<T> {

    const endpointUrl = this.getStage2PatientListUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  getProblemListReportByProviderId<T>(data: any): Observable<T> {

    const endpointUrl = this.getProblemListReportByProviderIdUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }

  getProviderList<T>(ProviderId: any): Observable<T> {

    const endpointUrl = this.getProvidersListUrl + ProviderId;
    return this.http.post<T>(endpointUrl, ProviderId).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  getLocationsList<T>(LocationId: any): Observable<T> {

    const endpointUrl = this.getLocationsListUrl + LocationId;
    return this.http.post<T>(endpointUrl, LocationId).pipe(tap(data => {
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
    debugger;
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }


  getCQMReportsDashboard<T>(data: any): Observable<T> {
    debugger;
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  getCQMReportsPatientList<T>(data: any): Observable<T> {
    debugger;
    const endpointUrl = this.GetCQMReportsBySessionNameUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  getdownloadQRDA3Report<T>(ReportId: any): Observable<T> {
    debugger;
    const endpointUrl = this.DownloadQRDA3Report + ReportId;
    return this.http.post<T>(endpointUrl, ReportId).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
  CreateQueuedReport<T>(data: any): Observable<T> {
    debugger;
    const endpointUrl = this.CreateQueuedReportUrl;
    return this.http.post<T>(endpointUrl, data).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }






  //Handel Errors
  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error('serverside error', error.error);
    }
    return throwError(error.error.Message);
  };
  VerifyUserCreds<T>(data): Observable<T> {
    const endpointUrl = this.VerifyUserCredentialsUrl + '/' + data;
    return this.http.get<T>(endpointUrl).pipe(tap(data => {
      return data;
    }),
      catchError(this.handleError)
    );
  }
}
