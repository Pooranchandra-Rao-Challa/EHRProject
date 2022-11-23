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
    private utilityService: UtilityService,
    private alterMessage: AlertMessage){
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    if (plaformLocation.href.indexOf('?') > -1)
      this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');
    this.patientUser = dialogRef.data //as PatientPortalUser;
    this.patientUser.URL = this.url;
  }
  cancel(){
    this.dialogRef.close({refesh:true});
  }

  refreshView(){
    this.dialogRef.close({refesh:true});
  }

  hasValidEmail(){


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
    this._completePatientAccountProcess(true);
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
      this.refreshView()
      this.alterMessage.displayMessageDailog(ERROR_CODES["AP001"]);
    });
  }

  _completePatientAccountProcess(flag: boolean = false) {
    this.utilityService.CompletePatientAccountProcess(this.patientUser).subscribe(resp => {
      if (resp.IsSuccess) {
        console.log(resp);

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
          this.refreshView()
        }

        //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      }
      else {
        this.reportInvoked = false;
        this.alterMessage.displayErrorDailog(ERROR_CODES["E2AP004"])
      }
    });
  }
}

/*CreateUpdateInsuranceDetails*/
/**getDocumentDefinition() {
    sessionStorage.setItem('resume', JSON.stringify(this.resume));
    return {
      content: [
        {
          text: 'RESUME',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            [{
              text: this.resume.name,
              style: 'name'
            },
            {
              text: this.resume.address
            },
            {
              text: 'Email : ' + this.resume.email,
            },
            {
              text: 'Contant No : ' + this.resume.contactNo,
            }
            ]
          ]
        },
        {
          text: 'Skills',
          style: 'header'
        },
        {
          columns : [
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 0).map(s => s.value)
              ]
            },
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 1).map(s => s.value)
              ]
            },
            {
              ul : [
                ...this.resume.skills.filter((value, index) => index % 3 === 2).map(s => s.value)
              ]
            }
          ]
        }
      ],
      info: {
        title: this.resume.name + '_RESUME',
        author: this.resume.name,
        subject: 'RESUME',
        keywords: 'RESUME, ONLINE RESUME',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableHeader: {
            bold: true,
          }
        }
    };
  } */
