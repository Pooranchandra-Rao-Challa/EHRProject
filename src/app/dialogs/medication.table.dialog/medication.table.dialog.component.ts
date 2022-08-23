import { Actions, Medication } from './../../_models';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicationDialogComponent } from '../medication.dialog/medication.dialog.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';

@Component({
  selector: 'app-medication.table.dialog',
  templateUrl: './medication.table.dialog.component.html',
  styleUrls: ['./medication.table.dialog.component.scss']
})
export class MedicationTableDialogComponent implements OnInit {
  medicationColumns: string[] = ['Status', 'Name', 'Type', 'Method'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public medication_prescription = new MatTableDataSource<Medication>();
  medicationDialogComponent = MedicationDialogComponent;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.medication_prescription.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: Medication) {
    this.medication_prescription.data = [];
    if (data == null) return;
    this.medication_prescription.data = data as Medication[];
  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.medicationDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      // this.UpdateView(res.data);
      if(res.data != null){
        this.ref.close(res.data);
      }
    });
  }
}
