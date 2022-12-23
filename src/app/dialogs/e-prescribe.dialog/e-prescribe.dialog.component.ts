import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-e-prescribe.dialog',
  templateUrl: './e-prescribe.dialog.component.html',
  styleUrls: ['./e-prescribe.dialog.component.scss']
})
export class EPrescribeDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

}
