import { PatientService } from 'src/app/_services/patient.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import { GlobalConstants, Intervention, PatientChart } from './../../_models';
import { fromEvent } from 'rxjs';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { DatePipe } from '@angular/common';

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

  constructor(private ref: EHROverlayRef,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
    this.interventionTypes = GlobalConstants.INTERVENTION_TYPES;
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchName.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
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
      });
  }

  onSelectInterventionCodes(intervention: any) {
    this.patientIntervention.Code = intervention.Code;
    this.patientIntervention.Description = intervention.Description;
    this.patientIntervention.CodeSystem = intervention.CodeSystem;
    this.patientIntervention.ReasonValueSetOID = intervention.CodeSystemOId;
  }

  CreateIntervention() {
    let isAdd = this.patientIntervention.InterventionId == undefined;
    this.patientIntervention.PatientId = this.currentPatient.PatientId;
    this.patientIntervention.StartDate = new Date(this.datepipe.transform(this.patientIntervention.StartDate, "yyyy-MM-dd", "en-US"));
    this.patientIntervention.EndDate = new Date(this.datepipe.transform(this.patientIntervention.EndDate, "yyyy-MM-dd", "en-US"));
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
    })
  }
}
