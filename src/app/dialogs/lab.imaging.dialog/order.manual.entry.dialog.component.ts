import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-odermanualentrydialog',
  templateUrl: './order.manual.entry.dialog.component.html',
  styleUrls: ['./order.manual.entry.dialog.component.scss']
})
export class OrderManualEntryDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
}
