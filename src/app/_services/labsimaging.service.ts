import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LabsImagingService extends APIEndPoint {
    constructor(http: HttpClient) { super(http); }

    LabsDetails(reqparams: any) {
        return this._ProcessPostRequest<any>(this._labDetailsUrl,reqparams);
    }

      ImageDetails(reqparams: any) {
        return this._ProcessPostRequest<any>(this._imagingDetailsUrl,reqparams);
      }

}
