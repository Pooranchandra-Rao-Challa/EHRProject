import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-patient.education.material.dialog',
  templateUrl: './patient.education.material.dialog.component.html',
  styleUrls: ['./patient.education.material.dialog.component.scss']
})
export class PatientEducationMaterialDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }
}
