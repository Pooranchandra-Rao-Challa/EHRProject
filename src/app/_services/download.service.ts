import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

import * as FileSaver from "file-saver";

@Injectable()
export class DownloadService {
  baseUrl: string = environment.baseUrl;
  private readonly DownloadQRDA3Report =
    this.baseUrl + "CQMReports/DownloadQRDA3MedicaidReport?ReportId=";
  private readonly DownloadQRDA1Report =
    this.baseUrl + "CQMReports/DownloadQRDA1Report";
  private readonly DownloadPatientReport =
    this.baseUrl + "CQMReports/QRDAPatientDownloadReport";
  private readonly DownloadQRDA3MIPSReport =
    this.baseUrl + "CQMReports/DownloadQRDA3MIPSReport";
  private readonly DownloadQRDA3 =
    this.baseUrl + "CQMReports/DownloadQRDA3Report";

  constructor(private http: HttpClient) {

  }
  getdownloadQRDA3Report<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA3Report + reqObj;
    // const reportid = reqObj;
    console.log(endpointUrl);

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text" })
      .subscribe(
        (res) => {

          //console.log(data1);

          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId + "-Medicaid");
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getdownloadQRDA3MIPSReport<T>(reqObj: any) {
    debugger;
    const endpointUrl = this.DownloadQRDA3MIPSReport;
    // const reportid = reqObj;
    console.log(endpointUrl);

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text" })
      .subscribe(
        (res) => {

          //console.log(data1);

          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId + "-MIPS-INDV");
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getdownloadQRDA3<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA3;
    // const reportid = reqObj;
    console.log(endpointUrl);

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text" })
      .subscribe(
        (res) => {

          //console.log(data1);

          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getdownloadQRDA1Report<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA1Report;
    console.log(endpointUrl);

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "blob" })
      .subscribe(
        (data) => {
          console.log(data);
          const blob = new Blob([data.body], {
            type: data.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, "cqm_for_" + reqObj.ProviderName);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getdownloadPatientReport<T>(reqObj: any) {
    const endpointUrl = this.DownloadPatientReport;
    // const reportid = reqObj;
    console.log(endpointUrl);
    // endpointUrl = "http://183.82.111.111/EHRCQMReports/API/CQMReports/QRDAIndividualPatientDownloadReport?ReportId=90&MeasureSetId=1824&PatientId=598887a8bc6117675962fd7c"

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text" })
      .subscribe(
        (data) => {
          const data1 = data.body;
          console.log(data1);

          const blob = new Blob([data1], {
            type: data.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.PatientId);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
