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
    debugger;
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

  getProviderList(req: any) {
    return this.accountEndpoint.getProviderList<any>(req);
  }
  getLocationsList(LocationId: any) {
    return this.accountEndpoint.getLocationsList<any>(LocationId);
  }

  // login
  // loginCredentials(Data:any){
  //     return this.accountEndpoint.loginCredentials<any>(Data);
  // }
  getCQMReportsQueuedReports(data: any) {
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }
  getCQMReportsDashboard(data: any) {
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }
  getCQMReportsPatientList(data: any) {
    return this.accountEndpoint.getCQMReportsQueuedReports<any>(data);
  }

  CreateQueuedReport(data: any) {
    return this.accountEndpoint.CreateQueuedReport<any>(data);
  }
  DrilldownViewConditions(data: any) {
    return this.accountEndpoint.DrilldownViewConditions<any>(data);
  }
  VerifyUserCreds(data) {
    return this.accountEndpoint.VerifyUserCreds<any>(data);
  }
  getProvidersLocationwise() {
    return this.accountEndpoint.getProvidersLocationwise<any>();
  }

  getCQMReportsMeasurePatientMetInfo(cmscoditions_data: any) {
    return this.accountEndpoint.getCQMReportsMeasurePatientMetInfo<any>(cmscoditions_data);
  }


}
