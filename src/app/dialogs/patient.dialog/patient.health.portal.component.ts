import { PlatformLocation } from '@angular/common';
import {
  Component, ElementRef, ViewChild,
} from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientPortalUser } from 'src/app/_models/_account/NewPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TransitionCheckState } from '@angular/material/checkbox';

@Component({
  selector: 'patient-health-portal-dialog',
  templateUrl: './patient.health.portal.component.html',
  styleUrls: ['./patient.health.portal.component.scss'],
})
export class PatientHealthPortalComponent{
  @ViewChild('iframe', { static: true })
  iframe: ElementRef;
  doc;
  element;
  patientUser: PatientPortalUser;
  doReportProcess: boolean = false;
  reportInvoked:boolean = false;
  url:string;
  constructor(private dialogRef: EHROverlayRef,
    private plaformLocation: PlatformLocation,
    private utilityService: UtilityService,){
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    if (plaformLocation.href.indexOf('?') > -1)
      this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');
    this.patientUser = dialogRef.data //as PatientPortalUser;
    this.patientUser.URL = this.url;

  }
  cancel(){
    this.dialogRef.close();
  }

  downloadInviteasPDF(){
    this.patientUser.SendInvitation = false;
    this.reportInvoked = true;
    this._completePatientAccountProcess();
    //this.dialogRef.close({'download':true,patientUser: this.patientUser });
  }

  sendInviteToEmailAddress(){
    this.patientUser.SendInvitation = true;
    this.reportInvoked = true;
    this._completePatientAccountProcess();
    //this.dialogRef.close({'sendemail':true,patientUser: this.patientUser });
  }
  onLoad(iframe) {
    this.doc = iframe.contentDocument || iframe.contentWindow;
  }
  get iframedisplay():string{
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
      PDF.save(this.patientUser.PatientId+'.pdf');
      this.cancel()
    });
  }

  _completePatientAccountProcess(flag: boolean = false) {
    this.utilityService.CompletePatientAccountProcess(this.patientUser).subscribe(resp => {
      if (resp.IsSuccess) {
        if (!flag) {
          this.doReportProcess = true;
          this.reportInvoked = false;
          this.element = document.createRange().createContextualFragment(resp.Result.Html);
          this.iframe.nativeElement.contentDocument.body.appendChild(this.element)
          //this.downloadPDF();

          //'straight' update to database which receied from ref.data
          // Update Patient with invivation_sent_at, straight_invitation to database
          //this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP002"])
        } else {

          //'straight' update to database which recied from ref.data
          // Update Patient with invivation_sent_at, straight_invitation to database
          //Invitation successfully sent to patient email
          this.cancel()
        }

        //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      }
      // else {
      //   this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      // }
    });
  }
}
