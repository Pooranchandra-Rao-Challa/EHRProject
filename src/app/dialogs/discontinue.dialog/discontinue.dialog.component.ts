import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import {  GlobalConstants } from 'src/app/_models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-discontinue.dialog',
  templateUrl: './discontinue.dialog.component.html',
  styleUrls: ['./discontinue.dialog.component.scss']
})
export class DiscontinueDialogComponent implements OnInit {

  reasonCodes: GlobalConstants;
  reasonCode:any = {};
  reasonCodesFilter: GlobalConstants;
  constructor(private ref: EHROverlayRef) {
    this.reasonCode.StopAt = new Date()
  }

  ngOnInit(): void {
    this.reasonCodes = GlobalConstants.PROCEDURE_REASON_CODES;
    this.reasonCodesFilter = this.reasonCodes.slice();
  }

  cancel() {
    this.ref.close(null);
  }

  selectReason(reason: any) {
    this.reasonCode.Code = reason.Code;
    this.reasonCode.Description = reason.Description;
  }

  saveReason() {
    this.ref.close({ reason: this.reasonCode });
  }

}
