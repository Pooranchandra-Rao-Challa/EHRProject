import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SmartSchedulerService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PracticeProviders(reqdata: any) {
    return this._ProcessPostRequest<any>(this._practiceProvidersUrl, reqdata);
  }

  PracticeStaff(reqdata: any) {
    return this._ProcessPostRequest<any>(this._providerStaffUrl, reqdata);
  }

  SearchPatients(reqdata: any) {
    // console.log(reqdata);
    return this._ProcessPostRequest<any>(this._searchPatientsUrl, reqdata);
  }

  ActiveAppointments(reqdata: any) {
    // console.log(reqdata);
    return this._ProcessPostRequest<any>(this._activeAppointmentsUrl, reqdata);
  }
  AppointmentTypes(reqparams: any) {
    return this._ProcessPostRequest<any>(this._appointmentTypesUrl, reqparams);
  }

  RoomsForLocation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._roomsForLocationUrl, reqparams);
  }

  AvailableTimeSlots(reqparams: any) {
    return this._ProcessPostRequest<any>(this._availableTimeSlotsUrl, reqparams);
  }

  CreateAppointment(reqparams: any) {
    return this._ProcessPostRequest<any>(this._createAppointmentUrl, reqparams);
  }

  // PracticeLocations(reqparams: any) {
  //   const apiEndPoint = this._locationsListUrl + reqparams.providerId;
  //   return this._ProcessPostRequest<any>(apiEndPoint, reqparams);
  // }

  PracticeLocations(ProviderId: string,ClinicId: string){
    return this._ProcessPostRequest<any>(this._clinicOrProviderLocationsUrl,
      {ProviderId:ProviderId,ClinicId:ClinicId});
  }

  ClinicLocations(ClinicId: string){
    return this._ProcessPostRequest<any>(this._clinicOrProviderLocationsUrl,
      {ClinicId:ClinicId});
  }

  CancelAppointment(reqparams: any) {
    return this._ProcessPostRequest<any>(this._cancelAppointmentUrl, reqparams);
  }
  FilteredPatientsOfProvider(reqparams: any) {
    return this._ProcessPostRequest<any>(this._filteredPatientsOfProviderUrl, reqparams);
  }

  UpdateAppointmentStatus(reqParams: any){
    return this._ProcessPostRequest<any>(this._updateAppointmentStatusUrl, reqParams);
  }
  CalendarAppointments(reqParams: any){
    return this._ProcessPostRequest<any>(this._calendarAppointmentsUrl, reqParams);
  }

  ReschuduleAppoinment(reqParams: any){
    return this._ProcessPostRequest<any>(this._reschuduleAppoinmentUrl, reqParams);
  }

  AllocateNewResource(reqParams: any){
    return this._ProcessPostRequest<any>(this._allocateNewResourceUrl, reqParams);
  }
}
