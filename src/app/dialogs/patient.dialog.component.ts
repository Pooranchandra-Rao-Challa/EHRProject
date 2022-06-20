
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { UtilityService } from '../_services/utiltiy.service';
import { AuthenticationService } from '../_services/authentication.service';
import { EHROverlayRef } from '../ehr-overlay-ref';
import { Patient } from '../_models/_account/NewPatient';
declare const RequiredFormCountrolMouseEnter: any;
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'patient-dialog',
  templateUrl: './patient.dialog.component.html',
  styleUrls: ['./patient.dialog.component.scss'],
})
export class PatientDialogComponent {
  PatientData: Patient = { PatinetHasNoEmail: true, Gender: 'male' };
  PhonePattern: {};
  @Output() onPatientClose = new EventEmitter();
  ValidAddressForUse: string;
  addressMessage: string;
  displayAddressDialog: boolean;
  displayAddress: string = 'none';
  useThisAddress: boolean = false;
  AddressVerficationResult: any;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage) {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };

  }
  cancel() {
    this.ref.close(null);
  }
  enableSave() {
    return !(this.PatientData.FirstName != null && this.PatientData.FirstName != ""
      && this.PatientData.LastName != null && this.PatientData.LastName != ""
      && this.PatientData.DateofBirth != null
      && this.PatientData.Gender != null && this.PatientData.Gender != ""
      && ((!this.PatientData.PatinetHasNoEmail &&
        this.PatientData.Email != null && this.PatientData.Email != "") || this.PatientData.PatinetHasNoEmail))
  }
  VerifyPatientAddress() {
    // console.log(this.PatientData.Address);
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientData.AddressResult = resp.Result;
        this.PatientData.ValidatedAddress = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"];
        this.ValidAddressForUse = this.PatientData.ValidatedAddress;
        this.addressMessage = resp.EndUserMessage;
        this.openPopupAddress();
        this.displayAddressDialog = false;
      }
      else {
        this.displayAddressDialog = true;
        this.openPopupAddress();
        this.addressMessage = resp.EndUserMessage;
      }
    });
  }

  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }

  UseValidatedAddress() {
    this.closePopupAddress();
    this.useThisAddress = true;
    console.log(this.PatientData.AddressResult);
    this.PatientData.City = this.PatientData.AddressResult.components.city_name;
    this.PatientData.State = this.PatientData.AddressResult.components.state_abbreviation;
    this.PatientData.StreetAddress = this.PatientData.AddressResult.delivery_line_1;
    this.PatientData.Zipcode = this.PatientData.AddressResult.components.zipcode;
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  UpdatePatient() {

    if(this.PatientData.StreetAddress == null || this.PatientData.StreetAddress == ""){
      if(this.PatientData.ValidatedAddress != null && this.PatientData.ValidatedAddress != "")
        this.PatientData.StreetAddress = this.PatientData.ValidatedAddress;
      else if(this.PatientData.Address != null && this.PatientData.Address != "")
        this.PatientData.StreetAddress = this.PatientData.Address;
    }
    this.PatientData.LocationId = this.authService.userValue.CurrentLocation;
    this.PatientData.ProviderId = this.authService.userValue.ProviderId;
    this.PatientData.ClinicId = this.authService.userValue.ClinicId;

    console.log(this.PatientData);
    this.utilityService.CreatePatient(this.PatientData).subscribe(resp => {
      if (resp.IsSuccess) {
        this.cancel();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP001"])
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP001"])
      }
    });

  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
  }

}
