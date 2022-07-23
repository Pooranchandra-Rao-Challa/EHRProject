import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { EndpointBase } from "./endpoint.base.service";

@Injectable()
export class APIEndPoint extends EndpointBase {
  _baseUrl: string = environment.baseUrl;

  get _providersForLocation() {
    return this._baseUrl + "CQMReports/ProvidersForLocation";
  }
  get _numeratorDenominatorCountUrl() {
    return this._baseUrl + "GetNumeDenomicount";
  }
  get _stage3MUPatients() {
    return this._baseUrl + "Stage3MUPatients";
  }
  get _patientListtUrl() {
    return this._baseUrl + "PatientList";
  }
  get _encountersListUrl() {
    return this._baseUrl + "GetEncountersList";
  }
  get _stage2NumeratorDenominatorCountUrl() {
    return this._baseUrl + "GetStage2NumeDenomiCount";
  }
  get _stage2PatientListUrl() {
    return this._baseUrl + "GetStage2SessionwiseMUReports";
  }
  get _problemListReportByProviderIdUrl() {
    return this._baseUrl + "GetProblemList";
  }
  get _providersListUrl() {
    return this._baseUrl + "GetProvidersList?Location_Id=";
  }
  get _locationsListUrl() {
    return this._baseUrl + "GetLocationsList?provider_Id=";
  }
  get _verifyUserCredentialsUrl() {
    return this._baseUrl + "VerifyUserCredentials";
  }
  get _creatReportUrl() {
    return this._baseUrl + "Creatreport";
  }
  get _providersUrl() {
    return this._baseUrl + "GetProviders";
  }
  get _dashBoardReportUrl() {
    return this._baseUrl + "GetDashBoardReport";
  }
  get _userLoginUrl() {
    return this._baseUrl + "UserLogin";
  }
  get _updateUserCredentialsUrl() {
    return this._baseUrl + "SetUserCredentials";
  }
  get _readUserCredentialsUrl() {
    return this._baseUrl + "GetUserCredentials";
  }

  get _cqmReportMeasurePatientsUrl() {
    return this._baseUrl + "CQMReports/CQMReportMeasurePatients";
  }

  get _cqmReportsUrl() {
    return this._baseUrl + "CQMReports/CQMReports";
  }
  get _createQueuedReportUrl() {
    return this._baseUrl + "CQMReports/CreateQueuedReport";
  }

  get _drilldownViewConditionsUrl() {
    return this._baseUrl + "CQMReports/DrilldownViewConditions";
  }
  get _practiseLocationsUrl() {
    return this._baseUrl + "GetLocationsList?Provider_Id";
  }
  get _displayDateTimeOfZoneUrl() {
    return this._baseUrl + "DisplayDateTimeOfZone";
  }
  get _listOfTimeZoneUrl() {
    return this._baseUrl + "GetTimeZone";
  }

  get _addressVerificationUrl() {
    return this._baseUrl + "VerifyAddress";
  }
  get _provdierAdminAccessUrl() {
    return this._baseUrl + "CQMReports/TimeZoneList";
  }
  get _addUpdateLocationUrl() {
    return this._baseUrl + "AddUpdateLocation";
  }
  get _locationByIdUrl() {
    return this._baseUrl + "GetLocationById?id";
  }
  get _providerDetailsUrl() {
    return this._baseUrl + "GetProviderListByLocation";
  }
  get _providerRegistrationUrl() {
    return this._baseUrl + "RegisterNewProvider";
  }

  get _appointmentTypesUrl() {
    return this._baseUrl + "AppointmentTypes";
  }

  get _appointmentStatusesUrl() {

    return this._baseUrl + "AppointmentStatuses";
  }

  get _roomsforLocationUrl() {

    return this._baseUrl + "RoomsForLocation";
  }

  get _addUpdateUserUrl() {
    return this._baseUrl + "AddUpdateUser";
  }

  get _addUpdateAppointmentStatusUrl() {
    return this._baseUrl + "AddUpdateAppointmentStatus";
  }

  get _addUpdateAppointmentTypeUrl() {
    return this._baseUrl + "AddUpdateAppointmentType";
  }

  get _addUpdateRoomUrl() {
    return this._baseUrl + "AddUpdateRoom";
  }

  get _dropAppointmentTypeUrl() {
    return this._baseUrl + "DropAppointmentType";
  }

  get _dropAppointmentStatusUrl() {
    return this._baseUrl + "DropAppointmentStatus";
  }

  get _dropRoomUrl() {
    return this._baseUrl + "DropRoom";
  }

  get _updateProviderAdmineAccessUrl() {
    return this._baseUrl + "UpdateProviderAdminAccess";
  }
  get _userInfoWithPraceticeLocations() {
    return this._baseUrl + "UserInfoWithPracticeLocations";
  }

  get _authenticatePatientUrl() {
    return this._baseUrl + "AuthenticatePatient";
  }

  get _statesUrl() {
    return this._baseUrl + "States";
  }

  get _titlesUrl() {
    return this._baseUrl + "Titles";
  }

  get _specialityUrl() {
    return this._baseUrl + "Speciality";
  }

  get _degreeUrl() {
    return this._baseUrl + "Degree";
  }

  get _providerRolesUrl() {
    return this._baseUrl + "ProviderRoles";
  }

  get _appointmentStatusesUtitlityUrl() {
    return this._baseUrl + "AppointmentStatusesUtility";
  }

  get _appointmentTypesUtilityUrl() {
    return this._baseUrl + "AppointmentTypesUtility";
  }

  get _practiceProvidersUrl() {
    return this._baseUrl + "PracticeProviders";
  }
  get _createPatinetUrl() {
    return this._baseUrl + "CreatePatinet";
  }
  get _providerStaffUrl() {
    return this._baseUrl + "ProviderStaff";
  }
  get _individualProvidersUrl() {
    return this._baseUrl + "IndividualProviders";
  }

  get _searchPatientsUrl() {
    return this._baseUrl + "SearchPatients";
  }
  get _toggleUserFieldValuesUrl() {
    return this._baseUrl + "ToggleUserFieldValues";
  }

  get _activeAppointmentsUrl() {
    return this._baseUrl + "ActiveAppointments";
  }

  get _roomsForLocationUrl() {
    return this._baseUrl + "RoomsForLocation";
  }

  get _availableTimeSlotsUrl() {
    return this._baseUrl + "AvailableTimeSlots";
  }

  get _createAppointmentUrl() {
    return this._baseUrl + "CreateAppointment";
  }

  get _providerListUrl() {
    return this._baseUrl + "ProviderList";
  }




  get _billingDetailsUrl() {
    return this._baseUrl + "BillingList";
  }

  get _labDetailsUrl() {
    return this._baseUrl + "LabsList";
  }

  get _imagingDetailsUrl() {
    return this._baseUrl + "ImagingsList";
  }

  get _activePatientsUrl() {
    return this._baseUrl + "ActivePatients";
  }

  get _inActivePatientsUrl() {
    return this._baseUrl + "InActivePatients";
  }

  get _patientsByProviderUrl() {
    return this._baseUrl + "PatientsByProvider";
  }

  get _filteredPatientsOfProviderUrl() {
    return this._baseUrl + "FilteredPatientsOfProvider";
  }
  get _adminListUrl() {
    return this._baseUrl + "Admins";
  }

  get _generalScheduleUrl() {
    return this._baseUrl + "GeneralSchedule";
  }

  get _updateRescheduleUrl() {
    return this._baseUrl + "UpdateSchedulegeneral";
  }


  get _providerConfirmationUrl() {
    return this._baseUrl + "ProviderConfirmation";
  }

  get _auditLogsUrl() {
    return this._baseUrl + "AuditLogs";
  }

  get _educationMaterialsUrl() {
    return this._baseUrl + "EducationMaterials";
  }

  get _clinicalDecisionSupportUrl() {
    return this._baseUrl + "ClinicalDecisionSupport";
  }

  get _erxUrl() {
    return this._baseUrl + "Erx";
  }

  get _weeklyUpdateUrl() {
    return this._baseUrl + "WeeklyUpdate";
  }

  get _defaultMessagesUrl() {
    return this._baseUrl + "DefaultMessages";
  }

  get _adminImportedPatientEncounterUrl() {
    return this._baseUrl + "AdminImportedPatientEncounter";
  }

  get _updateLockedUserUrl() {
    return this._baseUrl + "UpdateLockedUser";
  }

  get _updateAccessProviderUrl() {
    return this._baseUrl + "UpdateAccessProvider";
  }
  get _updatedTrailStatusUrl() {
    return this._baseUrl + "UpdatedTrailStatus";
  }

  get _medicalCodesUrl() {
    return this._baseUrl + "MedicalCodes";

  }

  get _updateTimeZoneUrl() {
    return this._baseUrl + "UpdateTimeZone";
  }

  get _deleteLocationUrl() {
    return this._baseUrl + "DeleteLocation";
  }

  get _addUpdatedWeeklyUpdated() {
    return this._baseUrl + "AddUpdatedWeeklyUpdated";
  }
  get _updateWeeklyStaus() {
    return this._baseUrl + "UpdatedWeeklyStatus";
  }
  get _deleteWeeklyStatus() {
    return this._baseUrl + "DeleteWeeklyStatus";
  }

  // get _advancedDirectivesUrl() {
  //   return this._baseUrl + "AdvancedDirectives";
  // }
  get _advancedDirectivesByPatientIdUrl() {
    return this._baseUrl + "AdvancedDirectivesByPatientId";
  }

  get _diagnosesByPatientIdUrl() {
    return this._baseUrl + "DiagnosesByPatientId";
  }

  get _allergiesByPatientIdUrl() {
    return this._baseUrl + "AllergiesByPatientId";
  }

  get _pastMedicalHistoriesByPatientIdUrl() {
    return this._baseUrl + "PastMedicalHistoriesByPatientId";
  }

  get _immunizationsByPatientIdUrl() {
    return this._baseUrl + "ImmunizationsByPatientId";
  }

  get _medicationsByPatientIdUrl() {
    return this._baseUrl + "MedicationsByPatientId";
  }

  get _encountersByPatientIdUrl() {
    return this._baseUrl + "EncountersByPatientId";
  }

  get _appointmentsByPatientIdUrl() {
    return this._baseUrl + "AppointmentsByPatientId";
  }

  get _patientMyProfilreUrl() {
    return this._baseUrl + "PatientMyProfile";
  }

  get _procedureCodesUrl() {
    return this._baseUrl + "DentalProcedureCodes";
  }

  get _smokingStatusByPatientIdUrl() {
    return this._baseUrl + "SmokingStatusByPatientId";
  }

  get _tobaccoUseScreeningsUrl() {
    return this._baseUrl + "TobaccoUseScreenings";
  }

  get _tobaccoUseInterventionsUrl() {
    return this._baseUrl + "TobaccoUseInterventions";
  }
  get _patientProviderUrl() {
    return this._baseUrl + "PracticeProviders";
  }
  get _patientLocationUrl() {
    return this._baseUrl + "PatientClinic";
  }

  get _problemDxUrl() {
    return this._baseUrl + "ProblemsDx";
  }
  get _careTeamByPatientIdUrl() {
    return this._baseUrl + "CareTeamByPatientId";
  }

  get _careTeamUrl() {
    return this._baseUrl + "CreateCareTeam";
  }

  get _languagesInfoUrl() {
    return this._baseUrl + "LanguagesInfo";
  }

  get _patientsRelationByProviderIdUrl() {
    return this._baseUrl + "PatientsRelationByProviderId";
  }
  get _labTestResultByPatientIdUrl() {
    return this._baseUrl + "LabTestResultByPatientId";
  }

  get _vitalStatsByPatientIdUrl() {
    return this._baseUrl + "VitalStatsByPatientId";
  }

  get _carePlanGoalInstructionsBypatientIdUrl() {
    return this._baseUrl + "CarePlanGoalInstructionsBypatientId";
  }

  get _ProcedureByPatientIdUrl() {
    return this._baseUrl + "ProcedureByPatientId";
  }

  // Regarding Insurance Screen Related apiendpoint services

  get _sourceOfPaymentTypologyCodesUrl() {
    return this._baseUrl + "SourceOfPaymentTypologyCodes";
  }

  get _insuranceCompanyPlansUrl() {
    return this._baseUrl + "InsuranceCompanyPlans";
  }

  get _insurancDetailsUrl() {
    return this._baseUrl + "InsurancDetails";
  }

  get _insuranceUrl() {
    return this._baseUrl + "Insurance";

  }
  get _createAdvancedDirectivesUrl() {
    return this._baseUrl + "CreateAdvancedDirectives";
  }
  get _createPartnerSignupUrl() {
    return this._baseUrl + "CreatePartnerSignup";
  }

  get _createSmokingStatusUrl() {
    return this._baseUrl + "CreateSmokingStatus";
  }

  get _updatePatientInformationUrl() {
    return this._baseUrl + "UpdatePatientInformation";
  }

  get _updateContactInformationUrl() {
    return this._baseUrl + "UpdateContactInformation";
  }

  get _updateEmergencyContactUrl() {
    return this._baseUrl + "UpdateEmergencyContact";
  }

  get _emailedUrlsUrl() {
    return this._baseUrl + "EmailedUrls";
  }

  get _updateNextofkinUrl() {
    return this._baseUrl + "UpdateNextofkin";
  }

  get _updateDemographicsUrl() {
    return this._baseUrl + "UpdateDemographics";
  }

  get _updateImmunizationRegistryUrl() {
    return this._baseUrl + "UpdateImmunizationRegistry";
  }

  get _activityLogsUrl() {
    return this._baseUrl + "ActivityLogByPatient";
  }
  get _updateNotesUrl() {
    return this._baseUrl + "UpdateNotes";
  }
  get _chartInfoUrl() {
    return this._baseUrl + "ChartInfo";
  }
  get _createEncounterUrl() {
    return this._baseUrl + "CreateEncounter";
  }

  get _encounterViewUrl() {
    return this._baseUrl + "EncounterView";
  }

  get _createUpdateInsuranceCompanyPlanUrl() {
    return this._baseUrl + "CreateInsurancePlan";
  }


  get _deleteInsuranceCampanyplanUrl() {
    return this._baseUrl + "DeleteInsuranceCampanyplan";
  }

  get _createUpdateInsuranceDetailsUrl() {
    return this._baseUrl + "CreateUpdateInsuranceDetails";
  }

  get _createPastMedicalHistoriesUrl() {
    return this._baseUrl + "CreatePastMedicalHistories";
  }

  get _createAllergiesUrl() {
    return this._baseUrl + "CreateAllergies";
  }

  get _createDiagnosesUrl() {
    return this._baseUrl + "CreateDiagnoses";
  }

  get _createMedicationUrl() {
    return this._baseUrl + "CreateMedications";
  }

  get _createImmunizationsAdministeredUrl() {
    return this._baseUrl + "CreateImmunizationsAdministered";
  }

  get _createImmunizationsHistoricalUrl() {
    return this._baseUrl + "CreateImmunizationsHistorical";
  }

  get _createImmunizationsRefusedUrl() {
    return this._baseUrl + "CreateImmunizationsRefused";
  }

  get _vaccinesUrl() {
    return this._baseUrl + "Vaccines";
  }

  get _allergyNamesUrl() {
    return this._baseUrl + "AllergyNames";
  }

  get _changePasswordsUrl() {
    return this._baseUrl + "ChangePassword";
  }

  // Update for patient My Profile
  get _updatePatientProfileUrl() {
    return this._baseUrl + "UpdatePatientProfile";
  }

  get _createPatientAccountUrl() {
    return this._baseUrl + "CreatePatientAccount";
  }

  get _cqmNotPerformedUrl() {
    return this._baseUrl + "CQMNotPerformed";
  }
  get _interventaionDetailsUrl() {
    return this._baseUrl + "InterventaionDetails";
  }

  get _addUpdateCQMNotPerformedUrl() {
    return this._baseUrl + "AddUpdatedCQMNotPerformed";
  }

  get _latestUpdatedPatientsUrl() {
    return this._baseUrl + "LatestUpdatedPatients";
  }
  get _patientAccountInfoUrl() {
    return this._baseUrl + "PatientAccountInfo";
  }
  get _getUserInfoForPatientUrl() {
    return this._baseUrl + "GetUserInfoForPatient";
  }
  get _createProcedureUrl() {
    return this._baseUrl + "CreateProcedure";
  }
  get _completePatientAccountProcessUrl() {
    return this._baseUrl + "CompletePatientAccountProcess";
  }



  get _patientPastAppointmentsUrl() {
    return this._baseUrl + "PatientPastAppointments";
  }

  get _patientUpcomingAppointmentsUrl() {
    return this._baseUrl + "PatientUpcomingAppointments";
  }

  get _procedureCodesForDentalUrl() {
    return this._baseUrl + "ProcedureCodesForDental";
  }

  get _patientUsedProceduresUrl() {
    return this._baseUrl + "PatientUsedProcedures";
  }

  get _patientProceduresViewUrl() {
    return this._baseUrl + "PatientProceduresView";
  }

  get _areaCodesUrl() {
    return this._baseUrl + "AreaCodes";
  }
  get _cancelAppointmentUrl() {
    return this._baseUrl + "CancelAppointment";
  }
  get _patientMessagesUrl() {
    return this._baseUrl + "PatientMessages";
  }

  get _labImageStatusesUrl() {
    return this._baseUrl + "LabImageStatuses";
  }

  get _labImageOrderStatusesUrl() {
    return this._baseUrl + "LabImageOrderStatuses";
  }
  get _updateAppointmentStatusUrl() {
    return this._baseUrl + "UpdateAppointmentStatus";

  }

  get _amendmentDetailsUrl() {
    return this._baseUrl + "AmendmentDetails";
  }

  get _createupdateAmendmentUrl() {
    return this._baseUrl + "CreateupdateAmendment";
  }

  get _deleteAmendmentUrl() {
    return this._baseUrl + "DeleteAmendment";
  }
  get _patientSearchUrl() {
    return this._baseUrl + "PatientSearch";
  }

  get _createLabOrImagingOrderUrl() {
    return this._baseUrl + "CreateLabOrImagingOrder";
  }

  get _labandImageListUrl() {
    return this._baseUrl + "LabandImageList";
  }

  get _amendmentStatusesUrl() {
    return this._baseUrl + "AmendmentStatuses";
  }
  get _amendmentSourcesUrl() {
    return this._baseUrl + "AmendmentSources";
  }

  get _labImageOrderNumberListUrl() {
    return this._baseUrl + "LabImageOrderNumberList";
  }

  get _createUpdateEducationMaterialUrl() {
    return this._baseUrl + "CreateUpdateEducationMaterial";
  }

  get _updateLabResultUrl() {
    return this._baseUrl + "UpdateLabResult";
  }

  get _labResultUrl() {
    return this._baseUrl + "LabResult";
  }

  constructor(public http: HttpClient) {
    super();
  }



  _ProcessPostRequestWithHeaders<T>(apiurl: string, reqdata: any): Observable<T> {
    return this.http.post<T>(apiurl, reqdata, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }


  _ProcessPostRequest<T>(apiurl: string, reqdata: any): Observable<T> {
    return this.http.post<T>(apiurl, reqdata).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }


  _ProcessGetRequest<T>(apiurl: string): Observable<T> {
    return this.http.get<T>(apiurl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  //Handel Errorss
  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error("serverside error", error.error);
    }
    return throwError(error.error.Message);
  }


}
