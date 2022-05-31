import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class AdminService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  AdminList(){
    return this._ProcessGetRequest<any>(this._adminListUrl);
  }
  GetProviderList() {
    return this._ProcessGetRequest<any>(this._providerListUrl);
  }
  ActivePatients(reqparams: any) {
    return this._ProcessPostRequest<any>(this._activePatientsUrl, reqparams);
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
}
