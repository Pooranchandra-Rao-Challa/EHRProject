import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PatientSearch } from 'src/app/_models';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-editlabimageorder',
  templateUrl: './order.edit.lab.imaging.component.html',
  styleUrls: ['./order.edit.lab.imaging.component.scss']
})
export class EditLabImagingOrderComponent implements OnInit {
  editorderlab: FormGroup;
  labingimagingattchements: FormGroup;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  labOrders?: LabProcedureWithOrder[] = [];
  constructor(private ref: EHROverlayRef,
    private fb: FormBuilder,
    private patientService: PatientService) {
    this.labandImaging = ref.RequestData as LabProcedureWithOrder;
    console.log(this.labandImaging);
    this.labOrders.push(this.labandImaging);
  }

  ngOnInit(): void {
    this.pageloadevent();
    this.updatePatientInfo();
  }
  cancel() {
    this.ref.close(null);
  }
  updatePatientInfo() {
    console.log(this.labandImaging);

    this.patientService
      .PatientSearch({
        PatientId: this.labandImaging.PatientId
      })
      .subscribe(resp => {
        console.log(resp.ListResult);
        if (resp.IsSuccess) {
          let pat = resp.ListResult as PatientSearch[];
          if (pat.length == 1) {
            this.labandImaging.CurrentPatient = pat[0];
          }else {
            this.labandImaging.CurrentPatient = new PatientSearch()
          }
        }

      })
  }


  pageloadevent() {
    this.labingimagingattchements = this.fb.group({
      testorder: this.fb.array([]),

    })
  }
  get testorder() {
    return this.labingimagingattchements.get('testorder') as FormArray
  }
  testorders() {
    this.testorder.push(
      this.newtestorder());
  }
  newtestorder() {

    return this.fb.group({
      code: "",
      test: "",
      result: "",
      units: "",
      flag: "",
      range: "",
      delete: ""

    })
  }
  removetestorder(i: number) {
    this.testorder.removeAt(i);
  }




}
