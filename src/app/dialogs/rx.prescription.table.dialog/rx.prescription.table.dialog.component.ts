import { PatientService } from './../../_services/patient.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, Medication, Prescription } from 'src/app/_models';
import { RxPrescriptionInfoDialogComponent } from '../rx.prescription.info.dialog/rx.prescription.info.dialog.component';

@Component({
  selector: 'app-rx.prescription.table.dialog',
  templateUrl: './rx.prescription.table.dialog.component.html',
  styleUrls: ['./rx.prescription.table.dialog.component.scss']
})
export class RxPrescriptionTableDialogComponent implements OnInit {
  prescriptionColumns: string[] = ['BrandName', 'Status', 'PatientDirection', 'Type', 'CompletedAt'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public prescriptions = new MatTableDataSource<Prescription>();
  eRxPrescriptionInfoDialogComponent = RxPrescriptionInfoDialogComponent;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService,
    private patientService:PatientService) {
    this.updateLocalModel(ref.RequestData);
  }

  updateLocalModel(data) {
    console.log(data);

    this.prescriptions.data = [];
    if (data == null) return;
    this.patientService.Prescriptions(data).subscribe((resp) => {
      console.log(resp);

      if(resp.IsSuccess){
        this.prescriptions.data = resp.ListResult as Prescription[];
      }else this.prescriptions.data = [];
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.prescriptions.sort = this.sort.toArray()[0];
  }

  cancel() {
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
      if (res.data != null) {
        this.ref.close(res.data);
      }
    });
  }

}
