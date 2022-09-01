import { SearchPatient } from './../_models/_provider/smart.scheduler.data';
import { EncounterInfo } from './../_models/_provider/encounter';
import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class PatientService extends APIEndPoint {
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

  TobaccoUseByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._tobaccoUseByPatientIdUrl, reqparams);
  }

  CreateCareTeam(reqparams: any) {
    return this._ProcessPostRequest<any>(this._careTeamUrl, reqparams);
  }

  PatientsRelationByProviderId(reqparam: any) {
    return this._ProcessPostRequest<any>(this._patientsRelationByProviderIdUrl, reqparam);
  }

  PatientProviders(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientProviderUrl, reqparams);
  }

  PatientLocations(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientLocationUrl, reqparams);
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
  CreateEncounter(reqparams: EncounterInfo) {
    return this._ProcessPostRequest<any>(this._createEncounterUrl, reqparams);
  }

  EncounterView(reqparams: any) {
    return this._ProcessPostRequest<any>(this._encounterViewUrl, reqparams);
  }

  CreateUpdateInsuranceCompanyPlan(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createUpdateInsuranceCompanyPlanUrl, reqparams);
  }

  DeleteInsuranceCampanyplan(reqparams: any) {
    return this._ProcessPostRequest<any>(this._deleteInsuranceCampanyplanUrl, reqparams);
  }

  CreateUpdateInsuranceDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createUpdateInsuranceDetailsUrl, reqparams);
  }

  CreatePastMedicalHistories(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createPastMedicalHistoriesUrl, reqparams);
  }

  CreateFamilyHealthHistories(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createFamilyHealthHistoriesUrl, reqparams);
  }

  CreateAllergies(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createAllergiesUrl, reqparams);
  }

  CreateDiagnoses(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createDiagnosesUrl, reqparams);
  }

  CreateMedication(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createMedicationUrl, reqparams);
  }

  CreateImmunizationsAdministered(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createImmunizationsAdministeredUrl, reqparams);
  }

  CreateImmunizationsHistorical(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createImmunizationsHistoricalUrl, reqparams);
  }

  CreateImmunizationsRefused(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createImmunizationsRefusedUrl, reqparams);
  }

  CreateTobaccoUse(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createTobaccoUseUrl, reqparams);
  }

  Vaccines(reqparams: any) {
    return this._ProcessPostRequest<any>(this._vaccinesUrl, reqparams);
  }

  SearchInterventionCodes(reqparams: any) {
    return this._ProcessPostRequest<any>(this._searchInterventionCodesUrl, reqparams);
  }

  AllergyNames(reqparams: any) {
    return this._ProcessPostRequest<any>(this._allergyNamesUrl, reqparams);
  }

  CreateInterventions(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createInterventionsUrl, reqparams);
  }

  InterventionsByPatientId(reqparams: any) {
    return this._ProcessPostRequest<any>(this._interventionsByPatientIdUrl, reqparams);
  }

  LatestUpdatedPatientsUrl(reqparams: any) {
    return this._ProcessPostRequest<any>(this._latestUpdatedPatientsUrl, reqparams);
  }

  PatientPastAppointments(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientPastAppointmentsUrl, reqparams);
  }

  PatientUpcomingAppointments(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientUpcomingAppointmentsUrl, reqparams)
  }
  PatientAccountInfo(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientAccountInfoUrl, reqparams);
  }

  CreateProcedure(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createProcedureUrl, reqparams);
  }
  GetPatientMessages(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientMessagesUrl, reqparams);
  }

  AmendmentDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._amendmentDetailsUrl, reqparams);

  }
  CreateupdateAmendment(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createupdateAmendmentUrl, reqparams);

  }
  DeleteAmendment(reqparams: any) {
    return this._ProcessPostRequest<any>(this._deleteAmendmentUrl, reqparams);
  }
  DeleteDiagnoses(reqparams: any) {
    return this._ProcessPostRequest<any>(this._deleteDiagnosesUrl, reqparams);
  }

  PatientSearch(reqparams: any) {
    return this._ProcessPostRequest<any>(this._patientSearchUrl, reqparams);
  }
  RequestPatientAppointment(reqparams: any)
  {
    return this._ProcessPostRequest<any>(this._requestPatientAppointmentUrl,reqparams);
  }

  CancelPatientAppoinment(reqparams: any)
  {
    return this._ProcessPostRequest<any>(this._cancelPatientAppoinmentUrl,reqparams);
  }
  MyProfileSecurityQuestion(reqparms: any)
  {
    return this._ProcessPostRequest<any>(this._patientMyProfileSecurityQuestionUrl,reqparms);
  }

  UpdatePatientMyProfileSecurityQuestion(reqParams: any)
  {
    return this._ProcessPostRequest<any>(this._updatePatientMyProfileSecurityQuestionUrl,reqParams);
  }
  CreateAuthorizedRepresentative(reqParams: any)
  {
    return this._ProcessPostRequest<any>(this._createAuthorizedRepresentativeUrl,reqParams);
  }
}
