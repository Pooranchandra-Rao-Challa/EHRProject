import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class AdminService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PracticeProviders(reqdata: any) {
    return this._ProcessPostRequest<any>(this._practiceProvidersUrl, reqdata);
  }
  GetProviderList() {
    return this._ProcessGetRequest<any>(this._providerListUrl);
  }
}