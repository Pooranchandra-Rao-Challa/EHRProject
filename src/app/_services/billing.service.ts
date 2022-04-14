import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class BillingService extends APIEndPoint {
constructor(http: HttpClient) { super(http); }

  BillingDetails(reqparams: any) {
    return this._ProcessGetRequest<any>(this._billingDetailsUrl + reqparams);
  }
}