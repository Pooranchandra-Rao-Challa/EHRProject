import { PlatformLocation } from '@angular/common';
import {
  Component, ElementRef, ViewChild,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientPortalUser } from 'src/app/_models/_account/NewPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'reset-patient-password-dialog',
  templateUrl: './reset.password.html',
  styleUrls: ['./reset.password.scss'],
})
export class ResetPatientPasswordComponent {
  @ViewChild('iframe', { static: true })
  iframe: ElementRef;
  doc;
  element;
  patientUser: PatientPortalUser;
  doReportProcess: boolean = false;
  reportInvoked: boolean = false;
  url: string;
  constructor(private dialogRef: EHROverlayRef,
    private plaformLocation: PlatformLocation,
    private utilityService: UtilityService,
    private alterMessage: AlertMessage) {
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    if (plaformLocation.href.indexOf('?') > -1)
      this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');

    this.patientUser = dialogRef.data
    this.patientUser.URL = this.url;
    this.updateResetPassword();
  }
  cancel() {
    this.dialogRef.close({ refesh: true });
  }

  refreshView() {
    this.dialogRef.close({ refesh: true });
  }

  hasValidEmail() {


  }
  downloadInviteasPDF() {
    this.patientUser.SendInvitation = false;
    this.reportInvoked = true;
    //this._completePatientAccountProcess();
  }


  onLoad(iframe) {
    this.doc = iframe.contentDocument || iframe.contentWindow;
  }
  get iframedisplay(): string {
    return !this.doReportProcess ? 'none' : 'block';
  }


  downloadPDF() {
    this.reportInvoked = true;
    html2canvas(this.iframe.nativeElement.contentDocument.body).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 10;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.html(this.iframe.nativeElement.contentDocument.body.innerHtml);
      PDF.save(this.patientUser.PatientId + '.pdf');
      this.refreshView()
      this.alterMessage.displayMessageDailog(ERROR_CODES["AP001"]);
    });
  }

  updateResetPassword() {
    this.utilityService.UpdateResetPassword(this.patientUser).subscribe(resp => {
      if (resp.IsSuccess) {
        this.doReportProcess = true;
        this.reportInvoked = false;
        this.element = document.createRange().createContextualFragment(resp.Result.Html);
        this.iframe.nativeElement.contentDocument.body.appendChild(this.element)
      }
      else {
        this.reportInvoked = false;
        this.alterMessage.displayErrorDailog(ERROR_CODES["E2AP004"])
      }
    });
  }
}
