import { OverlayService } from './../../overlay.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, CCDAParams } from 'src/app/_models';
import { CcdaPreviewDialogComponent } from '../ccda.preview.dialog/ccda.preview.dialog.component';

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

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
  }

  ngOnInit(): void {
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
}














