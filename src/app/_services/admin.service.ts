import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class AdminService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  GetProviderList() {
    return this._ProcessGetRequest<any>(this._providerListUrl);
  }
  GetAllActivePatientsList() {
    return this._ProcessGetRequest<any>(this._AllActivepatientsUrl);
  }
  GetAllInActivePatientsList() {
    return this._ProcessGetRequest<any>(this._AllInActivepatientsUrl);
  }
  
}
