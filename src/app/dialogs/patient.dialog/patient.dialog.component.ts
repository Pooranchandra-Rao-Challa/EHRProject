import { DatePipe, PlatformLocation } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service'
import { Patient, PatientPortalUser, Actions } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientPortalAccountComponent } from 'src/app/dialogs/patient.dialog/patient.portal.account.dialog.component';
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component';
import { AddressVerificationDialogComponent, AddressValidation } from 'src/app/dialogs/address.verification.dialog/address.verification.dialog.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// import htmlToPdfmake from 'html-to-pdfmake';

import { Accountservice } from 'src/app/_services/account.service';
import { timeStamp } from 'console';

@Component({
  selector: 'patient-dialog',
  templateUrl: './patient.dialog.component.html',
  styleUrls: ['./patient.dialog.component.scss'],
})
export class PatientDialogComponent {
  PatientData: Patient = { PatinetHasNoEmail: true, Gender: 'male' };
  PhonePattern: {};
  @Output() onPatientClose = new EventEmitter();
  hideSaveButton: boolean = false;
  addressIsVarified: boolean = false;
  patientPortalAccountComponent = PatientPortalAccountComponent;
  patientHealthPortalComponent = PatientHealthPortalComponent;
  addressVerificationDialogComponent = AddressVerificationDialogComponent;
  todayDate: Date;
  url: string;
  emailVerfied?: boolean = null;
  emailVerficationMessage?: string;
  emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;

  constructor(private dialogRef: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService,
    private plaformLocation: PlatformLocation,
    private accountservice: Accountservice,
    private datePipe: DatePipe) {
    this.url = plaformLocation.href.replace(plaformLocation.pathname, '/');
    if (plaformLocation.href.indexOf('?') > -1)
      this.url = plaformLocation.href.substring(0, plaformLocation.href.indexOf('?')).replace(plaformLocation.pathname, '/');

    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.todayDate = new Date();
  }
  cancel() {
    this.dialogRef.close({ 'refresh': true });
  }

  phonepattern =/^[0-9]{10}/;
  email = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;

  enableSave() {
    return !(this.PatientData.FirstName != null && this.PatientData.FirstName != ""
      && this.PatientData.LastName != null && this.PatientData.LastName != ""
      && this.PatientData.DateofBirth != null
      && this.PatientData.Gender != null && this.PatientData.Gender != ""
      && ((!this.PatientData.PatinetHasNoEmail && this.emailVerfied == true &&
        this.emailPattern.test(this.PatientData.Email)) || this.PatientData.PatinetHasNoEmail))
  }

  checkEmailExistance() {
    if (this.PatientData.PatinetHasNoEmail) {
      this.emailVerfied = null;
      this.emailVerficationMessage = "";
    } else {
      if (this.emailPattern.test(this.PatientData.Email))
        this.accountservice.CheckEmailAvailablity({ Email: this.PatientData.Email }).subscribe((resp) => {
          this.emailVerfied = resp.IsSuccess;
          this.emailVerficationMessage = resp.EndUserMessage
        })
      else this.emailVerfied = null;
    }
  }
  showHourglass:boolean = false;
  VerifyPatientAddress() {
    this.showHourglass = true;
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      let av = new AddressValidation();
      this.showHourglass = false;
      if (resp.IsSuccess) {
        av.IsValid = true;
        av.Address = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"]
        av.ValidatedAddress = resp.Result;
      }
      else {
        av.IsValid = false;
      }
      this.openComponentDialog(this.addressVerificationDialogComponent, av, Actions.view);
    });
  }


  UseValidatedAddress() {
    this.PatientData.City = this.PatientData.AddressResult.components.city_name;
    this.PatientData.State = this.PatientData.AddressResult.components.state_abbreviation;
    this.PatientData.StreetAddress = this.PatientData.AddressResult.delivery_line_1;
    this.PatientData.Zipcode = this.PatientData.AddressResult.components.zipcode;
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  saveInvoked:boolean=false;
  UpdatePatient() {
    this.hideSaveButton = true;
    this.saveInvoked = true;
    if (this.PatientData.StreetAddress == null || this.PatientData.StreetAddress == "") {
      if (this.PatientData.ValidatedAddress != null && this.PatientData.ValidatedAddress != "")
        this.PatientData.StreetAddress = this.PatientData.ValidatedAddress;
      else if (this.PatientData.Address != null && this.PatientData.Address != "")
        this.PatientData.StreetAddress = this.PatientData.Address;
    }
    this.PatientData.LocationId = this.authService.userValue.CurrentLocation;
    this.PatientData.ProviderId = this.authService.userValue.ProviderId;
    this.PatientData.ClinicId = this.authService.userValue.ClinicId;
    this.PatientData.strDateofBirth = this.datePipe.transform(this.PatientData.DateofBirth, "MM/dd/yyyy");
    this.utilityService.CreatePatient(this.PatientData).subscribe(resp => {
      this.saveInvoked = false;
      if (resp.IsSuccess) {
        if (resp.Result != null) {

          let patientPortalUser = resp.Result as PatientPortalUser;
          this.openComponentDialog(this.patientPortalAccountComponent,
            patientPortalUser, Actions.view)
        }
        else {
          this.cancel();
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP001"])
        }
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP001"])
      }
    });

  }

  ClearEmailWhenPatientHasNoEmail(event) {
    this.PatientData.Email = "";
  }

  // downloadPDF(html) {

  //   let html1 = '<style>/* patient email template css from here to end of the style*/.patient-invitation {border: 1px solid #979797;border-radius: 18px;margin: 72px auto;width: 801px  }  .patient-invitation table {border-collapse: collapse;margin: -1px;}  .patient-invitation table tfoot tr td {border: 0;border-radius: 0 0 16px 16px;height: 25px;padding: 0 60px;background-color: #41b6a6;}  .patient-invitation table tfoot tr td p {color: #fff;font-family: \'Times New Roman\';font-size: 14px;margin: 0}  .patient-invitation table tbody {width: 100%;}  .patient-invitation table tbody tr td.patient-content {border: 0;padding: 7px 60px;}  .patient-invitation table tbody tr td.patient-content p.content {color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0}.patient-invitation table tbody tr td.patient-content p.undersignee {color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0;font-weight: bold;}  .patient-invitation table tbody tr td.patient-content p.creds {border: 2px solid #41b6a6;border-radius: 6px;color: #000;font-family: \'Times New Roman\';font-size: 14px;margin: 0 auto;padding: 15px 50px;width: 40%}  .patient-invitation table tbody tr td.patient-content p.creds span {margin: 21% } .patient-invitation table tbody tr td.patient-title {border: 0;padding: 40px 60px 7px}  .patient-invitation table tbody tr td.patient-title p.title {border-bottom-color: #000;border-bottom-style: solid;border-bottom-width: 1px;border-top-color: #000;border-top-style: solid;border-top-width: 1px;font-family: \'Times New Roman\';font-size: 34px;margin: 0;padding: 10px;text-align: center;}  .patient-invitation table tbody tr td.patient-title p.title span {font-weight: bold;text-decoration: underline;}  </style>  <div class="patient-invitation" id="patientinvitation">  <table class="patienttablealignments" style="width:50%;"><thead><tr><td><a href="https://1.ehr.one"><img alt="Logo header mailer" width="680" src="http://localhost:4200/assets/images/logo-header-mailer.png"></a></td></tr></thead><tbody><tr><td class="patient-title"><p class="title"><span class="practice">Burns Dental Group</span> is pleased to offer you access to your Patient Portal through EHR1!</p></td></tr><tr><td class="patient-content"><p class="content">Dear Devid Kumar,</p></td></tr><tr><td class="patient-content"><p class="content">For your convenience we have created your patient portal account for you!</p></td></tr><tr><td class="patient-content"><p class="content">Visit us at<a href="https://1.ehr.one"></a></p></td></tr><tr><td class="patient-content"><p class="content">Please help us keep you in the loop; once logged in, please view your clinical summary via your Messages andbegin taking advantage of all of our services!</p></td></tr><tr><td class="patient-content"><p class="content">Sincerely,</p></td></tr><tr><td class="patient-content"><p class="undersignee">Your EHR1 Support Team</p></td></tr><tr><td class="patient-content"><p class="creds"><span>Username: noxoowji<br><br></span><span>Password: UA7gdgg<br></span></p></td></tr><tr><td class="patient-content"><p class="content">API Access Feature – Access or Link Health Information</p></td></tr><tr><td class="patient-content"><p class="content">Credentials can be used to authenticate to a third-party application if it hasbeen registered with EHR1 and has connected to our public API. For assistance registering new applications,submit a support ticket.</p></td></tr></tbody><tfoot><tr><td><p class="llcfooter">© 2022 EHR One, LLC</p></td></tr></tfoot></table></div>';
  //   // let patientDefService: PdfService = new PdfService();
  //   // let docDef: InvitationPdf = new InvitationPdf()
  //   // patientDefService.generatePdf(docDef.patientInviationDefinition())
  //   var PDF = new jsPDF();
  //   //var html = htmlToPdfmake(html);
  //   //console.log(html1);
  //   var parser = new DOMParser();
	//   var doc = parser.parseFromString(html1, 'text/html');
  //   var element1 = doc.getElementById("patientinvitation");
  //   var element = document.createElement("div");
  //   element.innerHTML = html1;

  //   // html2canvas(element1, { scale: 3 }).then((canvas) => {
  //   //   const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
  //   //   const fileWidth = 200;
  //   //   const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
  //   //   let PDF = new jsPDF('p', 'mm', 'a4',);
  //   //   PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
  //   //   PDF.html(html1)
  //   //   PDF.save('angular-invoice-pdf-demo.pdf');
  //   // });

  //   PDF.html(html1)
  //   PDF.save('angular-invoice-pdf-demo.pdf');

  //   // var html2 = htmlToPdfmake(html1,{
  //   //   imagesByReference:true,
  //   //   tableAutoSize:true
  //   // });

  //   // console.log(html2);
  //   // html2.content[0].stack[1]["layout"] = "ehrlayout";
  //   // console.log(html2.content[0].stack[1]);

  //   // const documentDefinition = {
  //   //   pageSize: 'A4',
  //   //   content: html2.content,
  //   //   images:html2.images,
  //   //   styles:{
  //   //     'patient-invitation':{
  //   //       width:'400px',
  //   //       height:'100%'
  //   //     },
  //   //     'patienttablealignments':{
  //   //       border:0
  //   //     },
  //   //     'table-tr':{
  //   //       border: 0
  //   //     },
  //   //     'table-td':{
  //   //       border: 0
  //   //     },
  //   //     'practice':{
  //   //       fontSize: 34
  //   //     }
  //   //   }
  //   // };
  //   // pdfMake.tableLayouts = {
  //   //   ehrlayout: {
	// 	// 		hLineWidth: function (i, node) {
	// 	// 			return (i === 0 || i=== 1 || i === node.table.body.length) ? 1 : 0;
	// 	// 		},
	// 	// 		vLineWidth: function (i, node) {
	// 	// 			return (i === 0 || i === node.table.widths.length) ? 1 : 0;
	// 	// 		},
	// 	// 		hLineColor: function (i, node) {
	// 	// 			return (i === 0 || i === node.table.body.length) ? '#41b6a6' : 'gray';
	// 	// 		},
	// 	// 		vLineColor: function (i, node) {
	// 	// 			return (i === 0 || i === node.table.widths.length) ? '#41b6a6' : 'gray';
	// 	// 		},
	// 	// 		// hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
	// 	// 		// vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
	// 	// 		paddingLeft: function(i, node) {
  //   //       //return (i === 0 || i === node.table.widths.length) ? '0' : '4';
  //   //       console.log(i, " ",node);

  //   //       return 0;
  //   //     },
	// 	// 		paddingRight: function(i, node) {
  //   //       return (i === 0 || i=== 1 || i === node.table.body.length) ? 0 : 4;
  //   //       return 0;
  //   //     },
	// 	// 		paddingTop: function(i, node) {
  //   //       return (i === 0 || i === node.table.widths.length) ? 0 : 4;
  //   //     },
	// 	// 		paddingBottom: function(i, node) {
  //   //       return (i === 0 || i === node.table.widths.length) ? 0 : 4;
  //   //     },
	// 	// 		// fillColor: function (rowIndex, node, columnIndex) { return null; }
	// 	// 	}
  //   // };
  //   // pdfMake.createPdf(documentDefinition).download("test.pdf");

  // }

  // _completePatientAccountProcess(data) {
  //   let patient: PatientPortalUser = data.patientUser;
  //   patient.SendInvitation = data.sendemail;
  //   patient.URL = this.url;
  //   this.utilityService.CompletePatientAccountProcess(patient).subscribe(resp => {
  //     if (resp.IsSuccess) {
  //       this.cancel();
  //       if (data.download) {
  //         this.downloadPDF(resp.Result.html);
  //         //'straight' update to database which receied from ref.data
  //         // Update Patient with invivation_sent_at, straight_invitation to database
  //         this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP002"])
  //       } else if (data.sendemail) {

  //         //'straight' update to database which recied from ref.data
  //         // Update Patient with invivation_sent_at, straight_invitation to database
  //         //Invitation successfully sent to patient email
  //       }

  //       //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
  //     } else {
  //       this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
  //     }
  //   });
  // }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.patientPortalAccountComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.patientHealthPortalComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.addressVerificationDialogComponent && action == Actions.view) {
      dialogData = data;
    }
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.patientPortalAccountComponent) {
        if (res.data != null) {
          this.utilityService.CreatePatientAccount(res.data).subscribe(resp => {
            if (resp.IsSuccess) {
              this.openComponentDialog(this.patientHealthPortalComponent,
                res.data, Actions.view);
                //this.cancel();
            } else {
              this.cancel();
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
            }
          });
        }
      }
      else if (content === this.patientHealthPortalComponent) {
        this.cancel();
        // if (res.data !== null) {
        //   this._completePatientAccountProcess(res.data);
        // } else {
        //   this.cancel();
        // }
      }

      else if (content === this.addressVerificationDialogComponent) {
        if (res.data && res.data.useThis.UseAddress) {
          this.PatientData.AddressResult = res.data.useThis.ValidatedAddress;
          this.PatientData.ValidatedAddress = res.data.useThis.Address;
          this.addressIsVarified = true;
          this.UseValidatedAddress();
        } else if (res.data && !res.data.UseAddress) {

        }
      }
    });
  }
}
