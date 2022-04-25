import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';

@Component({
  selector: 'app-intervention.dialog',
  templateUrl: './intervention.dialog.component.html',
  styleUrls: ['./intervention.dialog.component.scss']
})
export class InterventionDialogComponent implements OnInit {
  interventionColumns: ['Empty', 'InterventionType', 'Code', 'Description', 'ReasonNotPerformed', 'Reason'];
  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }
}
