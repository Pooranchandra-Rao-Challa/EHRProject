import { Drug } from 'src/app/_services/rxnorm.api.service';
import { RxNormAPIService } from './rxnorm.api.service';
import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
import { Patient, PatientPortalUser} from 'src/app/_models';
import { CodeSystemGroup, MedicalCode } from '../_models/codes';
import { BehaviorSubject, of } from 'rxjs';
@Injectable()
export class UtilityService extends APIEndPoint {
  constructor(http: HttpClient,) { super(http); }

  States() {
    return this._ProcessGetRequest<any>(this._statesUrl);
  }
  Titles() {
    return this._ProcessGetRequest<any>(this._titlesUrl);
  }
  Specilaity() {
    return this._ProcessGetRequest<any>(this._specialityUrl);
  }
  Degree() {
    return this._ProcessGetRequest<any>(this._degreeUrl);
  }
  ProviderRoles() {
    return this._ProcessGetRequest<any>(this._providerRolesUrl);
  }
  AppointmentStatuses() {
    return this._ProcessGetRequest<any>(this._appointmentStatusesUtitlityUrl);
  }
  AppointmentTypes() {
    return this._ProcessGetRequest<any>(this._appointmentTypesUtilityUrl);
  }
  VerifyAddress(addressLine: any) {
    return this._ProcessGetRequest<any>(this._addressVerificationUrl + "?addressLine=" + encodeURIComponent(addressLine));
  }
  CreatePatient(patient: Patient){
    return this._ProcessPostRequest<any>(this._createPatinetUrl,patient);
  }
  CreatePatientAccount(patientAccount: PatientPortalUser ){
    return this._ProcessPostRequest<any>(this._createPatientAccountUrl,patientAccount);
  }
  MedicalCodes(searchTerm: string,codeSystem: string){
      return this._ProcessPostRequest<any>(this._medicalCodesUrl,{CodeSystem: codeSystem,SearchTerm: searchTerm});
  }
  LanguagesInfo()
  {
    return this._ProcessGetRequest<any>(this._languagesInfoUrl);
  }
  GetUserInfoForPatient(ppu: PatientPortalUser)
  {
    return this._ProcessPostRequest<any>(this._getUserInfoForPatientUrl,ppu);
  }

  CompletePatientAccountProcess(reqparams: any){
    return this._ProcessPostRequest<any>(this._completePatientAccountProcessUrl,reqparams);
  }

  AreaCodes()
  {
    return this._ProcessGetRequest<any>(this._areaCodesUrl);
  }
  OrderStatuses()
  {
    return this._ProcessGetRequest<any>(this._labImageStatusesUrl);
  }
  ResultStatuses()
  {
    return this._ProcessGetRequest<any>(this._labImageOrderStatusesUrl);
  }

  AmendmentStatuses()
  {
    return this._ProcessGetRequest<any>(this._amendmentStatusesUrl);
  }
  AmendmentSources()
  {
    return this._ProcessGetRequest<any>(this._amendmentSourcesUrl);
  }

  ProcedureStatues()
  {
    return this._ProcessGetRequest<any>(this._procedureStatuesUrl);
  }

  BlockoutFor()
  {
    return this._ProcessGetRequest<any>(this._blockoutForUrl);
  }
  ClinicsForAdmin(){
    return this._ProcessGetRequest<any>(this._clinicsForAdminUrl);
  }

  UpdateResetPassword(reqparams: any){
    return this._ProcessPostRequest<any>(this._updateResetPasswordURL,reqparams);
  }

  DrfirstProviderParams(providerId: string,patientId: string){
    if(patientId == null || patientId == '' || patientId == undefined)
      return this._ProcessGetRequestWithId<any>(this._drfirstProviderParamsURL,providerId);
    else
      return this._ProcessGetRequestWith2Params<any>(this._drfirstProviderParamsURL,providerId,patientId);
  }
  DrfirstPatient(providerId: string,patientId: string){
    return this._ProcessGetRequestWith2Params<any>(this._drfirstPatientURL,patientId,providerId);
  }

  UpdateDrFirstPatient(patientId:string,rcopiaId:number){
    return this._ProcessGetRequestWith2Params<any>(this._updateDrFirstPatientURL,patientId,rcopiaId.toString());
  }

  SendDrfirstPatient(data:any){
    return this._ProcessPostRequest<any>(this._sendDrfirstPatientURL,data);
  }
}
