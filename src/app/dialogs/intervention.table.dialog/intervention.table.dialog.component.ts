import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { User, Intervention, Actions, PatientChart } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { InterventionDialogComponent } from '../intervention.dialog/intervention.dialog.component';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-intervention.table.dialog',
  templateUrl: './intervention.table.dialog.component.html',
  styleUrls: ['./intervention.table.dialog.component.scss']
})
export class InterventionTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public interventionDatasource = new MatTableDataSource<Intervention>();
  interventionColumns: string[] = ['StartDate', 'EndDate', 'ProviderName', 'InterventionType', 'Code', 'CodeDescription',
    'Performed', 'ReasonNotPerformed', 'CqmStatus'];
  user: User;
  interventionDialogComponent = InterventionDialogComponent;
  ActionTypes = Actions;
  currentPatient: ProviderPatient;
  updatedModelNo: number;

  constructor(public overlayService: OverlayService,
    private ref: EHROverlayRef,
    private patientService: PatientService,
    private authService: AuthenticationService) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  ngAfterViewInit(): void {
    this.interventionDatasource.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: Intervention) {
    this.interventionDatasource.data = [];
    if (data == null) return;
    this.interventionDatasource.data = data as Intervention[];
  }

  cancel() {
    if (this.updatedModelNo < 0) {
      this.ref.close(null);
    }
    else {
      this.ref.close({
        "UpdatedModal": PatientChart.Interventions,
        "InterventionsDataSource": this.interventionDatasource.data
      });
    }
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.interventionDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      this.UpdateView(res.data);
    });
  }

  UpdateView(data) {
    if (data == null) return;
    this.updatedModelNo = data.UpdatedModal;
    if (data.UpdatedModal == PatientChart.Interventions) {
      this.InterventionsByPatientId();
    }
  }

  // Get tobacco interventions info
  InterventionsByPatientId() {
    this.patientService.InterventionsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.interventionDatasource.data = resp.ListResult as Intervention[];
    });
  }
}
