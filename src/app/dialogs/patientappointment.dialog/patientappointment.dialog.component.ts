import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-patientappointment.dialog',
  templateUrl: './patientappointment.dialog.component.html',
  styleUrls: ['./patientappointment.dialog.component.scss']
})
export class PatientappointmentDialogComponent implements OnInit {
  displayReq = "none";
  hoverDATE:string='Date';
  hoverTime:string='Date';
  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
}
