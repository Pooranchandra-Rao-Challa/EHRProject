import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CQMNotPerformedService extends APIEndPoint {
    constructor(http: HttpClient) { super(http); }

    CQMNotPerformed(reqparam: any) {
      return this._ProcessPostRequest<any>(this._cqmNotPerformedUrl,reqparam);
    }
}
