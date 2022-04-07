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
    return this._baseUrl +  "UserLogin";
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

  get _appointmentTypesUrl(){
    return this._baseUrl + "AppointmentTypes";
  }

  get _appointmentStatusesUrl(){
    return this._baseUrl + "AppointmentStatuses";
  }

  get _addUpdateUserUrl(){
    return this._baseUrl + "AddUpdateUser";
  }

  get _addUpdateAppointmentStatusUrl(){
    return this._baseUrl + "AddUpdateAppointmentStatus";
  }
  get _addUpdateAppointmentTypeUrl(){
    return this._baseUrl + "AddUpdateAppointmentType";
  }
  get _dropAppointmentTypeUrl(){
    return this._baseUrl + "DropAppointmentType";
  }
  get _dropAppointmentStatusUrl(){
    return this._baseUrl + "DropAppointmentStatus";
  }
  get _updateProviderAdmineAccessUrl(){
    return this._baseUrl + "UpdateProviderAdminAccess";
  }
  get _userInfoWithPraceticeLocations(){
    return this._baseUrl + "UserInfoWithPracticeLocations";
  }

  get _authenticatePatientUrl(){
    return this._baseUrl + "AuthenticatePatient";
  }

  get _statesUrl(){
    return this._baseUrl + "States";
  }

  get _titlesUrl(){
    return this._baseUrl + "Titles";
  }

  get _specialityUrl(){
    return this._baseUrl + "Speciality";
  }

  get _degreeUrl(){
    return this._baseUrl + "Degree";
  }

  get _providerRolesUrl(){
    return this._baseUrl + "ProviderRoles";
  }

  get _appointmentStatusesUtitlityUrl(){
    return this._baseUrl + "AppointmentStatusesUtility";
  }

  get _appointmentTypesUtilityUrl(){
    return this._baseUrl + "AppointmentTypesUtility";
  }

  get _practiceProvidersUrl(){
    return this._baseUrl + "PracticeProviders";
  }
  get _createNewPatientUrl(){
    return this._baseUrl + "CreateNewPatient";
  }
  get _providerStaffUrl(){
    return this._baseUrl + "ProviderStaff";
  }
  get _individualProvidersUrl(){
    return this._baseUrl + "IndividualProviders";
  }

  get _searchPatientsUrl(){
    return this._baseUrl + "SearchPatients";
  }
  get _toggleUserFieldValuesUrl(){
    return this._baseUrl + "ToggleUserFieldValues";
  }

  get _activeAppointmentsUrl(){
    return this._baseUrl + "ActiveAppointments";
  }

  get _roomsForLocationUrl(){
    return this._baseUrl + "RoomsForLocation";
  }

  get _availableTimeSlotsUrl(){
    return this._baseUrl + "AvailableTimeSlots";
  }

  get _createAppointmentUrl(){
    return this._baseUrl + "CreateAppointment";
  }

  get _providerListUrl(){
    return this._baseUrl + "GetProviderList";
  }

  constructor(public http: HttpClient) {
    super();
  }

  _ProcessPostRequestWithHeaders<T>(apiurl: string, reqdata: any): Observable<T>{
    return this.http.post<T>(apiurl, reqdata, this.requestHeaders).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }


  _ProcessPostRequest<T>(apiurl: string, reqdata: any): Observable<T>{
    return this.http.post<T>(apiurl, reqdata).pipe(
      tap((data) => {
        return data;
      }),
      catchError(this._handleError)
    );
  }


  _ProcessGetRequest<T>(apiurl: string):Observable<T>{
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