import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { EducationMaterialCode, EhrAlert, EhrTrigger, PatientEducationInfomation, TriggerInformation, User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  ehrTriggerList: TriggerInformation = {};
  triggerSearchList = new BehaviorSubject<EhrTrigger[]>([]);
  ehrTrigger: EhrTrigger = new EhrTrigger();
  codeSystemsForClinicalDecision: string[] = ['SNOMED/ICD10'];
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
  showon: boolean = true;
  showoff: boolean = false;
  decisionSuppotForm: FormGroup;
  buttonopen: boolean;
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
  }
  ngOnInit(): void {

    this.getclinicaldesupportlist();
  }


  // nameCheck() {
  //   let alertName = this.decisionSuppotForm.value.alertName;
  //   if (alertName == "") {
  //     this.checkedName = false;
  //     this.uncheckedName = true;
  //   }
  //   else {
  //     this.checkedName = true;
  //     this.uncheckedName = false;
  //   }
  // }
  // nameUnCheck() {
  //   let alertName = this.decisionSuppotForm.value.alertName;
  //   if (alertName == "") {
  //     this.checkedName = false;
  //     this.uncheckedName = false;
  //   }
  //   else {
  //     this.checkedName = true;
  //     this.uncheckedName = false;
  //   }
  // }

  // descriptionCheck() {
  //   let description = this.decisionSuppotForm.value.description;
  //   if (description == "") {
  //     this.checkedDescription = false;
  //     this.uncheckedDescription = true;
  //   }
  //   else {
  //     this.checkedDescription = true;
  //     this.uncheckedDescription = false;
  //   }
  // }
  // descriptionUnCheck() {
  //   let description = this.decisionSuppotForm.value.description;
  //   if (description == "") {
  //     this.checkedDescription = false;
  //     this.uncheckedDescription = false;
  //   }
  //   else {
  //     this.checkedDescription = true;
  //     this.uncheckedDescription = false;
  //   }
  // }
  // resolutionCheck() {
  //   let resolution = this.decisionSuppotForm.value.resolution;
  //   if (resolution == "") {
  //     this.checkedResolution = false;
  //     this.unCheckedResolution = true;
  //   }
  //   else {
  //     this.checkedResolution = true;
  //     this.unCheckedResolution = false;
  //   }
  // }
  // resolutionUnCheck() {
  //   let resolution = this.decisionSuppotForm.value.resolution;
  //   if (resolution == "") {
  //     this.checkedResolution = false;
  //     this.unCheckedResolution = false;
  //   }
  //   else {
  //     this.checkedResolution = true;
  //     this.unCheckedResolution = false;
  //   }
  // }
  // bibliographyCheck() {
  //   let bibliography = this.decisionSuppotForm.value.bibliography;
  //   if (bibliography == "") {
  //     this.checkedbiBliography = false;
  //     this.unCheckedBibliography = true;
  //   }
  //   else {
  //     this.checkedbiBliography = true;
  //     this.unCheckedBibliography = false;
  //   }
  // }
  // bibliographyUnCheck() {
  //   let bibliography = this.decisionSuppotForm.value.bibliography;
  //   if (bibliography == "") {
  //     this.checkedbiBliography = false;
  //     this.unCheckedBibliography = false;
  //   }
  //   else {
  //     this.checkedbiBliography = true;
  //     this.unCheckedBibliography = false;
  //   }
  // }
  // developerCheck() {
  //   let developer = this.decisionSuppotForm.value.developer;
  //   if (developer == "") {
  //     this.checkedDeveloper = false;
  //     this.unCheckedDeveloper = true;
  //   }
  //   else {
  //     this.checkedDeveloper = true;
  //     this.unCheckedDeveloper = false;
  //   }
  // }
  // developerUnCheck() {
  //   let developer = this.decisionSuppotForm.value.developer;
  //   if (developer == "") {
  //     this.checkedDeveloper = false;
  //     this.unCheckedDeveloper = false;
  //   }
  //   else {
  //     this.checkedDeveloper = true;
  //     this.unCheckedDeveloper = false;
  //   }
  // }
  // fundingSourceCheck() {
  //   let fundingSource = this.decisionSuppotForm.value.fundingSource;
  //   if (fundingSource == "") {
  //     this.checkedfundingSource = false;
  //     this.unCheckedfundingSource = true;
  //   }
  //   else {
  //     this.checkedfundingSource = true;
  //     this.unCheckedfundingSource = false;
  //   }
  // }
  // fundingSourceUnCheck() {
  //   let fundingSource = this.decisionSuppotForm.value.fundingSource;
  //   if (fundingSource == "") {
  //     this.checkedfundingSource = false;
  //     this.unCheckedfundingSource = false;
  //   }
  //   else {
  //     this.checkedfundingSource = true;
  //     this.unCheckedfundingSource = false;
  //   }
  // }
  // releaseDateCheck() {
  //   let releaseDate = this.decisionSuppotForm.value.releaseDate;
  //   if (releaseDate == "") {
  //     this.checkedReleaseDate = false;
  //     this.unCheckedReleaseDate = true;
  //   }
  //   else {
  //     this.checkedReleaseDate = true;
  //     this.unCheckedReleaseDate = false;
  //   }
  // }
  // releaseDateUnCheck() {
  //   let releaseDate = this.decisionSuppotForm.value.releaseDate;
  //   if (releaseDate == "") {
  //     this.checkedReleaseDate = false;
  //     this.unCheckedReleaseDate = false;
  //   }
  //   else {
  //     this.checkedReleaseDate = true;
  //     this.unCheckedReleaseDate = false;
  //   }
  // }


  flag: boolean = true;

  open() {
    this.show = true;
    this.step = -1
    this.flag = true;
  }
  close() {
    this.show = false;
    this.flag = false;
  }
  step: number;
  setStep(index: number) {
    this.step = index;
  }
  disablemedication(item, bool) {
    item.isdisabled = bool;
    this.step = -1;
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
    this.ehrTrigger = new EhrTrigger;
    this.triggerSearchList = new BehaviorSubject<EhrTrigger[]>([]);

  }

  optionChangedForTrigger(value: MedicalCode) {
    this.ehrTrigger.Code = value.Code
    this.ehrTrigger.System = value.CodeSystem
    this.ehrTrigger.Description = value.Description
    this.ehrTrigger.CanDelete = false;
    this.ehrTriggerList.Addtrigger.push(this.ehrTrigger);
    this.triggerSearchList.next(this.ehrTriggerList.Addtrigger.filter(fn => fn.CanDelete === false));
  }


  removeEncounterDiagnosis(value: EhrTrigger, index: number) {
    value.CanDelete = true;
    this.triggerSearchList.next(this.ehrTriggerList.Addtrigger.filter(fn => fn.CanDelete === false));
    this.ehrTrigger = new EhrTrigger();
  }
  newtrigger(item) {

    this.ehrTrigger.AlertId = item;
  }
  CreateTrigger(ehrTrigger) {
    this.settingservice.CreateTrigger(ehrTrigger).subscribe((resp) => {

      if (resp.IsSuccess) {
        this.getclinicaldesupportlist();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JCDS003"]);
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
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JCDS004"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JCDS003"]);
      }
    });

  }
}

class CDSViewModel{
  Name: boolean = false;

}
