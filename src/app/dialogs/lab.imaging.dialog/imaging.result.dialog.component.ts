import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';

@Component({
  selector: 'app-addimagingresultdialog',
  templateUrl: './imaging.result.dialog.component.html',
  styleUrls: ['./imaging.result.dialog.component.scss']
})
export class ImagingResultDialogComponent implements OnInit {

  labandimaging: LabProcedureWithOrder

  constructor(private ref: EHROverlayRef,) {

    this.labandimaging = ref.RequestData;
    if(this.labandimaging.ImageResult == null)
    this.labandimaging.ImageResult = {}
    console.log(this.labandimaging);

  }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }

}
