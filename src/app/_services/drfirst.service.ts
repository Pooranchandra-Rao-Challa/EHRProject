import { User } from './../_models/_account/user';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Injectable } from "@angular/core";
import { DR_FIRST_PATINET_URL, DR_FIRST_PROVIDER_URL, DR_FIRST_SSO_URL, DR_FIRST_URL, DrFirstStartUpScreens } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { DrFirstAttributes } from '../_models/_provider/practiceProviders';
import { Md5 } from "md5-typescript";
import { DrfirstUrlChanged } from '../_navigations/provider.layout/view.notification.service';

export class DrFirstValidFields {
  FirstName = { required: true, length: 35 };
  MiddleName = { required: false, length: 35 };
  LastName = { required: true, length: 35 };
  DOB = { required: true, format: 'MM/dd/yyyy' }
  Sex = { char: 1 }
  MobilePhone = { length: 10, format: '(ddd) ddd-dddd', required: true }
  Address1 = { length: 40, default: 'Unknown', max: 100 }
  City = { required: true, length: 100 }
  State = { required: true, length: 2 }
  Zip = { required: true, size: [5, 10] }
}

@Injectable()
export class DrfirstService {
  user: User;
  drFirstAttributes: DrFirstAttributes
  constructor(
    private datePipe: DatePipe,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private drfirstUrlChanged: DrfirstUrlChanged,
  ) {
    this.user = this.authService.userValue;
    this.drFirstAttributes = this.authService.GetDrFirstAttributes();
    //console.log(this.user);

  }

  initDrFirstAttribute(providerId, DrFirstPatientId, startup) {
    if (this.drFirstAttributes === undefined) {
      this.utilityService.DrfirstProviderParams(providerId, undefined).subscribe(resp => {
        if (resp.IsSuccess) {
          var drfirstProviderParams = resp.Result as DrFirstAttributes;
          this.authService.SetDrFirstAttributes(drfirstProviderParams)
          this.user = this.authService.userValue;
          this.drFirstAttributes =  this.authService.GetDrFirstAttributes();
          if (!DrFirstPatientId) {
            this.prepareURL(startup, 'provider')
          } else {
            this.prepareURL(startup, 'patient')
          }
        }
      })
    } else {
      if (!DrFirstPatientId) {
        this.prepareURL(startup, 'provider')
      } else {
        this.drFirstAttributes.DrFirstPatientId = DrFirstPatientId;
        //this.authService.UpdateDrFirstAttribues(this.drFirstAttributes)
        this.prepareURL(startup, 'patient')
      }
    }
  }

  public ProviderUrl(startup: string = DrFirstStartUpScreens.Report) {
    var providerId = this.user.ProviderId;
    this.initDrFirstAttribute(providerId, undefined, startup);
  }

  public PatientUrl(startup: string = DrFirstStartUpScreens.Patient) {
    var providerId = this.user.ProviderId;
    var DrFirstPatientId = this.authService.viewModel.Patient?.DrFirstPatientId
    this.initDrFirstAttribute(providerId, DrFirstPatientId, startup);
  }

  prepareURL(startup: string, urlFor: string) {
    var urlparams: string = ""
    switch (urlFor) {
      case 'provider':
        if (this.drFirstAttributes.EprescribeFrom == 'drfirst') {
          urlparams = DR_FIRST_PROVIDER_URL(
            this.drFirstAttributes.VendorUserName,
            this.drFirstAttributes.RcopiaPracticeUserName,
            this.drFirstAttributes.RcopiaPracticeUserId,
            this.drFirstAttributes.RcopiaUserExternalId == null || this.drFirstAttributes.RcopiaUserExternalId == undefined
              ? "" : this.drFirstAttributes.RcopiaUserExternalId, startup) + this.gmtTime();
          var hashvalue = Md5.init(`${urlparams}${this.drFirstAttributes.VendorPassword}`).toUpperCase()
          urlparams = DR_FIRST_URL(urlparams, hashvalue);
          this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams), "Provider", startup);
        }
        break;
      case 'patient':
        if (this.drFirstAttributes.DrFirstPatientId) {
          urlparams = DR_FIRST_PATINET_URL(
            this.drFirstAttributes.VendorUserName,
            this.drFirstAttributes.RcopiaPracticeUserName,
            this.drFirstAttributes.RcopiaPracticeUserId,
            this.drFirstAttributes.RcopiaUserExternalId == null || this.drFirstAttributes.RcopiaUserExternalId == undefined
              ? "" : this.drFirstAttributes.RcopiaUserExternalId,
            this.drFirstAttributes.DrFirstPatientId + '', startup) + this.gmtTime();
          var hashvalue = Md5.init(`${urlparams}${this.drFirstAttributes.VendorPassword}`).toUpperCase()
          urlparams = DR_FIRST_URL(urlparams, hashvalue);
          this.drfirstUrlChanged.sendData(DR_FIRST_SSO_URL(urlparams), "Patient", startup);
        }
        break;
    }
  }

  gmtTime(): string {
    var GMTTime = new Date();
    return this.datePipe.transform(GMTTime, "MMddyyHHmmss", "UTC");
  }

}


export const USAPhoneFormat = (phonenumber, format = false) => {
  var phoneRegex = /^([+1]{2}|[1]{1})*\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneRegex.test(phonenumber)) {
    if (!format) return phonenumber.replace(phoneRegex, "$2$3$4")
    return phonenumber.replace(phoneRegex, "($2) $3-$4");
  } else {
    // Invalid phone number
  }
}
