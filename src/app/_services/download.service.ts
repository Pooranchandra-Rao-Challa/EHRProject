import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import * as FileSaver from "file-saver";
import { User } from "../_models/_account/user";

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
  private jwtToken:string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.jwtToken = (JSON.parse(localStorage.getItem('user')) as User).JwtToken;
    this.headers = new HttpHeaders();
    this.headers = this.headers.append("Authorization",this.jwtToken);
  }
  getdownloadQRDA3Report<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA3Report + reqObj;


    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers })
      .subscribe(
        (res) => {


          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId + "-Medicaid");
        },
        (error) => {

        }
      );
  }

  getdownloadQRDA3MIPSReport<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA3MIPSReport;

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers  })
      .subscribe(
        (res) => {

          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId + "-MIPS-INDV");
        },
        (error) => {

        }
      );
  }
  getdownloadQRDA3<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA3;
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers  })
      .subscribe(
        (res) => {

          const blob = new Blob([res.body], {
            type: res.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, reqObj.ReportId);
        },
        (error) => {

        }
      );
  }
  getdownloadQRDA1Report<T>(reqObj: any) {
    const endpointUrl = this.DownloadQRDA1Report;
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "blob", headers : this.headers  })
      .subscribe(
        (data) => {

          const blob = new Blob([data.body], {
            type: data.headers.get("content-type"),
          });
          const url = window.URL.createObjectURL(blob);
          FileSaver.saveAs(url, "cqm_for_" + reqObj.ProviderName);
        },
        (error) => {

        }
      );
  }
  getdownloadPatientReport<T>(reqObj: any) {
    const endpointUrl = this.DownloadPatientReport;

    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers  })
      .subscribe(
        (data) => {
          const response = data.body;

          const blob = new Blob([response], {
            type: data.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document, reqObj.PatientId);
        },
        (error) => {
        }
      );
  }

  getDownloadData<T>(url, reqObj: any) {
    const endpointUrl = this.baseUrl + url;
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers  })
      .subscribe(
        (resp) => {
          const data = resp.body;
          const blob = new Blob([data], {
            type: resp.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document, reqObj.Id);
        },
        (error) => {
        }
      );
  }

  DownloadFile<T>(reqObj: any) {
    const endpointUrl = this.baseUrl + 'DownloadImportErrors';
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "text", headers : this.headers  })
      .subscribe(
        (resp) => {
          const data = resp.body;
          const blob = new Blob([data], {
            type: resp.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document, reqObj.ImportId);
        },
        (error) => {
        }
      );
  }


  DownloadAttachment<T>(reqObj: any) {
    const endpointUrl = this.baseUrl + 'DownloadAttachment';
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "arraybuffer", headers : this.headers  })
      .subscribe(
        (resp) => {
          const blob = new Blob([resp.body], {
            type: resp.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document, reqObj.FileName);
        },
        (error) => {
        }
      );
  }


  DownloadCCDAAttachment<T>(reqObj: any) {
    const endpointUrl = this.baseUrl + 'DownloadCCDA';
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "arraybuffer", headers : this.headers  })
      .subscribe(
        (resp) => {
          const blob = new Blob([resp.body], {
            type: resp.headers.get("content-type"),
          });
          const document = window.URL.createObjectURL(blob);
          FileSaver.saveAs(document, reqObj.FileName);
        },
        (error) => {
        }
      );
  }



  ViewAttachment(reqObj: any) {
    const endpointUrl = this.baseUrl + 'DownloadAttachment';
    this.http
      .post(endpointUrl, reqObj, { observe: "response", responseType: "arraybuffer", headers : this.headers  })
      .subscribe(
        (resp) => {
          const blob = new Blob([resp.body], {
            type: resp.headers.get("content-type"),
          });

          // Other Browsers
          const url = (window.URL || window.webkitURL).createObjectURL(blob);
          window.open(url, '_blank');

          // rewoke URL after 15 minutes
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 15 * 60 * 1000);
        },
        (error) => {
        }
      );
  }
  // ImagetoBase64String(reqparams: any){
  //   const endpointUrl = this.baseUrl + 'DownloadImage';
  //   return this._ProcessPostRequest<any>(this._imagetoBase64StringUrl, reqparams);
  // }

}
