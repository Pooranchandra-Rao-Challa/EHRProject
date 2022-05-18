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

  RoomsForLocation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._roomsforLocationUrl, reqparams);
  }

  AddUpdateUser(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateUserUrl, reqparams);
  }

  TimeZones() {
    return this._ProcessGetRequest<any>(this._listOfTimeZoneUrl);
  }

  AddUpdateLocation(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateLocationUrl, reqparams);
  }

  DisplayDateTimeOfZone(reqparams: any) {
    let postdata = { timeZoneId: reqparams };
    return this._ProcessGetRequest<any>(this._displayDateTimeOfZoneUrl + "?timeZoneId=" + encodeURIComponent(reqparams));
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

  AddUpdateAppointmentStatus(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateAppointmentStatusUrl, reqparams);
  }

  AddUpdateAppointmentType(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateAppointmentTypeUrl, reqparams);
  }

  AddUpdateRoom(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateRoomUrl, reqparams);
  }

  DropAppointmentStatus(statusId: any) {
    const apiEndPoint = this._dropAppointmentStatusUrl + '?statusId=' + statusId;
    return this._ProcessPostRequest<any>(apiEndPoint, statusId);
  }

  DropAppointmentType(typeId: any) {
    const apiEndPoint = this._dropAppointmentTypeUrl + '?typeId=' + typeId;
    return this._ProcessPostRequest<any>(apiEndPoint, typeId);
  }

  DropRoom(roomId: any) {
    const apiEndPoint = this._dropRoomUrl + '?roomId=' + roomId;
    return this._ProcessPostRequest<any>(apiEndPoint, roomId);
  }

  PostProvdierAdminAccess(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateProviderAdmineAccessUrl, reqparams);
  }

  UserInfoWithPraceticeLocations(reqparams: any) {
    return this._ProcessPostRequest<any>(this._userInfoWithPraceticeLocations, reqparams);
  }

  AddUpdateUserDetails(reqparams: any) {
    return this._ProcessPostRequest<any>(this._addUpdateUserUrl, reqparams);
  }

  Generalschedule(reqparams: any) {
    return this._ProcessPostRequest<any>(this._generalScheduleUrl, reqparams);
  }

  UpdateReschedule(reqparams: any) {
    return this._ProcessPostRequest<any>(this._updateRescheduleUrl, reqparams);
  }
  AuditLogs(reqparams: any) {
    return this._ProcessPostRequest<any>(this._auditLogsUrl, reqparams);
  }

  EducationMaterials(reqparams: any) {
    return this._ProcessPostRequest<any>(this._educationMaterialsUrl, reqparams);
  }

  ClinicalDecisionSupport(reqparams: any) {
    return this._ProcessPostRequest<any>(this._clinicalDecisionSupportUrl, reqparams);
  }

  Erx(reqparams: any) {
    return this._ProcessPostRequest<any>(this._erxUrl, reqparams);
  }
  ToggleUserFieldValues(reqparams: any) {
    console.log(reqparams)
    return this._ProcessPostRequest<any>(this._toggleUserFieldValuesUrl, reqparams);
  }


}
