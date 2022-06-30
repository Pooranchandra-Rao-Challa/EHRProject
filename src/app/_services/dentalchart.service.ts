import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DentalChartService extends APIEndPoint {
    constructor(http: HttpClient) { super(http); }

  ProcedureCodes(){
    return this._ProcessGetRequest<any>(this._procedureCodesUrl);
  }


  ProcedureCodesJSON(){
    return this._ProcessGetRequest<any>(this._procedureCodesForDentalUrl);
  }
}
