import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-ccda.preview.dialog',
  templateUrl: './ccda.preview.dialog.component.html',
  styleUrls: ['./ccda.preview.dialog.component.scss']
})
export class CcdaPreviewDialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close(null);
  }

}
