import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, Immunization } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { ImmunizationDialogComponent } from '../immunization.dialog/immunization.dialog.component';

@Component({
  selector: 'app-immunization.table.dialog',
  templateUrl: './immunization.table.dialog.component.html',
  styleUrls: ['./immunization.table.dialog.component.scss']
})
export class ImmunizationTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public chartInfoImmunizations = new MatTableDataSource<Immunization>();
  currentPatient: ProviderPatient;
  ActionTypes = Actions;
  immunizationDialogComponent = ImmunizationDialogComponent;
  updatedModelNo: number;
  immunizationColumns: string[] = ['Description', 'CVXCode', 'Date', 'Status'];

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private patientService: PatientService,
    public overlayService: OverlayService,) {
    this.updateLocalModel(ref.RequestData);
  }

  updateLocalModel(data: Immunization) {
    this.chartInfoImmunizations.data = [];
    if (data == null) return;
    this.chartInfoImmunizations.data = data as Immunization[];
  }

  ngOnInit() {
    this.currentPatient = this.authService.viewModel.Patient;
  }

  ngAfterViewInit(): void {
    this.chartInfoImmunizations.sort = this.sort.toArray()[0];
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.immunizationDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      // this.UpdateView(res.data);
      if (res.data != null) {
        this.ref.close(res.data);
      }
    });
  }

  // Get Immunizations info
  ImmunizationsByPatientId() {
    if (this.currentPatient == null) return;
    this.patientService.ImmunizationsByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.chartInfoImmunizations.data = resp.ListResult;
      } else this.chartInfoImmunizations.data = [];
    });
  }

}
