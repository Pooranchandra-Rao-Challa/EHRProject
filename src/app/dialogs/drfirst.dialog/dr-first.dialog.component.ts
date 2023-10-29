import { UtilityService } from './../../_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DrFirstValidFields, DrfirstService, USAPhoneFormat } from '../../_services/drfirst.service';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { DrFirstPatient } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import Swal from 'sweetalert2';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';


@Component({
  selector: 'app-e-prescribe.dialog',
  templateUrl: './dr-first.dialog.component.html',
  styleUrls: ['./dr-first.dialog.component.scss']
})
export class DrFirstDialogComponent implements OnInit {
  validDrFirstField: DrFirstValidFields = new DrFirstValidFields();
  patientName: string = ""
  patient: ProviderPatient;
  constructor(
    private ref: EHROverlayRef
    , private authenticationService: AuthenticationService
    , private drfirstService: DrfirstService
    , private utilityService: UtilityService
    , private alertmsg: AlertMessage) { }

  ngOnInit(): void {
    this.patient = this.authenticationService.viewModel.Patient;
    this.patientName = this.patient.FirstName + " " + this.patient.LastName
  }

  cancel() {
    this.ref.close(null);
  }

  sendPatientDrfirstRegistration() {

    let patientId = this.patient.PatientId;
    let providerId = this.authenticationService.userValue.ProviderId;
    this.utilityService.DrfirstPatient(providerId, patientId).subscribe((resp) => {
      if (resp.IsSuccess) {
        let drfirstPatient = resp.Result as DrFirstPatient;
        if (this.openErrorDialog(this.validateDrfirstPatientSyncInfo(drfirstPatient)))
          this.utilityService.SendDrfirstPatient(drfirstPatient)
            .subscribe(resp => {
              if (resp.IsSuccess) {
                let patientName = `${drfirstPatient.FirstName} ${drfirstPatient.LastName}`
                let message = ERROR_CODES["M2PE001"];
                message = message.replace("PATIENT_NAME", patientName)
                this.alertmsg.displayMessageDailog(message);
                this.cancel();
              }
              else {
                this.alertmsg.displayMessageDailog(ERROR_CODES["E2PE001"]);
              }
            });
      }
    })
  }
  validateDrfirstPatientSyncInfo(data: DrFirstPatient): string[] {
    data.MobilePhone = USAPhoneFormat(data.MobilePhone);
    let messages: string[] = [];
    let stateAbbr = data.State;
    let address = ['AL', 'AK', 'AZ', 'AR', 'AS', 'CA', 'CO', 'CT', 'DE', 'DC',
      'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY',
      'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE',
      'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK',
      'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'TT', 'UT',
      'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY']
    let states = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'American Samoa': 'AS',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC',
      'Florida': 'FL', 'Georgia': 'GA', 'Guam': 'GU', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY',
      'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI',
      'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE',
      'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Northern Mariana Islands': 'MP', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Puerto Rico': 'PR', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Trust Territories': 'TT', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Virgin Islands': 'VI', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY',

    }

    if (address.indexOf(data.State) == -1)
      stateAbbr = states[data.State];

    if (!data.FirstName && this.validDrFirstField.FirstName.required) {
      messages.push("First Name can not be blank")
    } else if (data.FirstName.length > this.validDrFirstField.FirstName.length) {
      messages.push(`First Name is too long (it should be maximum ${this.validDrFirstField.FirstName.length}) characters`)
    }

    if (!data.LastName && this.validDrFirstField.LastName.required) {
      messages.push("Last Name can not be blank")
    } else if (data.LastName.length > this.validDrFirstField.LastName.length) {
      messages.push(`Last Name is too long (it should be maximum ${this.validDrFirstField.LastName.length}) characters`)
    }

    if (data.PatientAddress && data.PatientAddress.length > this.validDrFirstField.Address1.length) {
      messages.push(`Address is too long (it should be maximum ${this.validDrFirstField.Address1.length}) characters`)
    }

    if (!data.City && this.validDrFirstField.City.required) {
      messages.push("City can not be blank")
    }
    else if (data.City && data.City.length > this.validDrFirstField.City.length) {
      messages.push(`City is too long  (it should be maximum ${this.validDrFirstField.City.length}) characters`)
    }

    if (!data.State && this.validDrFirstField.State.required) {
      messages.push("State can not be blank")
    }
    else if (data.State && address.indexOf(stateAbbr) == -1) {
      messages.push(`State must be a valid US State`)
    }

    if (!data.Zip && this.validDrFirstField.Zip.required) {
      messages.push("Zip code can not be blank")
    } else if (data.Zip && this.validDrFirstField.Zip.size.indexOf(data.Zip.length) == -1) {
      messages.push("Zip code should be 5 or 10 characters long")
    }

    if (!data.DOB && this.validDrFirstField.DOB.required) {
      messages.push("Date of birth can not be blank")
    } else if (data.DOB > new Date()) {
      messages.push("Date of birth should be less than or equal to todays date");
    }

    if (!data.MobilePhone && !data.HomePhone && this.validDrFirstField.MobilePhone.required) {
      messages.push("Primary phone can not be blank")
    } else if (data.MobilePhone && !data.HomePhone && data.MobilePhone.length > this.validDrFirstField.MobilePhone.length) {
      messages.push("Primary phone is not valid us number")
    } else if (!data.MobilePhone && data.HomePhone && USAPhoneFormat(data.HomePhone).length > this.validDrFirstField.MobilePhone.length) {
      messages.push("Primary phone is not valid us number")
    }


    return messages;
  }
  openErrorDialog(messages: string[]): boolean {
    if (messages.length == 0) return true;
    let m: string[] = []
    messages.forEach((message) => m.push('<li>' + message + '</li>'))
    Swal.fire({
      title: "Dr First Patient data Validation Message(s)",
      html: '<ul class="drfirst-patinet-registration-errors">' + m.join("") + '</ul>',
      padding: '1px !important',
      customClass: {
        container: 'drfirst-container',
        title: 'drfirst-title',
        cancelButton: 'drfirst-cancel-botton',
        htmlContainer: 'drfirst-message',
        actions: 'drfirst-actions'
      },
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      backdrop: true,
      showConfirmButton: false,
    });
  }
}
