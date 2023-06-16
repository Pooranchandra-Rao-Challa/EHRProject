import { Condition } from './../../reports/cqmreports/viewhelpers/condition.renderer/condition.renderer.component';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { CDSAlert, CDSCode, AlertTrigger, User, ViewModel } from '../../_models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MedicalCode } from 'src/app/_models/codes';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
import { FormFieldValue } from 'src/app/_components/advanced-medical-code-search/field-control/field-control-component';

@Component({
  selector: 'clinicdecision-settings',
  templateUrl: './clinicdecision.component.html',
  styleUrls: ['./clinicdecision.component.scss']
})
export class ClinicDecisionComponent implements OnInit {
  clinicalDecisionSupportList: CDSAlert[] = [];
  newAlert?: CDSAlert = {};
  alertTrigger: AlertTrigger = {};
  codeSystemsForClinicalDecision: string[] = ['SNOMED/ICD10', 'Local'];
  selectedCodeSystemValue: FormFieldValue = {CodeSystem:'SNOMED/ICD10',SearchTerm:''}
  clinicalDecisionSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "Delete"];
  codesBehaviour: BehaviorSubject<CDSCode[]> = new BehaviorSubject([]);
  user: User;
  multi: boolean = false;
  disabled: boolean = false;
  AddNewAlert: boolean = true;
  show: boolean = true;
  decisionSuppotForm: FormGroup;
  buttonopen: boolean;
  viewModel: ViewModel;
  TriggerSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "Delete"];
  TriggerRuleDD: any[] = [
    { value: 'ONE', text: 'ONE' },
    { value: 'ONE of each category', text: 'ONE of each category' },
    { value: 'Two or More', text: 'Two or More' },
    { value: 'All', text: 'All' },
  ];
  triggerTitle: string ="Add new Trigger"
  actionButtonTitle:string = "Add Trigger"

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
    private settingservice: SettingsService, private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
    this.user = authService.userValue;
    this.viewModel = authService.viewModel;
    this.show = this.viewModel.Cds;
    this.flag = this.viewModel.Cds;
  }

  ngOnInit(): void {
    this.CDSupports();

  }

  flag: boolean = true;

  toggelAlterStatus(value: boolean) {
    this.show = value;
    this.step = -1
    this.flag = value;
    this.authService.SetViewParam("Cds", value);
    this.settingservice.ToggleAlertStatus({ providerId: this.user.ProviderId, Status:value}).subscribe((resp) => {
      if (resp.Result) {
        this.CDSupports();
      }
    });
  }

  close(value: boolean) {
    this.show = value;
    this.step = -1
    this.flag = value;
    this.authService.SetViewParam("Cds", value);
  }

  step: number = -1;
  // setStep(index: number) {
  //   this.step = index;
  // }
  ToggleAlert(item, bool, i) {
    this.step = -1;
    item.isdisabled = bool;
    if (bool) {
      this.step = i;
    }
    this.UpdateCDSAlertToggle(item, bool);
  }

  UpdateCDSAlertToggle(item, alert) {
    this.newAlert.AlertId = item.AlertId;
    this.newAlert.Active = alert;
    this.settingservice.UpdateCDSAlertToggle(this.newAlert).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.CDSupports();
        this.resetAlert();
      }
    });
  }

  CDSupports() {
    var reqparams = {
      providerId: this.user.ProviderId
    }

    this.settingservice.ClinicalDecisionSupport(reqparams).subscribe(response => {
      if (response.IsSuccess) {

        let alt = response.ListResult as CDSAlert[];
        this.clinicalDecisionSupportList = alt;
        alt.forEach(a => this.flag = a.Active || this.flag)
        if(!this.flag)
        this.show = this.flag;
      }
    })
  }

  onAlertOpened(alert: CDSAlert){
    if(!alert.Triggers){
      this.settingservice.CDSAlertTrigger({alertId:alert.AlertId}).subscribe(response => {
        if (response.IsSuccess) {
          let triggers = response.ListResult as AlertTrigger[];

          triggers.forEach((value) => {
            value.Codes = JSON.parse(value.strCodes)
          })
          alert.Triggers = triggers;
        }
      })
    }
  }
  getCodes(codes:any[]):string{
    if(codes == null) return ""
    let returnCodes =[]
    codes.forEach(code =>{
      returnCodes.push(code.Code)
    });
    return returnCodes.join(", ");
  }


  InsertUpadateClincialDecisionSupport(alert: CDSAlert) {
    alert.strReleaseAt = this.datePipe.transform(alert.ReleaseAt, "MM/dd/yyyy")
    let isAdd = alert.AlertId == undefined;
    alert.ProviderId = this.user.ProviderId
    this.settingservice.CreateUpdateClinicalDecisionSupport(alert).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.CDSupports();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2JCDS001" : "M2JCDS002"]);
        this.resetAlert();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JCDS001"]);
      }
    });
  }

  enableSave() {
    return !(
      this.newAlert.AlertName != null && this.newAlert.AlertName != ""
      && this.newAlert.Description != null && this.newAlert.Description != ""
      && this.newAlert.Resolution != null && this.newAlert.Resolution != ""
      && this.newAlert.Bibliography != null && this.newAlert.Bibliography != ""
      && this.newAlert.Developer != null && this.newAlert.Developer != ""
      && this.newAlert.Rule != null && this.newAlert.Rule != ""
    )
  }

  enableTriggerSave() {
    return !(
      this.alertTrigger.Condition != null && this.alertTrigger.Condition != ""
      && this.alertTrigger.Description != null && this.alertTrigger.Description != ""
    )
  }

  resetAlert() {
    this.newAlert = new CDSAlert
  }

  resetTrigger() {
    this.alertTrigger = {};
  }

  optionChangedForTrigger(value: MedicalCode) {
    let triggerCode:CDSCode = {};
    triggerCode.Code = value.Code
    triggerCode.CodeSystem = value.CodeSystem
    triggerCode.Description = value.Description
    triggerCode.CanDelete = false;
    if(!this.alertTrigger.Codes) this.alertTrigger.Codes = [];
    this.alertTrigger.Codes.push(triggerCode);
    this.codesBehaviour.next(this.alertTrigger.Codes);
  }

  removeTriggerCode(value: CDSCode, index: number) {
    var deleteIndex = this.alertTrigger.Codes.indexOf(value);

    this.alertTrigger.Codes.splice(deleteIndex,1);
    this.codesBehaviour.next(this.alertTrigger.Codes);
  }

  newtrigger(alertId) {
    this.triggerTitle ="Add new Trigger"
    this.actionButtonTitle = "Add Trigger"
    this.alertTrigger = {}
    this.alertTrigger.AlertId = alertId;
    if(!this.alertTrigger.Codes) this.alertTrigger.Codes = [];
    this.codesBehaviour.next(this.alertTrigger.Codes);
  }

  EditTrigger(trigger){
    this.triggerTitle ="Edit Trigger"
    this.actionButtonTitle = "Save Trigger"
    this.alertTrigger = Object.assign({}, trigger);
    this.codesBehaviour.next(this.alertTrigger.Codes);
  }

  CreateTrigger() {
    let isAdd = this.alertTrigger.TriggerId == null || this.alertTrigger.TriggerId == undefined
    this.settingservice.CreateTrigger(this.alertTrigger).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.CDSupports();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2JCDS003" : "M2JCDS005"]);
        this.resetTrigger();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JCDS002"]);
      }
    });
  }

  DeleteTrigger(data) {
    var req = {
      TriggerId: data
    }
    this.settingservice.DeleteTrigger(req).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.CDSupports();
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2JCDS004"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JCDS003"]);
      }
    });
  }
}

