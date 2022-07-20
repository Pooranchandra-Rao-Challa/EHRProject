import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LabsImagingService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  LabsDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._labDetailsUrl, reqparams);
  }

  ImageDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._imagingDetailsUrl, reqparams);
  }

  CreateLabOrImagingOrder(reqdata: any){
    return this._ProcessPostRequest<any>(this._createLabOrImagingOrderUrl, reqdata);
  }

  LabandImageList(reqparams: any) {
    return this._ProcessPostRequest<any>(this._labandImageListUrl, reqparams);
  }
  LabImageOrderNumberList(reqparams: any){
    return this._ProcessPostRequest<any>(this._labImageOrderNumberListUrl, reqparams);
  }
}
