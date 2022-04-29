import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';

@Component({
  selector: 'app-intervention.dialog',
  templateUrl: './intervention.dialog.component.html',
  styleUrls: ['./intervention.dialog.component.scss']
})
export class InterventionDialogComponent implements OnInit {
  interventionColumns: string[] = ['Empty', 'InterventionType', 'Code', 'Description', 'ReasonNotPerformed', 'Reason'];
  interventionList: any[] = [];
  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
    this.interventionList = [
      { Empty: 1, InterventionType: 'Hydrogen', Code: 1.0079, Description: 'H', ReasonNotPerformed: 'gerg', Reason: 'eger' },
      { Empty: 2, InterventionType: 'Helium', Code: 4.0026, Description: 'He', ReasonNotPerformed: 'trhrt', Reason: 'eger' }
    ]
  }

  cancel() {
    this.ref.close(null);
  }
}
