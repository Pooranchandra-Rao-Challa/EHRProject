import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';

@Component({
  selector: 'app-orderdialogue',
  templateUrl: './orderdialogue.component.html',
  styleUrls: ['./orderdialogue.component.scss']
})
export class OrderdialogueComponent implements OnInit {
  orderTypeDD = [{ value: 'Lab', viewValue: 'Lab' }, { value: 'Imaging', viewValue: 'Imaging' }]
  labingimagingattchements: FormGroup;
  labLabImageStatusesDD:any=[];
  LabImageOrderStatusesDD:any[];
  PracticeProviders: PracticeProviders[];
  constructor(private ref: EHROverlayRef, private fb: FormBuilder,private utilityservice:UtilityService,private smartSchedulerService: SmartSchedulerService,
    private authService: AuthenticationService,) { }

  ngOnInit(): void {
    this.getLabImageStatuses();
    this.getLabImageOrderStatuses();
    this.loadDefaults();
    this.pageloadevent();
  }
  cancel() {
    this.ref.close(null);
  }
  pageloadevent() {
    this.labingimagingattchements = this.fb.group({
      testorder: this.fb.array([]),
      attachments: this.fb.array([])
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
      test: ""
    })
  }
  removetestorder(i: number) {
    this.testorder.removeAt(i);
  }
  get attachments() {
    return this.labingimagingattchements.get('attachments') as FormArray
  }


  attachements() {
    this.attachments.push(
      this.newattachedfile());
  }

  newattachedfile() {
    return this.fb.group({
      file: "",
    })
  }
  removeattachemnt(i: number) {

    this.attachments.removeAt(i);
  }
  getLabImageStatuses()
  {
    this.utilityservice.LabImageStatuses().subscribe(resp=>{
      this.labLabImageStatusesDD = resp.ListResult;
      console.log(this.labLabImageStatusesDD);
      
    })
    
  }
  getLabImageOrderStatuses()
  {
    this.utilityservice.LabImageOrderStatuses().subscribe(resp=>{
      this.LabImageOrderStatusesDD = resp.ListResult;
      console.log(this.LabImageOrderStatusesDD);
      
    })
    
  }
  loadDefaults() {
    debugger;
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
}
