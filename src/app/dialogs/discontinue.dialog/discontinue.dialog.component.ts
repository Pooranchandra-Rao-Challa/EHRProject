import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';

@Component({
  selector: 'app-discontinue.dialog',
  templateUrl: './discontinue.dialog.component.html',
  styleUrls: ['./discontinue.dialog.component.scss']
})
export class DiscontinueDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }
}
