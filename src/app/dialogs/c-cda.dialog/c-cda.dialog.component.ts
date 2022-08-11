import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

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
  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }


  cancel() {
    this.ref.close(null);
  }
  TogglePatients(event) {
    this._doCheckActions(this.patientInformationCheckboxes, event.source.checked)
  }
  ToggleEncounter(event) {
    this._doCheckActions(this.encounterDetailsCheckboxes, event.source.checked)
  }
  TogglePatientChartInfo(event) {
    this._doCheckActions(this.patientChartInformationCheckboxes, event.source.checked)
  }

  ToggleTransititionDetails(event) {
    this._doCheckActions(this.transitionofCareDatailsCheckboxes, event.source.checked)
  }

  _doCheckActions(checkboxes: QueryList<any>, flag: boolean) {
    checkboxes.toArray().forEach(source => {
      source.checked = flag;
    })
  }

  verifyPatentToggler() {
    this._doVerficationCheckboxGroup(this.patientInformationCheckboxes, this.patientInformationToggle)
  }

  verifyEncounterToggler() {
    this._doVerficationCheckboxGroup(this.encounterDetailsCheckboxes, this.encounterDetailsToggle)
  }

  verifyPatientChartInfoToggler() {
    this._doVerficationCheckboxGroup(this.patientChartInformationCheckboxes, this.patientChartInformationToggle)
  }

  verifyTransitionofCareDatailsToggler() {
    this._doVerficationCheckboxGroup(this.transitionofCareDatailsCheckboxes, this.transitionofCareDatailsToggle)
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
    this._doCheckActions(this.patientInformationCheckboxes, flag)
    if (this.enconterDetails) {
      this._doCheckActions(this.encounterDetailsCheckboxes, flag)
      this.encounterDetailsToggle.checked = flag;
    }
    this._doCheckActions(this.patientChartInformationCheckboxes, flag)
    if (!this.enconterDetails) {
      this._doCheckActions(this.transitionofCareDatailsCheckboxes, flag)
      this.transitionofCareDatailsToggle.checked = flag;
    }
    this.patientInformationToggle.checked = flag;
    this.patientChartInformationToggle.checked = flag;
  }

  patientInformation: any[] = [
    { value: 'Patient Information' },
    { value: 'Identification & Demographics' }]

  encounterDetails: any[]
    = [{ value: 'Basic Information' },
    { value: 'Reason for visit' },
    { value: 'Clinical Instructions' },
    { value: 'Medication Administered' },
    { value: 'Immunizations Administered' },
    { value: 'Diagnostic Tests Pending' },
    { value: 'Future Scheduled Tests' },
    { value: 'Referrals to Other Providers' },
    { value: 'Recommended Patient Decision Aids' }
    ]
  patientChartInformation: any[] = [{ value: 'Smoking Status' },
  { value: 'Problems (Dx)' },
  { value: 'Medications (Rx)' },
  { value: 'Medication Allergies' },
  { value: 'Laboratory Tests & Results' },
  { value: 'Vital Stats' },
  { value: 'Care Plan - Goals & Instructions' },
  { value: 'Procedures' }, { value: 'Care Team Members' }
  ]



  TransitionofCareDatails: any[] = [{ value: 'Basic Information' },
  { value: 'Encounter Diagnosis' },
  { value: 'Immunizations' },
  { value: 'Cognitive Status' },
  { value: 'Functional Status' },
  { value: 'Reason for Referral' },
  { value: 'Discharge Instructions' }]


}














