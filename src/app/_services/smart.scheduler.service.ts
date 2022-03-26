import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SmartSchedulerService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PracticeProviders(reqdata: any) {
    return this._ProcessPostRequest<any>(this._practiceProvidersUrl, reqdata);
  }

  SearchPatients(reqdata: any){
    console.log(reqdata);
    return this._ProcessPostRequest<any>(this._searchPatientsUrl,reqdata);
  }
}
