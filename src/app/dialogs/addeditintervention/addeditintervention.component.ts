import { Router } from '@angular/router';
import { CQMNotPerformed, InterventionCodes } from 'src/app/_models/_provider/cqmnotperformed';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { CQMNotPerformedService } from 'src/app/_services/cqmnotperforemed.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-addeditintervention',
  templateUrl: './addeditintervention.component.html',
  styleUrls: ['./addeditintervention.component.scss']
})
export class AddeditinterventionComponent implements OnInit {
  itemNotPerformed: any = [
    { Id: '1', value: 'Current Meds Documented' },
    { Id: '2', value: 'BMI Screening/Follow-up' },
    { Id: '3', value: 'Tobacco Use Screening/Cessation Counseling' }
  ]
  interventaionType: any = [
    { Id: '1', value: 'BMI-Above Normal Follow-up' },
    { Id: '2', value: 'BMI-Above Normal Medication' },
    { Id: '3', value: 'BMI-Referrals where weight assessement may occur' },
    { Id: '4', value: 'BMI-Below Normal Follow-up' },
    { Id: '5', value: 'BMI-Below Normal Medication' },
    { Id: '6', value: 'Weight-Counseling for Physical Activity' }
  ]
  searchReason: any = [
    { Id: '1', value: '105480006 - Refusal of treatment by patient (situation)' },
    { Id: '2', value: '183944003 - Procedure refused (situation)' },
    { Id: '3', value: '183945002 - Procedure refused for religious reason (situation)' },
    { Id: '4', value: '413310006 - Patient non-compliant - refused access to services (situation)' },
    { Id: '5', value: '413311005 - Patient non-compliant - refused intervention / support (situation)' },
    { Id: '6', value: '413312003 - Patient non-compliant - refused service (situation)' },
    { Id: '7', value: '183932001 - Procedure contraindicated (situation)' },
    { Id: '8', value: '397745006 - Medical contraindication (finding)' },
    { Id: '9', value: '407563006 - Treatment not tolerated (situation)' },
    { Id: '10', value: '428119001 - Procedure not indicated (situation)' },
    { Id: '11', value: '59037007 - Drug intolerance' },
    { Id: '12', value: '62014003 - Adverse reaction to drug' }
  ];
  interventaionList: InterventionCodes[] = [];
  reasonFiltered: any = [];
  interventaionFilter: InterventionCodes[] = [];
  CQMNotPerformed: CQMNotPerformed;
  intervention: any = [];
  PatientDetails: any = [];

  constructor(private ref: EHROverlayRef, private cqmNotperformedService: CQMNotPerformedService,
    private authService: AuthenticationService, private router: Router, private alertmsg: AlertMessage,
    private cfr: ComponentFactoryResolver, public datepipe: DatePipe,) {
    this.CQMNotPerformed = {} as CQMNotPerformed;
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.PatientDetails = this.authService.viewModel.Patient;
    this.getInterventaionDetails();
    this.getreasondescription(null);
  }

  getInterventaionDetails() {
    this.cqmNotperformedService.InterventaionDetails().subscribe(resp => {
      if (resp.IsSuccess) {
        this.interventaionList = resp.ListResult;
        this.interventaionFilter = this.interventaionList.slice();
        if (this.CQMNotPerformed.InterventionCode != "") {
          let data = this.CQMNotPerformed.InterventionCode;
          // let interventionlist = this.interventaionList.find(x => x.Code == data);
          // this.CQMNotPerformed.InterventionCode = interventionlist.Code;
          // this.CQMNotPerformed.InterventionDescription = interventionlist.Description
        }
      }
    });
  }

  interventaion(item) {
    this.CQMNotPerformed.InterventionCode = item.Code;
    this.CQMNotPerformed.InterventionDescription = item.Description;
  }

  getreasondescription(item) {
    this.reasonFiltered = this.searchReason.slice();
    if (this.CQMNotPerformed.ReasonCodeDescription != undefined) {
      this.CQMNotPerformed.Reasondetails = this.CQMNotPerformed.ReasonCodeDescription;
    }
    if (item != null) {
      let resason = item.value;
      resason = resason.split(" - ");
      this.CQMNotPerformed.ReasonCode = resason[0];
      this.CQMNotPerformed.ReasonDescription = resason[1];
    }
  }

  updateLocalModel(data: CQMNotPerformed) {
    this.CQMNotPerformed = {};
    if (data == null) return;
    this.CQMNotPerformed = data;
    this.CQMNotPerformed.CessationInterventionId = data.CessationInterventionId;
    this.CQMNotPerformed.InterventionId = data.InterventionId;
  }

  addUpdateCQMNotPerformed() {
    let isAdd = this.CQMNotPerformed.NPRId == undefined;
    if(!this.CQMNotPerformed.PatientId)
    this.CQMNotPerformed.PatientId = this.PatientDetails.PatientId;
    if(!this.CQMNotPerformed.ProviderId)
    this.CQMNotPerformed.ProviderId = this.PatientDetails.ProviderId;

    this.CQMNotPerformed.strDate = this.datepipe.transform(this.CQMNotPerformed.Date, "MM/dd/yyyy hh:mm:ss a", "en-US");
    this.cqmNotperformedService.AddUpdateCQMNotPerformed(this.CQMNotPerformed).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({
          saved: true
        });
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCNP001" : "M2CCNP002"]);
      }
      else {
        this.cancel();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCNP001"]);
      }
    });
  }

  cancel() {
    this.ref.close(null);
  }

  disableCQMNotPerformed() {
    return !(this.CQMNotPerformed.ItemNotPerformed == undefined ? '' : this.CQMNotPerformed.ItemNotPerformed.toString() != ''
      && this.CQMNotPerformed.Date == undefined ? '' : this.CQMNotPerformed.Date.toString() != ''
        && this.CQMNotPerformed.InterventionType == undefined ? '' : this.CQMNotPerformed.InterventionType != ''
          && this.CQMNotPerformed.InterventionCode == undefined ? '' : this.CQMNotPerformed.InterventionCode != ''
            && this.CQMNotPerformed.Reason == undefined ? '' : this.CQMNotPerformed.Reason != ''
              && this.CQMNotPerformed.ReasonCode == undefined ? '' : this.CQMNotPerformed.ReasonCode != ''
                && this.CQMNotPerformed.ReasonDescription == undefined ? '' : this.CQMNotPerformed.ReasonDescription != '')
  }
}
