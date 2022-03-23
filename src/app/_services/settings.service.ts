import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";
@Injectable()
export class SettingsService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  AppointmentTypes(reqparams: any) {
    return this._ProcessPostRequest<any>(this._appointmentTypesUrl, reqparams);
  }

  AppointmentStatuses(reqparams: any) {
    return this._ProcessPostRequest<any>(this._appointmentStatusesUrl, reqparams);
  }

  AddUpdateUser(reqdata: any) {
    return this._ProcessPostRequest<any>(this._addUpdateUserUrl, reqdata);
  }

  TimeZones() {
    return this._ProcessGetRequest<any>(this._listOfTimeZoneUrl);
  }

  AddUpdateLocation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateLocationUrl, reqparams);
  }

  DisplayDateTimeOfZone(reqdata: any) {
    let postdata = { timeZoneId: reqdata };
    return this._ProcessGetRequest<any>(this._displayDateTimeOfZoneUrl+"?timeZoneId="+encodeURIComponent(reqdata)  );
  }

  AddressVerification(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addressVerificationUrl, reqparams);
  }

  Location(reqparams: any) {
    const apiEndPoint = this._locationByIdUrl + "=" + reqparams;
    return this._ProcessGetRequest<any>(apiEndPoint);
  }

  LocationList(providerId: any) {
    const apiEndPoint = this._locationsListUrl + providerId;
    return this._ProcessPostRequest<any>(apiEndPoint, providerId);
  }

  ProviderDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._providerDetailsUrl, reqparams);
  }

  AddUpdateAppointmentStatus(reqdata: any) {
    return this._ProcessPostRequest<any>(this._addUpdateAppointmentStatusUrl, reqdata);
  }

  AddUpdateAppointmentType(reqdata: any) {
    return this._ProcessPostRequest<any>(this._addUpdateAppointmentTypeUrl, reqdata);
  }

  DropAppointmentStatus(reqdata: any) {
    return this._ProcessPostRequest<any>(this._dropAppointmentStatusUrl, reqdata);
  }

  DropAppointmentType(reqdata: any) {
    return this._ProcessPostRequest<any>(this._dropAppointmentTypeUrl, reqdata);
  }
  PostProvdierAdminAccess(reqdata: any) {
    return this._ProcessPostRequest<any>(this._updateProviderAdmineAccessUrl, reqdata);
  }
  UserList(reqdata: any) {
    return this._ProcessPostRequest<any>(this._getUserListUrl, reqdata);
  }
  AddUpdateUserDetails(reqdata: any) {
    return this._ProcessPostRequest<any>(this._addUpdateUserUrl, reqdata);
  }

}
