import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-addimagingresultdialog',
  templateUrl: './addimagingresultdialog.component.html',
  styleUrls: ['./addimagingresultdialog.component.scss']
})
export class AddimagingresultdialogComponent implements OnInit {

  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
  
}
