import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-addimagingresultdialog',
  templateUrl: './imaging.result.dialog.component.html',
  styleUrls: ['./imaging.result.dialog.component.scss']
})
export class ImagingResultDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }

}
