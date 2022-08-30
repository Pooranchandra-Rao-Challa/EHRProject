import { PatientService } from 'src/app/_services/patient.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { Actions, GlobalConstants, ChartInfo, Intervention, PatientChart } from './../../_models';
import { fromEvent } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';
import { AddeditinterventionComponent } from '../addeditintervention/addeditintervention.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';

@Component({
  selector: 'app-intervention.dialog',
  templateUrl: './intervention.dialog.component.html',
  styleUrls: ['./intervention.dialog.component.scss']
})
export class InterventionDialogComponent implements OnInit {
  interventionColumns: string[] = ['Empty', 'InterventionType', 'Code', 'Description', 'ReasonNotPerformed', 'Reason'];
  interventionCodes: any[] = [];
  patientIntervention: Intervention = new Intervention();
  interventionTypes: GlobalConstants;
  @ViewChild('searchName', { static: true }) searchName: ElementRef;
  keys = 'Code,Description';
  filter: any;
  currentPatient: ProviderPatient;
  selectedInterventionCodes: any[] = [];
  cqmNotPerformedDialogComponent = AddeditinterventionComponent;
  ActionTypes = Actions;
  chartInfo: ChartInfo = new ChartInfo;

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    public overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.interventionTypes = GlobalConstants.INTERVENTION_TYPES;
    this.InterventionsByPatientId();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        // this.interventionCodes = [];
        if(event.target.value == ''){
          this.interventionCodes = this.chartInfo.Interventions;
        }
        return event.target.value;
      })
      // if character length greater then 0
      , filter(res => res.length > 0)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this.SearchInterventionCodes(value));
  }

  updateLocalModel(data: Intervention) {
    this.patientIntervention = new Intervention;
    if (data == null) return;
    this.patientIntervention = data;
    this.SearchInterventionCodes('');
  }

  cancel() {
    this.ref.close(null);
  }

  SearchInterventionCodes(term) {
    var term = term == '' ? this.patientIntervention.Code : term;
    let reqparams = {
      SearchTearm: term,
    };
    this.patientService.SearchInterventionCodes(reqparams)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.interventionCodes = resp.ListResult;
        }
        else {
          this.interventionCodes = [];
        }
      });
  }

  onSelectInterventionCodes(event, intervention: any, Code) {
    if (event.checked == true) {
      if (this.selectedInterventionCodes.length > 0) {
        return this.selectedInterventionCodes.push(intervention);
      }
      else {
        this.selectedInterventionCodes = new Array(intervention);
        this.patientIntervention.Code = this.selectedInterventionCodes[0].Code;
      }
    }
    else if (event.checked == false) {
      this.selectedInterventionCodes = this.selectedInterventionCodes.filter(
        function (data) {
          return data.Code != Code;
        }
      );
    }
  }

  CreateIntervention() {
    let isAdd = this.patientIntervention.InterventionId == undefined;
    this.patientIntervention.PatientId = this.currentPatient.PatientId;
    this.patientIntervention.StartDate = new Date(this.datepipe.transform(this.patientIntervention.StartDate, "yyyy-MM-dd", "en-US"));
    this.patientIntervention.EndDate = new Date(this.datepipe.transform(this.patientIntervention.EndDate, "yyyy-MM-dd", "en-US"));
    let Count = this.selectedInterventionCodes.length;
    if (Count > 0) {
      this.selectedInterventionCodes.forEach(intervention => {
        this.patientIntervention.Code = intervention.Code;
        this.patientIntervention.Description = intervention.Description;
        this.patientIntervention.CodeSystem = intervention.CodeSystem;
        this.patientIntervention.ReasonValueSetOID = intervention.CodeSystemOId;

        this.patientService.CreateInterventions(this.patientIntervention).subscribe((resp) => {
          if (resp.IsSuccess) {
            this.ref.close({
              "UpdatedModal": PatientChart.Interventions
            });
            this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CCSIA001" : "M2CCSIA002"]);
          }
          else {
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CCSIA001"]);
            this.cancel();
          }
        });
      });
      // Empty state array
      Count = 0;
    }
  }

  disableIntervention() {
    return !(this.patientIntervention.StartDate && this.patientIntervention.EndDate && this.patientIntervention.InterventionType && this.patientIntervention.Code )
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.cqmNotPerformedDialogComponent) {
      reqdata = {
        CessationInterventionId: null,
        InterventionId: dialogData
      }
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      // this.UpdateView(res.data);
      if(res.data != null){
        this.ref.close(res.data);
      }
    });
  }

    // Get tobacco interventions info
    InterventionsByPatientId() {
      this.patientService.InterventionsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
        if (resp.IsSuccess) this.chartInfo.Interventions = resp.ListResult;
        this.interventionCodes = this.chartInfo.Interventions;
      });
    }
}
