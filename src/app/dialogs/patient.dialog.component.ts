
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { UtilityService } from '../_services/utiltiy.service';
import { EHROverlayRef } from '../ehr-overlay-ref';
import { Patient } from '../_models/_account/NewPatient';
declare const RequiredFormCountrolMouseEnter: any;


@Component({
  selector: 'patient-dialog',
  templateUrl: './patient.dialog.component.html',
  styleUrls: ['./patient.dialog.component.scss'],
})
export class PatientDialogComponent implements OnInit {
  PatientData: Patient = { PatinetHasNoEmail: false };
  PhonePattern: {};
  @Output() onPatientClose = new EventEmitter();
  ValidAddressForUse: string;
  addressMessage: string;
  displayAddressDialog: boolean;
  displayAddress: string = 'none';

  constructor(private ref: EHROverlayRef,
    private utilityService: UtilityService) {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };

  }
  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }
  submit() {
    ///this.ref.close(this.frmSubscribe.value);
  }
  VerifyPatientAddress() {
    console.log(this.PatientData.Address);
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      console.log(resp.Result)
      if (resp.IsSuccess) {
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
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  UpdatePatient() {

    console.log(JSON.stringify(this.PatientData));
    /*this.utilityService.CreateNewPatient(this.PatientData).subscribe(resp => {
      if (resp.IsSuccess) {

      }
      else {

      }
    });*/

  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
  }

  mouseenter(){

  }
  mouseleve(){

  }
}
