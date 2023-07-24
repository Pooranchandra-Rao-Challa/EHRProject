import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class AdminService extends APIEndPoint {
  constructor(public http: HttpClient) { super(http); }

  AdminList(){
    return this._ProcessGetRequest<any>(this._adminListUrl);
  }
  GetProviderList() {
    return this._ProcessGetRequest<any>(this._providerListUrl);
  }
  ActivePatients(reqparams: any) {
    return this._ProcessPostRequest<any>(this._activePatientsUrl, reqparams);
  }

  InActivePatients(reqparams: any) {
    return this._ProcessPostRequest<any>(this._inActivePatientsUrl, reqparams);
  }
  DefaultMessages() {
    return this._ProcessGetRequest<any>(this._defaultMessagesUrl);
  }

  AdminImportedPatientEncounter() {
    return this._ProcessGetRequest<any>(this._adminImportedPatientEncounterUrl);
  }

  WeeklyUpdateList(){
    return this._ProcessGetRequest<any>(this._weeklyUpdateUrl);
  }

  UpdateLockedUser(reqparams: any){
  return this._ProcessPostRequest<any>(this._updateLockedUserUrl, reqparams);
  }

  UpdateAccessProvider(reqparams: any){
  return this._ProcessPostRequest<any>(this._updateAccessProviderUrl, reqparams);
  }

  UpdatedTrailStatus(reqparam:any){
  return this._ProcessPostRequest<any>(this._updatedTrailStatusUrl, reqparam);
  }

  AddUpdateWeeklyUpdated(reqparams:any){
    return this._ProcessPostRequest<any>(this._addUpdatedWeeklyUpdated, reqparams);
  }

  UpdateWeeklyStaus(reqparams:any){
    return this._ProcessPostRequest<any>(this._updateWeeklyStaus, reqparams);
  }

  DeleteWeeklyStatus(reqparam:any){
    return this._ProcessPostRequest<any>(this._deleteWeeklyStatus, reqparam);
  }

  SwitchUserKey(reqparam:any){
    return this._ProcessPostRequest<any>(this._switchUserKeyUrl, reqparam);
  }

  SwitchToPatientUserKey(reqparam:any){
    return this._ProcessPostRequest<any>(this._switchToPatientUserKeyUrl, reqparam);
  }

  UpdateDefaultMessage(reqparams:any){
    return this._ProcessPostRequest<any>(this._updateDefaultMessageUrl, reqparams);
  }

  ImportData(reqparams:any){
    return this._ProcessPostRequest<any>(this._importDataUrl, reqparams);
  }

  GetAdminSettingVersion()
  {
    return this._ProcessGetRequesWithoutHeader<any>(this._getAdminVersionUrl);
  }

  UpdateAdminSettingVersion(reqparams:any)
  {
    return this._ProcessPostRequest<any>(this._updateAdminVersionUrl,reqparams);
  }

  CommunicationSetting(){
    return this._ProcessGetRequest<any>(this._communicationSettingURL);
  }

  UpdateCommunicationSetting(reqparams: any){
    return this._ProcessPostRequest<any>(this._updateCommunicationSettingURL,reqparams);
  }

  ResetMFA(userId){
    return this._ProcessGetRequestWithId<any>(this._resetMFAURL,userId);
  }
  EnableMFA(userId){
    return this._ProcessGetRequestWithId<any>(this._enableMFAURL,userId);
  }
  DisableMFA(userId){
    return this._ProcessGetRequestWithId<any>(this._disableMFAURL,userId);
  }
}
