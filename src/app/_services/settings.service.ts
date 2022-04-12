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
    return this._ProcessGetRequest<any>(this._displayDateTimeOfZoneUrl + "?timeZoneId=" + encodeURIComponent(reqdata));
  }

  AddressVerification(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addressVerificationUrl, reqparams);
  }

  EditProviderLocation(reqparams: any) {
    const apiEndPoint = this._locationByIdUrl + "=" + reqparams;
    return this._ProcessGetRequest<any>(apiEndPoint);
  }

  PracticeLocations(providerId: any) {
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

  DropAppointmentStatus(statusId: any) {
    const apiEndPoint = this._dropAppointmentStatusUrl + '?statusId=' + statusId;
    return this._ProcessPostRequest<any>(apiEndPoint, statusId);
  }

  DropAppointmentType(typeId: any) {
    const apiEndPoint = this._dropAppointmentTypeUrl + '?typeId=' + typeId;
    return this._ProcessPostRequest<any>(apiEndPoint, typeId);
  }
  PostProvdierAdminAccess(reqdata: any) {
    return this._ProcessPostRequest<any>(this._updateProviderAdmineAccessUrl, reqdata);
  }
  UserInfoWithPraceticeLocations(reqdata: any) {
    return this._ProcessPostRequest<any>(this._userInfoWithPraceticeLocations, reqdata);
  }
  AddUpdateUserDetails(reqdata: any) {
    return this._ProcessPostRequest<any>(this._addUpdateUserUrl, reqdata);
  }
  ToggleUserFieldValues(reqData: any) {
    console.log(reqData)
    return this._ProcessPostRequest<any>(this._toggleUserFieldValuesUrl, reqData);
  }
}
