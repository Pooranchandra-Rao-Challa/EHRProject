import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';

@Component({
  selector: 'app-smoking.status.dialog',
  templateUrl: './smoking.status.dialog.component.html',
  styleUrls: ['./smoking.status.dialog.component.scss']
})
export class SmokingStatusDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

}
