import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Medication, GlobalConstants, PatientChart } from 'src/app/_models';

@Component({
  selector: 'app-discontinue.dialog',
  templateUrl: './discontinue.dialog.component.html',
  styleUrls: ['./discontinue.dialog.component.scss']
})
export class DiscontinueDialogComponent implements OnInit {
  patientMedication: Medication = new Medication();
  reasonCodes: GlobalConstants;
  reasonCodesFilter: GlobalConstants;

  constructor(private ref: EHROverlayRef) {
    this.patientMedication = new Medication;
  }

  ngOnInit(): void {
    this.reasonCodes = GlobalConstants.PROCEDURE_REASON_CODES;
    this.reasonCodesFilter = this.reasonCodes.slice();
  }

  cancel() {
    this.ref.close(null);
  }

  selectReason(reason: any) {
    this.patientMedication.ReasonCode = reason.Code;
    this.patientMedication.ReasonDescription = reason.Description;
  }

  saveReason(reason) {
    this.ref.close(reason);
  }

}
