import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-rx.prescription.info.dialog',
  templateUrl: './rx.prescription.info.dialog.component.html',
  styleUrls: ['./rx.prescription.info.dialog.component.scss']
})
export class RxPrescriptionInfoDialogComponent implements OnInit {
  patientAllergies: string = 'Allergies Not Entered';

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel(){
    this.ref.close(null);
  }

}
