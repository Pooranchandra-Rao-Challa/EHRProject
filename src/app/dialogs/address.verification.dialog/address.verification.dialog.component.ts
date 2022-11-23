import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

export class AddressValidation {
  Address?: string;
  IsValid?: boolean
  ValidatedAddress?: any;
  UseAddress?: boolean = false;
}
@Component({
  selector: 'app-address-verification-dialog',
  templateUrl: './address.verification.dialog.component.html',
  styleUrls: ['./address.verification.dialog.component.scss']
})
export class AddressVerificationDialogComponent implements OnInit {
  addressValidation: AddressValidation = {};

  constructor(private dialogRef: EHROverlayRef) {
    this.addressValidation = this.dialogRef.RequestData;
  }

  ngOnInit(): void {
  }

  close() {
    this.addressValidation.UseAddress = false;
    this.dialogRef.close({ 'useThis': this.addressValidation });
  }

  useThis() {
    this.addressValidation.UseAddress = true;
    this.dialogRef.close({ 'useThis': this.addressValidation })
  }
}
