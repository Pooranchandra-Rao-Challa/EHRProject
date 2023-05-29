import { DatePipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, Diagnosis } from 'src/app/_models';
import { AddDiagnosesDialogComponent } from '../diagnoses.dialog/diagnoses.dialog.component';

@Component({
  selector: 'app-diagnoses.table.dialog',
  templateUrl: './diagnoses.table.dialog.component.html',
  styleUrls: ['./diagnoses.table.dialog.component.scss']
})
export class DiagnosesTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public patientDiagnosesList = new MatTableDataSource<Diagnosis>();
  diagnosesColumns: string[] = ['Description', 'Code', 'CodeType', 'Start', 'Stop', 'Status'];
  addDiagnosesDialogComponent = AddDiagnosesDialogComponent;
  ActionTypes = Actions;
  todayDate: string;

  constructor(private ref: EHROverlayRef,
    private datepipe: DatePipe,
    private overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientDiagnosesList.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: Diagnosis) {
    this.patientDiagnosesList.data = [];
    if (data == null) return;
    this.patientDiagnosesList.data = data as Diagnosis[];
    this.todayDate = this.datepipe.transform(new Date(), "MM/dd/yyyy hh:mm:ss a");
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.addDiagnosesDialogComponent) {
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
