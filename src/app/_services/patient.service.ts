import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class patientService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PatientsByProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientsByProviderUrl, reqparams);
  }

  AdvancedDirectivesByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._advancedDirectivesByPatientIdUrl, reqparams);
  }

  DiagnosesByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._diagnosesByPatientIdUrl, reqparams);
  }

  AllergiesByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._allergiesByPatientIdUrl, reqparams);
  }

  PastMedicalHistoriesByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._pastMedicalHistoriesByPatientIdUrl, reqparams);
  }

  ImmunizationsByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._immunizationsByPatientIdUrl, reqparams);
  }

  MedicationsByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._medicationsByPatientIdUrl, reqparams);
  }

  EncountersByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._encountersByPatientIdUrl, reqparams);
  }

  AppointmentsByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._appointmentsByPatientIdUrl, reqparams);
  }

  PatientMyProfileByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientMyProfilreUrl, reqparams);
  }

  SmokingStatusByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._smokingStatusByPatientIdUrl, reqparams);
  }

  TobaccoUseScreenings(reqparams: any) {
    return this._ProcessPostRequest<any>(this._tobaccoUseScreeningsUrl, reqparams);
  }

  TobaccoUseInterventions(reqparams: any) {
    return this._ProcessPostRequest<any>(this._tobaccoUseInterventionsUrl, reqparams);
  }
  CreateCareTeam(reqparams:any)
  {
    return this._ProcessPostRequest<any>(this._careTeamUrl, reqparams);
  }

  CareTeamByPatientId(reqparam:any)
  {
    return this._ProcessPostRequest<any>(this._careTeamByPatientIdUrl, reqparam);
  }
  LanguagesInfo()
  {
    return this._ProcessGetRequest<any>(this._languagesInfoUrl);
  }
  PatientsRelationByProviderId(reqparam:any)
  {
    return this._ProcessPostRequest<any>(this._patientsRelationByProviderIdUrl, reqparam);
  }
}
