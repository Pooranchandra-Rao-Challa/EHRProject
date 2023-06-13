import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, Medication } from 'src/app/_models';
import { RxPrescriptionInfoDialogComponent } from '../rx.prescription.info.dialog/rx.prescription.info.dialog.component';

@Component({
  selector: 'app-rx.prescription.table.dialog',
  templateUrl: './rx.prescription.table.dialog.component.html',
  styleUrls: ['./rx.prescription.table.dialog.component.scss']
})
export class RxPrescriptionTableDialogComponent implements OnInit {
  prescriptionColumns: string[] = ['Status', 'Name', 'Type', 'Method'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public prescriptions = new MatTableDataSource<Medication>();
  eRxPrescriptionInfoDialogComponent = RxPrescriptionInfoDialogComponent;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
  }

  updateLocalModel(data: Medication) {
    this.prescriptions.data = [];
    if (data == null) return;
    this.prescriptions.data = data as Medication[];
    console.log(this.prescriptions.data);
  }

  ngOnInit(): void {
  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.eRxPrescriptionInfoDialogComponent) {
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
