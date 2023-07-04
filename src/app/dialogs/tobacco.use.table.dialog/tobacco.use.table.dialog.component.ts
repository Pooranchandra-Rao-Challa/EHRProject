import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, TobaccoUse, TobaccoUseIntervention, TobaccoUseScreening } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { TobaccoUseDialogComponent } from '../tobacco.use.dialog/tobacco.use.dialog.component';

@Component({
  selector: 'app-tobacco.use.table.dialog',
  templateUrl: './tobacco.use.table.dialog.component.html',
  styleUrls: ['./tobacco.use.table.dialog.component.scss']
})
export class TobaccoUseTableDialogComponent implements OnInit {
  screeningColumns: string[] = ['DatePerf', 'Screeningperf', 'Status', 'TobaccoUsecode_desc'];
  interventionColumns: string[] = ['DatePerf', 'Interventionperf', 'InterventionDesc'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  patientTobaccoUse = new MatTableDataSource<TobaccoUse>();

  toabccoUses: TobaccoUse[] = []
  tobaccoUseScreenings = new MatTableDataSource<TobaccoUseScreening>();
  tobaccoUseInterventions = new MatTableDataSource<TobaccoUseIntervention>();
  ActionTypes = Actions;
  tobaccoUseDialogComponent = TobaccoUseDialogComponent;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private overlayService: OverlayService,
    private patientService: PatientService) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientTobaccoUse.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: TobaccoUse[]) {
    this.patientTobaccoUse.data = [];

    if (data == null) return;
    let tobaccoUse: TobaccoUse[] = data
    this.toabccoUses = tobaccoUse;
    //this.patientTobaccoUse.data = data as TobaccoUse[];


    tobaccoUse.forEach(value => {
      if (!this.tobaccoUseScreenings.data) this.tobaccoUseScreenings.data = [];
      if (!this.tobaccoUseInterventions.data) this.tobaccoUseInterventions.data = [];
      this.tobaccoUseScreenings.data.push(...value.Screenings)
      this.tobaccoUseInterventions.data.push(...value.Interventions)
    })

  }

  getTobaccoUseOfEntity(tobaccoUseId: string) {
    return this.toabccoUses.filter(f => f.TobaccoUseId == tobaccoUseId)[0]
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.tobaccoUseDialogComponent) {
         var d = { tobaccoUse: this.getTobaccoUseOfEntity(dialogData.TobaccoUseId), screening: dialogData }
      reqdata = d;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if (res.data != null) {
        this.ref.close(res.data);
      }
    });
  }

}
