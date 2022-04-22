import { Component, OnInit } from '@angular/core';
import { NewPatient } from 'src/app/_models/newPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-newpatient',
  templateUrl: './newpatient.component.html',
  styleUrls: ['./newpatient.component.scss']
})
export class NewPatientComponent implements OnInit {
  PatientData: NewPatient;
  displayAddress: string;
  ValidAddressForUse: string;
  addressMessage: string;
  displayAddressDialog: boolean;
  PhonePattern: any;

  constructor(private utilityService: UtilityService) {
    this.PatientData = {
      PatinetHasNoEmail: false
    }
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }

  ngOnInit(): void {
  }

  UpdatePatient() {
    console.log(JSON.stringify(this.PatientData));
    this.utilityService.CreateNewPatient(this.PatientData).subscribe(resp => {
      if (resp.IsSuccess) {
      }
      else {
      }
    });
  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
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
}
