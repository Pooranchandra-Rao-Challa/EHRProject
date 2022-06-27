
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service'
import { Patient, PatientPortalUser} from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { MatDialogConfig } from '@angular/material/dialog';
import { Actions } from 'src/app/_models/';
import { PatientPortalAccountComponent } from 'src/app/dialogs/patient.dialog/patient.portal.account.dialog.component';
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component';

@Component({
  selector: 'patient-dialog',
  templateUrl: './patient.dialog.component.html',
  styleUrls: ['./patient.dialog.component.scss'],
})
export class PatientDialogComponent {
  PatientData: Patient = { PatinetHasNoEmail: true, Gender: 'male' };
  PhonePattern: {};
  @Output() onPatientClose = new EventEmitter();
  ValidAddressForUse: string;
  addressMessage: string;
  displayAddressDialog: boolean;
  displayAddress: string = 'none';
  useThisAddress: boolean = false;
  AddressVerficationResult: any;
  hideSaveButton: boolean = false;
  patientPortalAccountComponent = PatientPortalAccountComponent;
  patientHealthPortalComponent = PatientHealthPortalComponent;


  constructor(private dialogRef: EHROverlayRef,
    private authService: AuthenticationService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage,
    private overlayService: OverlayService) {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };

  }
  cancel() {
    this.dialogRef.close({'refresh':true});
  }
  enableSave() {
    return !(this.PatientData.FirstName != null && this.PatientData.FirstName != ""
      && this.PatientData.LastName != null && this.PatientData.LastName != ""
      && this.PatientData.DateofBirth != null
      && this.PatientData.Gender != null && this.PatientData.Gender != ""
      && ((!this.PatientData.PatinetHasNoEmail &&
        this.PatientData.Email != null && this.PatientData.Email != "") || this.PatientData.PatinetHasNoEmail))
  }
  VerifyPatientAddress() {
    // console.log(this.PatientData.Address);
    this.utilityService.VerifyAddress(this.PatientData.Address).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientData.AddressResult = resp.Result;
        this.PatientData.ValidatedAddress = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"];
        this.ValidAddressForUse = this.PatientData.ValidatedAddress;
        this.addressMessage = resp.EndUserMessage;
        this.openPopupAddress();
        this.displayAddressDialog = false;
      }
      else {
        this.displayAddressDialog = true;
        this.openPopupAddress();
        this.addressMessage = resp.EndUserMessage;
      }
    });
  }

  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }

  UseValidatedAddress() {
    this.closePopupAddress();
    this.useThisAddress = true;
    console.log(this.PatientData.AddressResult);
    this.PatientData.City = this.PatientData.AddressResult.components.city_name;
    this.PatientData.State = this.PatientData.AddressResult.components.state_abbreviation;
    this.PatientData.StreetAddress = this.PatientData.AddressResult.delivery_line_1;
    this.PatientData.Zipcode = this.PatientData.AddressResult.components.zipcode;
    this.PatientData.Address = this.PatientData.ValidatedAddress;
  }
  UpdatePatient() {

    if(this.PatientData.StreetAddress == null || this.PatientData.StreetAddress == ""){
      if(this.PatientData.ValidatedAddress != null && this.PatientData.ValidatedAddress != "")
        this.PatientData.StreetAddress = this.PatientData.ValidatedAddress;
      else if(this.PatientData.Address != null && this.PatientData.Address != "")
        this.PatientData.StreetAddress = this.PatientData.Address;
    }
    this.PatientData.LocationId = this.authService.userValue.CurrentLocation;
    this.PatientData.ProviderId = this.authService.userValue.ProviderId;
    this.PatientData.ClinicId = this.authService.userValue.ClinicId;

    console.log(this.PatientData);

    this.utilityService.CreatePatient(this.PatientData).subscribe(resp => {

      if (resp.IsSuccess) {
        if(resp.Result != null){
          this.hideSaveButton =true;
          let patientPortalUser = resp.Result as PatientPortalUser;
          this.openComponentDialog(this.patientPortalAccountComponent,
            patientPortalUser, Actions.view)
        }
        else{
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

  downloadPDF(){
    // let patientDefService: PdfService = new PdfService();
    // let docDef: InvitationPdf = new InvitationPdf()
    // patientDefService.generatePdf(docDef.patientInviationDefinition())
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.patientPortalAccountComponent && action == Actions.view) {
      dialogData = data;
    }else if(content === this.patientHealthPortalComponent && action == Actions.view) {
      dialogData = data;
    }
    const ref = this.overlayService.open(content, dialogData);

    ref.afterClosed$.subscribe(res => {
      if (content === this.patientPortalAccountComponent) {
        if(res.data != null){
          this.utilityService.CreatePatientAccount(res.data).subscribe(resp => {
            if(resp.IsSuccess){
              this.openComponentDialog(this.patientHealthPortalComponent,
                res.data,Actions.view);
            }else{
              this.cancel();
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
            }
          });
        }
      }else if (content === this.patientHealthPortalComponent) {
        if(ref.data !== null){
          if(ref.data.download){
            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database

          }else if(ref.data.sendemail){
            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database
          }
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
