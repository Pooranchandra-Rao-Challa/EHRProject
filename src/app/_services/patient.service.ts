import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class patientService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PatientsByProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientsByProviderUrl, reqparams);
  }

  FilteredPatientsOfProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._filteredPatientsOfProviderUrl, reqparams);
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
  CreateCareTeam(reqparams: any) {
    return this._ProcessPostRequest<any>(this._careTeamUrl, reqparams);
  }

  PatientsRelationByProviderId(reqparam:any)
  {
    return this._ProcessPostRequest<any>(this._patientsRelationByProviderIdUrl, reqparam);
  }

  PatientClinicProviders(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientClinicProviderUrl, reqparams);
  }

  ProblemDx(reqparams: any) {
    return this._ProcessPostRequest<any>(this._problemDxUrl, reqparams);
  }

  CareTeamByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._careTeamByPatientIdUrl, reqparams);
  }

  LabTestResultByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._labTestResultByPatientIdUrl, reqparams);
  }

  VitalStatsByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._vitalStatsByPatientIdUrl, reqparams);
  }

  CarePlanGoalInstructionsBypatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._carePlanGoalInstructionsBypatientIdUrl, reqparams);
  }

  ProcedureByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._ProcedureByPatientIdUrl, reqparams);
  }

  UpdatePatientInformation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updatePatientInformationUrl, reqparams);
  }

  UpdateContactInformation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateContactInformationUrl, reqparams);
  }

  UpdateEmergencyContact(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateEmergencyContactUrl, reqparams);
  }

  UpdateNextofkin(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateNextofkinUrl, reqparams);
  }

  UpdateDemographics(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateDemographicsUrl, reqparams);
  }

  UpdateImmunizationRegistry(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateImmunizationRegistryUrl, reqparams);
  }
  UpdateNotes(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateNotesUrl, reqparams);
  }
  ChartInfo(reqparams: any) {
    return this._ProcessPostRequest<any>(this._chartInfoUrl, reqparams);
  }

  // Regarding Insurance Screen Related  services

  SourceOfPaymentTypologyCodes() {
    return this._ProcessGetRequest<any>(this._sourceOfPaymentTypologyCodesUrl);
  }

  InsuranceCompanyPlans() {
    return this._ProcessGetRequest<any>(this._insuranceCompanyPlansUrl);
  }

  InsurancDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._insurancDetailsUrl, reqparams);
  }

  Insurance(reqparams: any) {
    return this._ProcessPostRequest<any>(this._insuranceUrl, reqparams);

  }
  CreateAdvancedDirectives(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createAdvancedDirectivesUrl, reqparams);
  }

  CreateSmokingStatus(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createSmokingStatusUrl, reqparams);
  }

  MyActivityLogs(reqparams: any) {
    return this._ProcessPostRequest<any>(this._activityLogsUrl, reqparams);
  }

  UpdatePatientMyprofile(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updatePatientProfileUrl, reqparams);
  }
}
