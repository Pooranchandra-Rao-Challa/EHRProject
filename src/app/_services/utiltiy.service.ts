import { PatientData } from '../_models/_provider/_reports/patient';
import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
import { Patient } from './../_models/_account/newPatient';
@Injectable()
export class UtilityService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

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
  CreateNewPatient(patient: Patient){
    return this._ProcessPostRequest<any>(this._createNewPatientUrl,patient);
  }
  MedicalCodes(searchTerm: string,codeSystem: string){
    return this._ProcessPostRequest<any>(this._medicalCodesUrl,{CodeSystem: codeSystem,SearchTerm: searchTerm});
  }
  LanguagesInfo()
  {
    return this._ProcessGetRequest<any>(this._languagesInfoUrl);
  }
}
