import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { PatientChart, Allergy, Actions, User } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AllergyDialogComponent } from '../allergy.dialog/allergy.dialog.component';

@Component({
  selector: 'app-allergy.table.dialog',
  templateUrl: './allergy.table.dialog.component.html',
  styleUrls: ['./allergy.table.dialog.component.scss']
})
export class AllergyTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public allergyDatasource = new MatTableDataSource<Allergy>();
  allergyColumns: string[] = ['Type', 'Allergen', 'Severity', 'Reactions', 'Onset', 'StartDate', 'EndDate'];
  allergyDialogComponent = AllergyDialogComponent;
  ActionTypes = Actions;
  user: User;
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
    this.allergyDatasource.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: Allergy) {
    this.allergyDatasource.data = [];
    if (data == null) return;
    this.allergyDatasource.data = data as Allergy[];
  }

  cancel() {
    if (this.updatedModelNo < 0) {
      this.ref.close(null);
    }
    else {
      this.ref.close({
        "UpdatedModal": PatientChart.Allergies,
        "AllergyDataSource": this.allergyDatasource.data
      });
    }
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.allergyDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      this.UpdateView(res.data);
    });
  }

  UpdateView(data) {
    if (data == null) return;
    this.updatedModelNo = data.UpdatedModal;
    if (data.UpdatedModal == PatientChart.Allergies) {
      this.AllergiesByPatientId();
    }
  }

  // Get allergies info
  AllergiesByPatientId() {
    this.patientService.AllergiesByPatientId({ PatientId: this.currentPatient.PatientId }).subscribe((resp) => {
      if (resp.IsSuccess) this.allergyDatasource.data = resp.ListResult;
    });
  }
}
