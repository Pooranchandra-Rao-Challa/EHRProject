import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DentalChartService extends APIEndPoint {
    constructor(http: HttpClient) { super(http); }

  ProcedureCodes(){
    return this._ProcessGetRequest<any>(this._procedureCodesUrl);
  }


  ProcedureCodesJSON(term){
    let url = this._procedureCodesForDentalUrl+"?searchTerm="+term;
    return this._ProcessGetRequest<any>(url);
  }

  PatientUsedProcedures(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientUsedProceduresUrl, reqparams);
  }


  PatientProcedureView(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientProceduresViewUrl, reqparams);
  }

  CancelProcedure(reqparams: any){
    return this._ProcessPostRequest<any>(this._cancelProcedureUrl, reqparams);
  }
}
