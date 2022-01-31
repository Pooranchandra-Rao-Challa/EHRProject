import { Injectable } from "@angular/core";
import { Accountserviceendpoint } from "./account.endpoint.service";

@Injectable()
export class Accountservice {

  constructor(private accountEndpoint: Accountserviceendpoint) { }

  creatreport(data) {
    return this.accountEndpoint.Creatreport<any>(data);
  }
  GetProviders() {
    return this.accountEndpoint.GetAllProviders<any>();
  }
  GetDetailsReport(data: any) {
    return this.accountEndpoint.GetDetailsReport<any>(data);
  }
  GetSubDetailsReport(data: any) {
    return this.accountEndpoint.GetSubDetailsReport<any>(data);
  }
  GetReportByUserid() {

    return this.accountEndpoint.GetReportByUserid<any>();
  }
  GetBasicReportInfo(data) {
    return this.accountEndpoint.GetBasicReportInfo<any>(data);
  }
  GetDashBoardReport(data) {
    return this.accountEndpoint.GetDashBoardReport<any>(data);
  }
  GetUserLogin(data) {
    return this.accountEndpoint.GetUserLogin<any>(data);
  }
  GetUserCreds() {
    return this.accountEndpoint.GetUserCreds<any>();
  }
  SetUserCreds() {
    return this.accountEndpoint.SetUserCreds<any>();
  }

  GetNumeDenomicount(data: any) {
    return this.accountEndpoint.getNumerator<any>(data);
  }
  getPatientList(data: any) {
    return this.accountEndpoint.getPatientList<any>(data);
  }
  getAllPatientList(data: any) {
    return this.accountEndpoint.getAllPatientList<any>(data);
  }
  getEncountersList(data: any) {
    return this.accountEndpoint.getEncountersList<any>(data);
  }
  GetStage2NumeDenomiCount(data: any) {
    return this.accountEndpoint.getStage2NumeDenomiCount<any>(data);
  }
  getStage2PatientList(data: any) {
    return this.accountEndpoint.getStage2PatientList<any>(data);
  }
  getProblemListReportByProviderId(data: any) {
    return this.accountEndpoint.getProblemListReportByProviderId<any>(data);
  }

  getProviderList(ProviderId: any) {
    return this.accountEndpoint.getProviderList<any>(ProviderId);
  }
  getLocationsList(LocationId: any) {
    return this.accountEndpoint.getLocationsList<any>(LocationId);
  }
  getdownloadQRDA3Report(ReportId: any) {
    return this.accountEndpoint.getdownloadQRDA3Report<any>(ReportId);
  }

  // login
  // loginCredentials(Data:any){
  //     return this.accountEndpoint.loginCredentials<any>(Data);
  // }
  getCQMReportsQueuedReports(data: any) {
    debugger;
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }
  getCQMReportsDashboard(data: any) {
    debugger;
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }
  getCQMReportsPatientList(data: any) {
    debugger;
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }

  CreateQueuedReport(data: any) {
    debugger;
    return this.accountEndpoint.CreateQueuedReport<any>(data);
  }
  VerifyUserCreds(data) {
    return this.accountEndpoint.VerifyUserCreds<any>(data);
  }
  getProvidersLocationwise() {
    debugger;
    return this.accountEndpoint.getProvidersLocationwise<any>();
  }

}
