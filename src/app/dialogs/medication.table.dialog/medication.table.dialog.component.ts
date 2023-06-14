import { Actions, Medication, Prescription } from './../../_models';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MedicationDialogComponent } from '../medication.dialog/medication.dialog.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { PatientService } from 'src/app/_services/patient.service';
import { RxPrescriptionInfoDialogComponent } from '../rx.prescription.info.dialog/rx.prescription.info.dialog.component';

@Component({
  selector: 'app-medication.table.dialog',
  templateUrl: './medication.table.dialog.component.html',
  styleUrls: ['./medication.table.dialog.component.scss']
})
export class MedicationTableDialogComponent implements OnInit {
  medicationColumns: string[] = ['Name',  'Direction','Rxcui', 'Start', 'Status'];
  prescriptionColumns: string[] = ['Drug Name', 'Direction', 'Completed', 'Status'];
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public medications = new MatTableDataSource<Medication>();
  public prescriptions = new MatTableDataSource<Prescription>();
  medicationDialogComponent = MedicationDialogComponent;
  eRxPrescriptionInfoDialogComponent = RxPrescriptionInfoDialogComponent;
  ActionTypes = Actions;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService,
    private patientService:PatientService) {
    this.updateLocalModel(ref.RequestData);
   }

  ngOnInit(): void {
    this.display = 'all';
  }

  ngAfterViewInit(): void {
    this.medications.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: Medication) {
    this.medications.data = [];
    if (data == null) return;
    this.medications.data = data as Medication[];
    this.initPrescriptions(this.medications.data[0].PatientId)
  }

  initPrescriptions(PatientId:string){
    this.patientService.Prescriptions({PatientId:PatientId}).subscribe((resp) => {
      console.log(resp);

      if(resp.IsSuccess){
        this.prescriptions.data = resp.ListResult as Prescription[];
      }else this.prescriptions.data = [];
    });
  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.medicationDialogComponent) {
      reqdata = dialogData;
    }else if (action == Actions.view && content === this.eRxPrescriptionInfoDialogComponent) {
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

  display:string;
  show(display:string){
    this.display = display;
  }
}
