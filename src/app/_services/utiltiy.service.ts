import { Injectable } from "@angular/core";
import { APIEndPoint } from "./api.endpoint.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class UtilityService extends APIEndPoint {
  constructor(http: HttpClient) { super(http); }

  States() {
    return this._ProcessGetRequest<any>(this._statesUrl);
  }
  Titles() {
    return this._ProcessGetRequest<any>(this._titlesUrl);
  }
  Specilaity() {
    return this._ProcessGetRequest<any>(this._specialityUrl);
  }
  Degree() {
    return this._ProcessGetRequest<any>(this._degreeUrl);
  }
  ProviderRoles() {
    return this._ProcessGetRequest<any>(this._providerRolesUrl);
  }
  AppointmentStatuses() {
    return this._ProcessGetRequest<any>(this._appointmentStatusesUtitlityUrl);
  }
  AppointmentTypes() {
    return this._ProcessGetRequest<any>(this._appointmentTypesUtilityUrl);
  }
  VerifyAddress(addressLine: any) {
    return this._ProcessGetRequest<any>(this._addressVerificationUrl + "?addressLine=" + encodeURIComponent(addressLine));
  }
}
