import { DownloadService } from './../../_services/download.service';
import { Attachment } from './../../_models/_provider/LabandImage';
import { OverlayService } from './../../overlay.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, CCDAParams, User } from 'src/app/_models';
import { CcdaPreviewDialogComponent } from '../ccda.preview.dialog/ccda.preview.dialog.component';
import { NewMessageDialogComponent } from 'src/app/dialogs/newmessage.dialog/newmessage.dialog.component';
import { PatientService } from 'src/app/_services/patient.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { error } from 'console';


@Component({
  selector: 'app-c-cda.dialog',
  templateUrl: './c-cda.dialog.component.html',
  styleUrls: ['./c-cda.dialog.component.scss']
})
export class CCdaDialogComponent implements OnInit {
  @ViewChild('patientInformationToggle') private patientInformationToggle: MatCheckbox;
  @ViewChildren('patientInformationCheckboxes') private patientInformationCheckboxes: QueryList<any>;
  @ViewChild('encounterDetailsToggle') private encounterDetailsToggle: MatCheckbox;
  @ViewChildren('encounterDetailsCheckboxes') private encounterDetailsCheckboxes: QueryList<any>;
  @ViewChild('patientChartInformationToggle') private patientChartInformationToggle: MatCheckbox;
  @ViewChildren('patientChartInformationCheckboxes') private patientChartInformationCheckboxes: QueryList<any>;
  @ViewChild('transitionofCareDatailsToggle') private transitionofCareDatailsToggle: MatCheckbox;
  @ViewChildren('transitionofCareDatailsCheckboxes') private transitionofCareDatailsCheckboxes: QueryList<any>;
  enconterDetails: boolean = true;
  toggleButtonVisibility: boolean = false;
  ccdaPreviewDialogComponent = CcdaPreviewDialogComponent;
  ActionTypes = Actions;
  c_CDAParams: CCDAParams = new CCDAParams();
  MessageDialogComponent = NewMessageDialogComponent;
  user: User
  patient: ProviderPatient
  dialogIsLoading: boolean = false;

  constructor(
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private overlayService: OverlayService,
    private patientService: PatientService,
    private downloadService: DownloadService,
    private alertMessage: AlertMessage,) {
  }

  ngOnInit(): void {
    this.user = this.authService.userValue;
    this.patient = this.authService.viewModel.Patient;
    this.c_CDAParams.PatientId = this.patient.PatientId;
    this.c_CDAParams.ProviderId = this.user.ProviderId;
    //console.log(this.patient);

  }

  cancel() {
    this.ref.close(null);
  }

  TogglePatients(event) {
    this._doCheckActions(this.patientInformationCheckboxes, event.source.checked);
    this.c_CDAParams.PatientInformation.forEach(source => {
      source.Value = event.source.checked;
    });
  }

  ToggleEncounter(event) {
    this._doCheckActions(this.encounterDetailsCheckboxes, event.source.checked);
    this.c_CDAParams.EncounterDetails.forEach(source => {
      source.Value = event.source.checked;
    });
  }

  TogglePatientChartInfo(event) {
    this._doCheckActions(this.patientChartInformationCheckboxes, event.source.checked);
    this.c_CDAParams.PatientChartInformation.forEach(source => {
      source.Value = event.source.checked;
    });
  }

  ToggleTransititionDetails(event) {
    this._doCheckActions(this.transitionofCareDatailsCheckboxes, event.source.checked);
    this.c_CDAParams.TransitionofCareDetails.forEach(source => {
      source.Value = event.source.checked;
    });
  }

  _doCheckActions(checkboxes: QueryList<any>, flag: boolean) {
    checkboxes.toArray().forEach(source => {
      source.checked = flag;
    })
  }

  verifyPatentToggler(event, patient) {
    this._doVerficationCheckboxGroup(this.patientInformationCheckboxes, this.patientInformationToggle);
    this.c_CDAParams.PatientInformation.forEach(source => {
      if (source.Name == patient.Name) {
        source.Value = event.source.checked;
      }
    });
  }

  verifyEncounterToggler(event, encounter) {
    this._doVerficationCheckboxGroup(this.encounterDetailsCheckboxes, this.encounterDetailsToggle);
    this.c_CDAParams.EncounterDetails.forEach(source => {
      if (source.Name == encounter.Name) {
        source.Value = event.source.checked;
      }
    });
  }

  verifyPatientChartInfoToggler(event, patientinfo) {
    this._doVerficationCheckboxGroup(this.patientChartInformationCheckboxes, this.patientChartInformationToggle);
    this.c_CDAParams.PatientChartInformation.forEach(source => {
      if (source.Name == patientinfo.Name) {
        source.Value = event.source.checked;
      }
    });
  }

  verifyTransitionofCareDatailsToggler(event, transitionofCareDatails) {
    this._doVerficationCheckboxGroup(this.transitionofCareDatailsCheckboxes, this.transitionofCareDatailsToggle);
    this.c_CDAParams.TransitionofCareDetails.forEach(source => {
      if (source.Name == transitionofCareDatails.Name) {
        source.Value = event.source.checked;
      }
    });
  }

  _doVerficationCheckboxGroup(checkboxes: QueryList<any>, checkbox: MatCheckbox) {
    let flag = true;
    checkboxes.toArray().forEach(source => {
      if (flag) flag = source.checked;
    })
    checkbox.checked = flag;
  }

  enableEncouterDetails() {
    this.enconterDetails = true;
  }

  enableTransitionDetails() {
    this.enconterDetails = false;
  }

  toggleSelectAll(flag: boolean) {
    this._doCheckActions(this.patientInformationCheckboxes, flag);
    if (this.enconterDetails) {
      this._doCheckActions(this.encounterDetailsCheckboxes, flag);
      this.encounterDetailsToggle.checked = flag;
    }
    this._doCheckActions(this.patientChartInformationCheckboxes, flag);
    if (!this.enconterDetails) {
      this._doCheckActions(this.transitionofCareDatailsCheckboxes, flag);
      this.transitionofCareDatailsToggle.checked = flag;
    }
    this.patientInformationToggle.checked = flag;
    this.patientChartInformationToggle.checked = flag;
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.ccdaPreviewDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
    });
  }

  SendToPateint(){
    //console.log(this.c_CDAParams);
    this.c_CDAParams.SendToPatient = true;
    this.dialogIsLoading = true;
    this.patientService.SendCCDAToPatient(this.c_CDAParams).subscribe(
      {
      next: (resp) =>{
        //console.log(resp);
        if(resp.IsSuccess){
          let messageInfo: MessageDialogInfo = {};
          messageInfo.MessageFor = "Practice"
          messageInfo.Messages = this.prepareMessage(resp.Result)
          messageInfo.ForwardReplyMessage = null;
          const ref = this.overlayService.open(this.MessageDialogComponent, messageInfo);
          ref.afterClosed$.subscribe(res => {
            this.cancel();
          });
        }else{
          this.alertMessage.displayErrorDailog(ERROR_CODES["ECPACDA001"])
        }
      },
      error: (error) =>{
        this.dialogIsLoading = false;
        this.alertMessage.displayErrorDailog(ERROR_CODES["ECPACDA001"])
      },
      complete: () => {
        this.dialogIsLoading = false;
      }
    }
    )
  }

  DownloadCCCDA(){
    this.c_CDAParams.Download = true;
    this.dialogIsLoading = true;
    this.patientService.SendCCDAToPatient(this.c_CDAParams).subscribe({
      next: (resp) => {
        this.dialogIsLoading = false;
        if(resp.IsSuccess){
          this.downloadService.DownloadAttachment(resp.Result.attachment as Attachment);
        }
      },
      error: (error)=>{
        this.dialogIsLoading = false;
      },
      complete: () => {
        this.dialogIsLoading = false;
      }
    })
  }

  prepareMessage(resp): Messages{
    let message: Messages = {}
    message.ToId = resp.UserId;
    if(!message.toAddress) message.toAddress = {};
    message.toAddress.UserId = resp.UserId;
    message.toAddress.Name = this.patient.FirstName+' '+this.patient.LastName;
    message.FromId = this.authService.userValue.UserId;
    message.Body = "CCDA Report"
    message.Subject = "Clinical Summary"
    message.PatientName = this.patient.FirstName+' '+this.patient.LastName;
    if(!message.Attachments) message.Attachments = [];
    message.Attachments.push(resp.attachment as Attachment);
    message.Isccda = true;
    return message;
  }

  openMessage(){

  }
}














