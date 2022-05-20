import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class patientService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PatientsByProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientsByProviderUrl, reqparams);
  }

  // AdvancedDirectives(reqparams: any) {
  //   return this._ProcessPostRequest<any>(this._advancedDirectivesUrl, reqparams);
  // }

  // AllDiagnoses(reqparams: any) {
  //   return this._ProcessPostRequest<any>(this._allDiagnosesUrl, reqparams);
  // }

  // AllAllergies(reqparams: any) {
  //   return this._ProcessPostRequest<any>(this._allAllergiesUrl, reqparams);
  // }
}
