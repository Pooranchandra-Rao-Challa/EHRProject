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
import * as jspdf from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { Accountservice } from 'src/app/_services/account.service';

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

  VerifyPatientAddress() {
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      let av = new AddressValidation();
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
  UpdatePatient() {
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

      if (resp.IsSuccess) {
        if (resp.Result != null) {
          this.hideSaveButton = true;
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

  downloadPDF(html) {
    // let patientDefService: PdfService = new PdfService();
    // let docDef: InvitationPdf = new InvitationPdf()
    // patientDefService.generatePdf(docDef.patientInviationDefinition())
    var pdfdoc = new jspdf.jsPDF();
    var html = htmlToPdfmake(html);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }

  _completePatientAccountProcess(data) {
    let patient: PatientPortalUser = data.patientUser;
    patient.SendInvitation = data.sendemail;
    patient.URL = this.url;
    this.utilityService.CompletePatientAccountProcess(patient).subscribe(resp => {
      if (resp.IsSuccess) {
        this.cancel();
        if (data.download) {
          this.downloadPDF(resp.html);
          //'straight' update to database which receied from ref.data
          // Update Patient with invivation_sent_at, straight_invitation to database
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP002"])
        } else if (data.sendemail) {

          //'straight' update to database which recied from ref.data
          // Update Patient with invivation_sent_at, straight_invitation to database
          //Invitation successfully sent to patient email
        }

        //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      } else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      }
    });
  }
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
            } else {
              this.cancel();
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
            }
          });
        }
      } else if (content === this.patientHealthPortalComponent) {
        if (res.data !== null) {
          this._completePatientAccountProcess(res.data);
        } else {
          this.cancel();
        }
      } else if (content === this.addressVerificationDialogComponent) {
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

// export class InvitationPdf{

//   patientInviationDefinition(){
//     let docDefinition = {
//       // footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
//       // header: function(currentPage, pageCount, pageSize) {
//       //   // you can apply any logic and return any valid pdfmake element

//       //   return [
//       //     { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
//       //     { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
//       //   ]
//       // },
//       content: [
//         {
//         canvas: [
//           {
//             type: 'rect',
//             x: 0,
//             y: 0,
//             w: 485,
//             h: 400,
//             r: 5,
//             lineColor: 'gray',
//           },
//         ]
//         },
//       {
//         image: '../../../../assets/images/logo-header-mailer.png',
//         style: 'tableExample',
//         table: {
//           headerRows: 1,
//           body: [
//             [{text: 'Header 1', style: 'tableHeader'}, {text: 'Header 2', style: 'tableHeader'}, {text: 'Header 3', style: 'tableHeader'}],

//           ]
//         },
//         layout: 'headerLineOnly',
//         absolutePosition: {x: 45, y: 50}
//       },
//     ],
//     };
//     return docDefinition;
//   }

//   tableLayouts(){

//     return {
//       exampleLayout: {
//         hLineWidth: function (i, node) {
//           if (i === 0 || i === node.table.body.length) {
//             return 0;
//           }
//           return (i === node.table.headerRows) ? 2 : 1;
//         },
//         vLineWidth: function (i) {
//           return 0;
//         },
//         hLineColor: function (i) {
//           return i === 1 ? 'black' : '#aaa';
//         },
//         paddingLeft: function (i) {
//           return i === 0 ? 0 : 8;
//         },
//         paddingRight: function (i, node) {
//           return (i === node.table.widths.length - 1) ? 0 : 8;
//         }
//       }
//     };
//   }

// }


// export class PdfService {

//   pdfMake: any;

//   constructor() { }

//   async loadPdfMaker() {
//     if (!this.pdfMake) {
//       const pdfMakeModule = await import('pdfmake/build/pdfmake');
//       const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
//       this.pdfMake = pdfMakeModule.default;
//       this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
//     }
//   }

//   async generatePdf(def) {

//     await this.loadPdfMaker();


//     this.pdfMake.createPdf(def).download();
//   }

// }
