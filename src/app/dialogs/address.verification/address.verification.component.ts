import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/_models/newPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-address.verification',
  templateUrl: './address.verification.component.html',
  styleUrls: ['./address.verification.component.scss']
})
export class AddressVerificationComponent implements OnInit {
  displayAddress: string;
  displayAddressDialog: boolean;
  addressMessage: string;
  ValidAddressForUse: string;
  PatientData: Patient;

  constructor(private utilityService: UtilityService) {
    this.PatientData = {
      PatinetHasNoEmail: false
    }
  }

  ngOnInit(): void {
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
}
