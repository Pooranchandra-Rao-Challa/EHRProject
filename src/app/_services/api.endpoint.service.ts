import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { EndpointBase } from "./endpoint.base.service";
import { AuthenticationService } from "./authentication.service";

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
  get _encounterListForReportUrl() {
    return this._baseUrl + "EncounterListForReport";
  }
  get _stage2NumeratorDenominatorCountUrl() {
    return this._baseUrl + "GetStage2NumeDenomiCount";
  }
  get _stage2PatientListUrl() {
    return this._baseUrl + "GetStage2SessionwiseMUReports";
  }
  get _problemListForReportUrl() {
    return this._baseUrl + "ProblemListForReport";
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
    return this._baseUrl + "CreateQueuedReport";
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

  get _queuedCQMReportsUrl() {
    return this._baseUrl + "CQMReports/QueuedCQMReports";
  }
  get _createQueuedReportUrl() {
    return this._baseUrl + "CQMReports/CreateQueuedReport";
  }

  get _drilldownViewConditionsUrl() {
    return this._baseUrl + "CQMReports/DrilldownViewConditions";
  }
  // get _practiseLocationsUrl() {
  //   return this._baseUrl + "GetLocationsList?Provider_Id";
  // }
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
    return this._baseUrl + "GetLocationById";
  }
  get _clinicProvidersUrl() {
    return this._baseUrl + "ClinicProviders";
  }
  get _providerRegistrationUrl() {
    return this._baseUrl + "RegisterNewProvider";
  }
  get _createAdminUrl() {
    return this._baseUrl + "CreateAdmin";
  }
  get _deleteAdminUrl() {
    return this._baseUrl + "DeleteAdmin";
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
  get _userInfoWithPracticeLocations() {
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
    return this._baseUrl + "CreatePatient";
  }
  get _providerStaffUrl() {
    return this._baseUrl + "ProviderStaff";
  }
  get _individualProvidersUrl() {
    return this._baseUrl + "IndividualProviders";
  }

  get _searchPatientsWithAppointmentsUrl() {
    return this._baseUrl + "SearchPatientsWithAppointments";
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
    return this._baseUrl + "CDSAlerts";
  }
  get _CDSAlertTriggersUrl() {
    return this._baseUrl + "CDSAlertTriggers";//EvalPatientCDSAlerts
  }


  get _toggleAlertStatusUrl() {
    return this._baseUrl + "ToggleAlertStatus";
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

  get _tobaccoUseByPatientIdUrl() {
    return this._baseUrl + "TobaccoUseByPatientId";
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

  get _patientRelationsUrl() {
    return this._baseUrl + "PatientRelations";
  }
  get _labTestResultByPatientIdUrl() {
    return this._baseUrl + "LabTestResultByPatientId";
  }

  get _vitalStatsByPatientIdUrl() {
    return this._baseUrl + "VitalStatsByPatientId";
  }

  get _patientVitalStatsUrl() {
    return this._baseUrl + "PatientVitalStats";
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

  // get _emailedUrlsUrl() {
  //   return this._baseUrl + "EmailedUrls";
  // }

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
    return this._baseUrl + "CreateInsuranceCompany";
  }

  get _evalPatientCDSAlertsUrl() {
    return this._baseUrl + "EvalPatientCDSAlerts";
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

  get _createFamilyHealthHistoriesUrl() {
    return this._baseUrl + "CreateFamilyHealthHistories";
  }

  get _createAllergiesUrl() {
    return this._baseUrl + "CreateAllergies";
  }

  get _createDiagnosesUrl() {
    return this._baseUrl + "CreateDiagnosis";
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

  get _createTobaccoUseUrl() {
    return this._baseUrl + "CreateTobaccoUse";
  }

  get _vaccinesUrl() {
    return this._baseUrl + "Vaccines";
  }

  get _searchInterventionCodesUrl() {
    return this._baseUrl + "SearchInterventionCodes";
  }

  get _allergyNamesUrl() {
    return this._baseUrl + "AllergyNames";
  }

  get _createInterventionsUrl() {
    return this._baseUrl + "CreateInterventions";
  }

  get _interventionsByPatientIdUrl() {
    return this._baseUrl + "InterventionsByPatientId";
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

  get _deleteDiagnosesUrl() {
    return this._baseUrl + "DeleteDiagnoses";
  }

  get _deletePatientUrl() {
    return this._baseUrl + "DeletePatient";
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

  get _labImageOrderWithResultsListUrl() {
    return this._baseUrl + "LabImageOrderWithResultsList";
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

  get _procedureStatuesUrl() {
    return this._baseUrl + "ProcedureStatues";
  }
  get _cancelProcedureUrl() {
    return this._baseUrl + "CancelProcedure";
  }

  get _calendarAppointmentsUrl() {
    return this._baseUrl + "CalendarAppointments";
  }

  get _reschuduleAppoinmentUrl() {
    return this._baseUrl + "ReschuduleAppoinment";
  }

  get _allocateNewResourceUrl() {
    return this._baseUrl + "AllocateNewResource";
  }

  get _createUpdateClinicalDecisionSupportUrl() {
    return this._baseUrl + "CreateUpdateClinicalDecisionSupport";
  }

  get _updateCDSAlertToggleUrl() {
    return this._baseUrl + "UpdateCDSAlertToggle";
  }

  get _createTriggerUrl() {
    return this._baseUrl + "CreateTrigger";
  }
  get _deleteTriggerUrl() {
    return this._baseUrl + "DeleteTrigger";
  }
  get _requestPatientAppointmentUrl() {
    return this._baseUrl + "RequestPatientAppointment";
  }
  get _appointmentsTypesByPatientIdUrl() {
    return this._baseUrl + "AppointmentsTypesByPatientId";
  }

  get _cancelPatientAppoinmentUrl() {
    return this._baseUrl + "CancelPatientAppoinment";
  }

  get _blockoutForUrl() {
    return this._baseUrl + "BlockoutFor";
  }

  get _clinicOrProviderLocationsUrl() {
    return this._baseUrl + "ClinicOrProviderLocations";
  }

  get _messagesUrl() {
    return this._baseUrl + "Messages";
  }

  get _inboxMessagesUrl() {
    return this._baseUrl + "InboxMessages";
  }

  get _sentMessagesUrl() {
    return this._baseUrl + "SentMessages";
  }

  get _draftMessagesUrl() {
    return this._baseUrl + "DraftMessages";
  }

  get _urgentMessagesUrl() {
    return this._baseUrl + "UrgentMessages";
  }

  get _createMessageUrl() {
    return this._baseUrl + "CreateMessages";
  }

  get _deleteMessageUrl() {
    return this._baseUrl + "DeleteMessages";
  }
  get _switchUserKeyUrl() {
    return this._baseUrl + "SwitchUserKey";
  }
  get _switchToPatientUserKeyUrl() {
    return this._baseUrl + "SwitchToPatientUserKey";
  }
  get _createBlockoutUrl() {
    return this._baseUrl + "CreateBlockout";
  }

  get _deleteBlockoutUrl() {
    return this._baseUrl + "DeleteBlockout";
  }

  get _deleteCareTeamProviderIdsUrl() {
    return this._baseUrl + "DeleteCareTeamProviderIds";
  }

  get _calendarBlockoutsUrl() {
    return this._baseUrl + "CalendarBlockouts";
  }
  get _patientMyProfileSecurityQuestionUrl() {
    return this._baseUrl + "PatientMyProfileSecurityQuestion";
  }

  get _updatePatientMyProfileSecurityQuestionUrl() {
    return this._baseUrl + "UpdatePatientMyProfileSecurityQuestion";
  }

  get _updateImageResultUrl() {
    return this._baseUrl + "UpdateImageResult";
  }

  get _imageResultUrl() {
    return this._baseUrl + "ImageResult";
  }

  get _clinicsForAdminUrl() {
    return this._baseUrl + "ClinicsForAdmin";
  }
  get _blockoutInfoUrl() {
    return this._baseUrl + "BlockoutInfo";
  }

  get _createAuthorizedRepresentativeUrl() {
    return this._baseUrl + "CreateAuthorizedRepresentative";
  }

  get _updateDefaultMessageUrl() {
    return this._baseUrl + "UpdateDefaultMessage";
  }

  get _authorizedRepresentativesUrl() {
    return this._baseUrl + "AuthorizedRepresentatives";
  }


  get _securePasswordChangeUrl() {
    return this._baseUrl + "SecurePasswordChange";
  }

  get _createProviderUrl() {
    return this._baseUrl + "CreateProvider";
  }

  get _resendValidationMailUrl() {
    return this._baseUrl + "ResendValidationMail";
  }

  get _sendPatientInvitationUrl() {
    return this._baseUrl + "SendPatientInvitation";
  }

  get _raisePasswordChangeRequestUrl() {
    return this._baseUrl + "RaisePasswordChangeRequest";
  }

  get _releaseUserLockUrl() {
    return this._baseUrl + "ReleaseUserLock";
  }

  get _checkEmailAvailablityUrl() {
    return this._baseUrl + "CheckEmailAvailablity";
  }

  get _assignPatientRelationShipUrl() {
    return this._baseUrl + "AssignPatientRelationShip";
  }

  get _imagetoBase64StringUrl() {
    return this._baseUrl + "api/upload/ImagetoBase64String";
  }

  get _photoToBase64String() {
    return this._baseUrl + "api/upload/PhotoToBase64String";
  }

  get _importDataUrl() {
    return this._baseUrl + "ImportData";
  }

  get _getAdminVersionUrl() {
    return this._baseUrl + "GetAdminSettingVersion";
  }
  get _updateAdminVersionUrl() {
    return this._baseUrl + "UpdateAdminSettingsAppVersion";
  }

  get _readInboxMessageUrl() {
    return this._baseUrl + "ReadInboxMessages";
  }
  get _cqmReportingYears() {
    return this._baseUrl + "CQMReports/CQMReportingYears";
  }

  get _cCDAReportUrl() {
    return this._baseUrl + "CCDAReport";
  }

  get _updateProviderPhotoURL() {
    return this._baseUrl + "UpdateProviderPhoto";
  }


  get _updatePatientPhotoURL() {
    return this._baseUrl + "UpdatePatientPhoto";
  }

  get _updateSecurityQuestionURL() {
    return this._baseUrl + "UpdateSecurityQuestion";
  }
  get _providerPracticeLocationsURL() {
    return this._baseUrl + "ProviderPracticeLocations";
  }

  get _firstTimeResetPasswordURL() {
    return this._baseUrl + "FirstTimeResetPassword";
  }

  get _removePatientRelationShipAccessURL() {
    return this._baseUrl + "RemovePatientRelationShipAccess";
  }
  get _patientAddendaDocsURL() {
    return this._baseUrl + "PatientAddendaDocs";
  }

  get _updateAddendaDocURL() {
    return this._baseUrl + "UpdateAddendaDoc";
  }

  get _updateAddendaDocsURL() {
    return this._baseUrl + "UpdateAddendaDocs";
  }

  get _encounterAddendaDocsURL() {
    return this._baseUrl + "EncounterAddendaDocs";
  }

  get _patientProfileURL() {
    return this._baseUrl + "PatientProfile";
  }
  get _encountersForAddendaDocURL() {
    return this._baseUrl + "EncountersForAddendaDoc";
  }

  get _addendaDocumentTypesURL() {
    return this._baseUrl + "AddendaDocumentTypes";
  }

  get _getPatientURL() {
    return this._baseUrl + "GetPatient";
  }

  get _createAddendaDocTypeURL() {
    return this._baseUrl + "CreateAddendaDocType";
  }

  get _createAddendumURL() {
    return this._baseUrl + "CreateAddendum";
  }
  get _addendumsURL() {
    return this._baseUrl + "Addendums";
  }
  get _deleteEncounterAddendaDocURL() {
    return this._baseUrl + "DeleteEncounterAddendaDoc";
  }

  get _patientRelationInfoURL() {
    return this._baseUrl + "PatientRelationInfo";
  }

  get _resetPatientPasswordURL() {
    return this._baseUrl + "ResetPatientPassword";
  }

  get _updateResetPasswordURL() {
    return this._baseUrl + "UpdateResetPassword";
  }

  get _singAddendaDocsURL() {
    return this._baseUrl + "SingAddendaDocs";
  }

  get _deleteAttachmentURL() {
    return this._baseUrl + "DeleteAttachment";
  }

  get _matchingPatientsURL() {
    return this._baseUrl + "MatchingPatients";
  }
  get _communicationSettingURL() {
    return this._baseUrl + "CommunicationSetting";
  }
  get _updateCommunicationSettingURL() {
    return this._baseUrl + "UpdateCommunicationSetting";
  }
  get _hasNotificationsURL() {
    return this._baseUrl + "HasNotifications";
  }

  get _enableDistableNotificationURL() {
    return this._baseUrl + "EnableDistableNotification";
  }

  get _setNotificationTypesAsDefaultURL() {
    return this._baseUrl + "SetNotificationTypesAsDefault";
  }
  get _patientNotificationSettingTypesURL() {
    return this._baseUrl + "PatientNotificationSettingTypes";
  }

  get _addNotificationURL() {
    return this._baseUrl + "AddNotification";
  }


  get _validateNotificationTypeURL() {
    return this._baseUrl + "ValidateNotificationType";
  }

  get _resendVerficationCodeURL() {
    return this._baseUrl + "ResendVerficationCode";
  }

  get _clearNotificationURL() {
    return this._baseUrl + "ClearNotification";
  }
  get _drfirstProviderParamsURL() {
    return this._baseUrl + "DrFirstAttributes";
  }
  get _drfirstPatientURL() {
    return this._baseUrl + "DrfirstPatient";
  }

  get _updateDrFirstPatientURL() {
    return this._baseUrl + "UpdateDrFirstPatient";
  }

  get _sendDrfirstPatientURL() {
    return this._baseUrl + "SendDrfirstPatient";
  }

  get _sendCCDAToPatientURL() {
    return this._baseUrl + "SendToPatient";
  }

  get _deleteAllergyURL() {
    return this._baseUrl + "DeleteAllergy";
  }

  get _deleteDiagnosisURL() {
    return this._baseUrl + "DeleteDiagnosis";
  }

  get _deleteMedicationURL() {
    return this._baseUrl + "DeleteMedication";
  }

  get _syncChartURL() {
    return this._baseUrl + "SyncChart";
  }

  get _roleWisePermissionsURL() {
    return this._baseUrl + "RoleWisePermissions";
  }

  get _updateRolePermissionsURL() {
    return this._baseUrl + "UpdateRolePermissions";
  }
  get _drFirstNotificationsURL() {
    return this._baseUrl + "DrFirstNotifications";
  }

  get _prescriptionsURL() {
    return this._baseUrl + "Prescriptions";
  }

  get _checkEducationMaterialURL() {
    return this._baseUrl + "CheckEducationMaterial";
  }

  get _updatePatientEducationMaterialURL() {
    return this._baseUrl + "UpdatePatientEducationMaterial";
  }


  get _deleteAlertURL() {
    return this._baseUrl + "DeleteAlert";
  }

  get _resetMFAURL() {
    return this._baseUrl + "ResetMFA";
  }

  get _enableMFAURL() {
    return this._baseUrl + "EnableMFA";
  }

  get _disableMFAURL() {
    return this._baseUrl + "DisableMFA";
  }

  get _PDFToBase64StringURL() {
    return this._baseUrl + "PDFToBase64String";
  }

  get _duplicateEncounterURL() {
    return this._baseUrl + "DuplicateEncounter";
  }

  get _patientBillURL() {
    return this._baseUrl + "PatientBill";
  }

  get _billViewURL() {
    return this._baseUrl + "BillView";
  }

  get _createProgressNoteBillURL(){
    return this._baseUrl + "CreateProgressNoteBill"
  }

  get _proceduresForBillURL(){
    return this._baseUrl + "ProceduresForBill"
  }

  get _updateProceduresInBillURL(){
    return this._baseUrl + "UpdateProceduresInBill"
  }

  get _billPaymentURL(){
    return this._baseUrl + "BillPayment"
  }

  get _updateBillPaymentURL(){
    return this._baseUrl + "UpdateBillPayment"
  }

  constructor(public http: HttpClient) {
    super();
  }




  _parseParamsToUrlEncode(params: any[]): string {
    var returnValue: any[] = [];
    params.forEach(param => returnValue.push(encodeURIComponent(param)));
    return returnValue.join('/');
  }

  _ProcessPostRequestWithHeaders<T>(apiurl: string, reqdata: any): Observable<T> {
    return this.http.post<T>(apiurl, reqdata, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  _ProcessPostRequestWithoutHeader<T>(apiurl: string, reqdata: any): Observable<T> {
    return this.http.post<T>(apiurl, reqdata).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  _ProcessPostRequest<T>(apiurl: string, reqdata: any): Observable<T> {
    return this.http.post<T>(apiurl, reqdata, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }


  _ProcessGetRequest<T>(apiurl: string): Observable<T> {

    return this.http.get<T>(apiurl, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  _ProcessGetRequesWithoutHeader<T>(apiurl: string): Observable<T> {
    return this.http.get<T>(apiurl).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }
  _ProcessGetRequestWithId<T>(apiurl: string, id: string): Observable<T> {
    return this.http.get<T>(`${apiurl}/${id}`, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  _ProcessGetRequestWith2Params<T>(apiurl: string, id1: string, id2: string): Observable<T> {
    return this.http.get<T>(`${apiurl}/${id1}/${id2}`, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }

  //Handel Errorss
  private _handleError(error: HttpErrorResponse) {
    if (error) {
      if (error.error) {
        console.error("An error occurred:", error.error.message);
      } else {
        console.error("Error in accessing application");
        if (error)
          console.error(error);
      }
    }

    // if ([401].includes(error.status) && this.jwtService.IsLoggedIn) {
    //   // auto logout if 401 or 403 response returned from api
    //   return this.handle401Error(authReq, next)
    // } else if ([403].includes(err.status) && this.jwtService.IsLoggedIn) {
    //   // auto logout if 401 or 403 response returned from api
    //   this.jwtService.Logout();
    // }
    // else if ([400].includes(err.status) && this.jwtService.IsLoggedIn) {
    //   this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error' + ' ' + err.status, detail: err.error });
    // }
    // else if ([404].includes(err.status) && this.jwtService.IsLoggedIn) {
    //   this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error' + ' ' + err.status, detail: err.error });
    // }
    // if (error.error instanceof ErrorEvent) {
    //   console.error("An error occurred:", error.error.message);
    // } else {
    //   console.error("serverside error", JSON.stringify(error));
    // }
    if (error.error)
      return throwError(error.error.Message);
    else return throwError(error);

  }


}
