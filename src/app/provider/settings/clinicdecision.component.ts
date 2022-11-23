import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { EhrAlert, EhrTrigger, TriggerInformation, User, ViewModel } from '../../_models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MedicalCode } from 'src/app/_models/codes';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'clinicdecision-settings',
  templateUrl: './clinicdecision.component.html',
  styleUrls: ['./clinicdecision.component.scss']
})
export class ClinicDecisionComponent implements OnInit {
  clinicalDecisionSupportList: EhrAlert[] = [];
  newAlert?: EhrAlert = {};
  ehrTriggerList: TriggerInformation = new TriggerInformation;
  triggerSearchList = new BehaviorSubject<EhrTrigger[]>([]);
  ehrTrigger: EhrTrigger = new EhrTrigger();
  codeSystemsForClinicalDecision: string[] = ['SNOMED/ICD10', 'Local'];
  clinicalDecisionSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "Delete"];
  user: User;
  multi: boolean = false;
  disabled: boolean = false;
  // checkedName: boolean;
  // uncheckedName: boolean;
  // checkedDescription: boolean;
  // uncheckedDescription: boolean;
  // checkedResolution: boolean;
  // unCheckedResolution: boolean
  // checkedbiBliography: boolean;
  // unCheckedBibliography: boolean;
  // checkedDeveloper: boolean;
  // unCheckedDeveloper: boolean;
  // checkedfundingSource: boolean;
  // unCheckedfundingSource: boolean;
  // checkedReleaseDate: boolean;
  // unCheckedReleaseDate: boolean;

  AddNewAlert: boolean = true;
  show: boolean = true;
  // showon: boolean = true;
  // showoff: boolean = false;
  decisionSuppotForm: FormGroup;
  buttonopen: boolean;
  viewModel: ViewModel;
  TriggerSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "Delete"];
  TriggerRuleDD: any[] = [
    { value: 'ONE', viewValue: 'ONE' },
    { value: 'ONE of each category', viewValue: 'ONE of each category' },
    { value: 'Two or More', viewValue: 'Two or More' },
    { value: 'All', viewValue: 'All' },
  ];

  constructor(private fb: FormBuilder, private authService: AuthenticationService,
    private settingservice: SettingsService, private alertmsg: AlertMessage,
    private datePipe: DatePipe) {
    this.user = authService.userValue;
    this.viewModel = authService.viewModel;
    this.show = this.viewModel.Cds;
    this.flag = this.viewModel.Cds;
  }

  ngOnInit(): void {
    this.getclinicaldesupportlist();
    // this.viewModel.Cds="Off"
  }

  flag: boolean = true;

  open(value: boolean) {
    this.show = true;
    this.step = -1
    this.flag = value;
    this.authService.SetViewParam("Cds", value);
  }

  close(value: boolean) {
    this.show = false;
    this.flag = value;
    this.authService.SetViewParam("Cds", value);
  }

  step: number = -1;
  // setStep(index: number) {
  //   this.step = index;
  // }
  disablemedication(item, bool, i) {
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
        this.getclinicaldesupportlist();
        this.resetdialog();
      }
    });
  }

  getclinicaldesupportlist() {
    var reqparams = {
      // providerid: "5b686dd4c832dd0c444f271b",
      providerid: this.user.ProviderId
    }
    this.settingservice.ClinicalDecisionSupport(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        let alt = response.ListResult as EhrAlert[];
        alt.forEach((value) => {
          value.Triggers = JSON.parse(value.triggersInfo)
        })
        this.clinicalDecisionSupportList = alt;
      }
    })
  }


  InsertUpadateClincialDecisionSupport(alert: EhrAlert) {
    alert.strReleaseAt = this.datePipe.transform(alert.ReleaseAt, "MM/dd/yyyy")
    let isAdd = alert.AlertId == undefined;
    alert.ProviderId = this.user.ProviderId
    this.settingservice.CreateUpdateClinicalDecisionSupport(alert).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getclinicaldesupportlist();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2JCDS001" : "M2JCDS002"]);
        this.resetdialog();
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

  triggerSave() {
    return !(
      this.ehrTrigger.Code != null && this.ehrTrigger.Code != ""
      && this.ehrTrigger.System != null && this.ehrTrigger.System != ""
      && this.ehrTrigger.Description != null && this.ehrTrigger.Description != ""
    )
  }

  resetdialog() {
    this.newAlert = new EhrAlert
  }

  resettriggerdialog() {
    this.ehrTrigger = new EhrTrigger();
    this.triggerSearchList = new BehaviorSubject<EhrTrigger[]>([]);
    this.ehrTriggerList = new TriggerInformation();
  }

  optionChangedForTrigger(value: MedicalCode) {
    this.ehrTrigger.Code = value.Code
    this.ehrTrigger.System = value.CodeSystem
    this.ehrTrigger.Description = value.Description
    this.ehrTrigger.CanDelete = false;
    this.ehrTriggerList.Addtrigger.push(this.ehrTrigger);
    this.triggerSearchList.next(this.ehrTriggerList.Addtrigger.filter(fn => fn.CanDelete === false));
  }

  removetrigger(value: EhrTrigger, index: number) {
    value.CanDelete = true;
    this.triggerSearchList.next(this.ehrTriggerList.Addtrigger.filter(fn => fn.CanDelete === false));
    this.ehrTrigger = new EhrTrigger();
  }

  newtrigger(item) {
    this.ehrTrigger.AlertId = item;
    let d: MedicalCode = new MedicalCode()
    this.triggerSearchList = new BehaviorSubject<EhrTrigger[]>([]);
  }

  CreateTrigger(ehrTrigger) {
    this.settingservice.CreateTrigger(ehrTrigger).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.getclinicaldesupportlist();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JCDS003"]);
        this.ehrTrigger = new EhrTrigger;
        this.resettriggerdialog();
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
        this.getclinicaldesupportlist();
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2JCDS004"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JCDS003"]);
      }
    });
  }
}

class CDSViewModel {
  Name: boolean = false;
}
