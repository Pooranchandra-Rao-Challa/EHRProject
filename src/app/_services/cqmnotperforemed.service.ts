import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CQMNotPerformedService extends APIEndPoint {
    constructor(http: HttpClient) { super(http); }

    CQMNotPerformed(reqparam: any) {
      return this._ProcessPostRequest<any>(this._cqmNotPerformedUrl,reqparam);
    }

    InterventaionDetails(){
      return this._ProcessGetRequest<any>(this._interventaionDetailsUrl);
    }

    AddUpdateCQMNotPerformed(reqparams:any){
      return this._ProcessPostRequest<any>(this._addUpdateCQMNotPerformedUrl,reqparams);
    }
}
