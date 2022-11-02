import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient, HttpUrlEncodingCodec } from "@angular/common/http";
@Injectable()
export class Accountservice extends APIEndPoint {

  constructor(http: HttpClient) { super(http); }

  creatreport(reqdata) {
    return this._ProcessPostRequestWithHeaders<any>(this._creatReportUrl, reqdata);
  }

  GetProviders() {
    return this._ProcessGetRequest<any>(this._providersUrl);
  }
  GetDashBoardReport(reqdata) {
    return this._ProcessPostRequest<any>(this._dashBoardReportUrl, reqdata);
  }
  GetUserLogin(reqdata) {
    return this._ProcessPostRequest<any>(this._userLoginUrl, reqdata);
  }

  GetUserCreds() {
    return this._ProcessGetRequest<any>(this._readUserCredentialsUrl);
  }
  SetUserCreds() {
    return this._ProcessGetRequest<any>(this._updateUserCredentialsUrl);
  }

  GetNumeDenomicount(reqdata: any) {
    return this._ProcessPostRequest<any>(this._numeratorDenominatorCountUrl, reqdata);
  }
  getPatientList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._stage3MUPatients, reqdata);
  }

  getAllPatientList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._patientListtUrl, reqdata);
  }
  getEncountersList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._encountersListUrl, reqdata);
  }
  GetStage2NumeDenomiCount(reqdata: any) {
    return this._ProcessPostRequest<any>(this._stage2NumeratorDenominatorCountUrl, reqdata);
  }
  getStage2PatientList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._stage2PatientListUrl, reqdata);
  }
  getProblemListReportByProviderId(reqdata: any) {
    return this._ProcessPostRequest<any>(this._problemListReportByProviderIdUrl, reqdata);
  }

  getProviderList(reqdata: any) {
    const apiEndPoint = this._providersListUrl + reqdata.LocationId;
    return this._ProcessPostRequest<any>(apiEndPoint, reqdata);
  }


  getCQMReportsQueuedReports(reqdata: any) {
    return this._ProcessPostRequest<any>(this._queuedCQMReportsUrl, reqdata);
  }
  getCQMReportsDashboard(reqdata: any) {
    return this._ProcessPostRequest<any>(this._queuedCQMReportsUrl, reqdata);
  }
  getCQMReportsPatientList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._queuedCQMReportsUrl, reqdata);
  }

  CreateQueuedReport(reqdata: any) {
    return this._ProcessPostRequest<any>(this._createQueuedReportUrl, reqdata);
  }
  DrilldownViewConditions(reqdata: any) {
    return this._ProcessPostRequest<any>(this._drilldownViewConditionsUrl, reqdata);
  }
  VerifyUserCreds(reqdata) {
    const apiEndPoint = this._verifyUserCredentialsUrl + "/" + reqdata;
    return this._ProcessGetRequest<any>(apiEndPoint);
  }
  getProvidersLocationwise() {
    return this._ProcessGetRequest<any>(this._providersForLocation);
  }

  getCQMReportsMeasurePatientMetInfo(reqdata: any) {
    return this._ProcessPostRequest<any>(this._cqmReportMeasurePatientsUrl, reqdata);
  }


  // getPractiseLocations(reqdata: any) {
  //   return this._ProcessPostRequest<any>(this._practiseLocationsUrl, reqdata);
  // }

  PostProvdierAdminAccess(reqparams: any) {
    return this._ProcessPostRequest<any>(this._provdierAdminAccessUrl, reqparams);
  }

  getLocationsList(providerId: any) {
    const apiEndPoint = this._locationsListUrl + providerId;
    return this._ProcessPostRequest<any>(apiEndPoint, providerId);
  }

  VerifyAddress(addressLine: any) {
    return this._ProcessGetRequest<any>(this._addressVerificationUrl + "?addressLine=" + encodeURIComponent(addressLine));
  }

  RegisterNewProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerRegistrationUrl, reqparams);
  }

  CreateAdmin(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createAdminUrl, reqparams);
  }

  DeleteAdmin(reqparams: any) {
    return this._ProcessPostRequest<any>(this._deleteAdminUrl, reqparams);
  }

  EmailedUrls() {
    return this._ProcessGetRequest<any>(this._emailedUrlsUrl);
  }

  ProviderConfirmation(req: any) {
    let endpointurl: string = this._providerConfirmationUrl + "/?token=" + req.token;
    return this._ProcessGetRequest<any>(endpointurl);
  }

  CreatePartnerSignup(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createPartnerSignupUrl, reqparams);
  }

  CreateProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createProviderUrl, reqparams);
  }

  ResendValidationMail(reqparams: any) {
    return this._ProcessPostRequest<any>(this._resendValidationMailUrl, reqparams);
  }

  RaisePasswordChangeRequest(reqparams: any){
    return this._ProcessPostRequest<any>(this._raisePasswordChangeRequestUrl, reqparams);
  }

  CheckEmailAvailablity(creds: any) {
    return this.http.post<any>(this._checkEmailAvailablityUrl, creds);
  }

  ReleaseUserLock(reqparams: any){
    return this._ProcessPostRequest<any>(this._releaseUserLockUrl, reqparams);
  }
}
