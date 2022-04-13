import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class SmartSchedulerService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  PracticeProviders(reqdata: any) {
    return this._ProcessPostRequest<any>(this._practiceProvidersUrl, reqdata);
  }

  SearchPatients(reqdata: any) {
    console.log(reqdata);
    return this._ProcessPostRequest<any>(this._searchPatientsUrl, reqdata);
  }

  ActiveAppointments(reqdata: any) {
    console.log(reqdata);
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
  ConfirmAppointmentCancellation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._confirmAppointmentCancellationUrl, reqparams);
  }
  PracticeLocations(reqparams: any) {
    const apiEndPoint = this._locationsListUrl + reqparams.providerId;
    return this._ProcessPostRequest<any>(apiEndPoint, reqparams);
  }
}
