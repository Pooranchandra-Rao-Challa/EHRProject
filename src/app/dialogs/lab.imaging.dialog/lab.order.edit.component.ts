import { SmartSchedulerService } from './../../_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientSearch, PracticeProviders } from 'src/app/_models';
import { LabProcedureWithOrder, LabResult, TestOrder } from 'src/app/_models/_provider/LabandImage';
import { PatientService } from 'src/app/_services/patient.service';
import { TestCode, TestCodeComponent } from './test.code.component';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
@Component({
  selector: 'app-editlabimageorder',
  templateUrl: './lab.order.edit.component.html',
  styleUrls: ['./lab.order.edit.component.scss']
})
export class LabOrderEditComponent implements OnInit {
  editorderlab: FormGroup;
  formGroups: FormGroup;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  labOrders?: LabProcedureWithOrder[] = [];
  practiceProviders?: PracticeProviders[] = []
  ResultStatuses: any[];
  testCodeComponent = TestCodeComponent;
  orderIsManual?: boolean = false;
  constructor(private ref: EHROverlayRef,
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private overlayService: OverlayService,
    private utilityService: UtilityService) {
    if(ref.RequestData == null){
      this.orderIsManual = true;
      this.labandImaging = new LabProcedureWithOrder();
      if (this.labandImaging.Result == null)
        this.labandImaging.Result = new LabResult()
    }
    else{
      this.labandImaging = ref.RequestData as LabProcedureWithOrder;
      if (this.labandImaging.CurrentPatient == null)
      this.labandImaging.CurrentPatient = new PatientSearch();
      this.labOrders.push(this.labandImaging);
      if (this.labandImaging.Result == null)
        this.labandImaging.Result = new LabResult()
    }
  }

  ngOnInit(): void {
    this.pageloadevent();
    this.updatePatientInfo();
    this.loadDefaults();
    this.initTestOrderGrid();
    this.initResultStatuses();
  }
  cancel() {
    this.ref.close(null);
  }
  initResultStatuses() {
    this.utilityService.ResultStatuses().subscribe(resp => {
      this.ResultStatuses = resp.ListResult;
    })

  }
  loadOrder(){

    // this.labImageService.LabImageOrderNumberList(reqparams)
    //   .subscribe(resp => {
    //     if (resp.IsSuccess) {
    //       let lis = resp.ListResult as LabProcedureWithOrder[];
    //       lis.forEach(value =>{
    //         value.Tests = JSON.parse(value.StrTests)
    //       })
    //       this.labImageOrders = lis;
    //     }
    //   })
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
          } else {
            this.labandImaging.CurrentPatient = new PatientSearch()
          }
        }

      })
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.practiceProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
  pageloadevent() {
    this.formGroups = this.fb.group({
      testOrders: this.fb.array([]),
    })
  }

  get testOrders() {
    return this.formGroups.get('testOrders') as FormArray
  }

  addTestOrder(torder: TestOrder = null) {

    this.testOrders.push(
      this.newTestOrder(torder));

  }
  newTestOrder(torder: TestOrder = null) {
    console.log(torder);

    if (torder != null)
      return this.fb.group({
        Code: torder.Code != null ? torder.Code : "",
        Test: torder.Test != null ? torder.Test : "",
        Result: torder.Result != null ? torder.Result : "",
        Units: torder.Units != null ? torder.Units : "",
        Flag: torder.Flag != null ? torder.Flag : "",
        Range: torder.Range != null ? torder.Range : "",
        Delete: ""

      })
    else
      return this.fb.group({
        Code: "",
        Test: "",
        Result: "",
        Units: "",
        Flag: "",
        Range: "",
        Delete: ""

      })
  }
  removeLabOrder(index: number) {
    this.testOrders.controls.splice(index, 1);
  }

  initTestOrderGrid() {
    if (this.labandImaging.Tests != null)
      this.labandImaging.Tests.forEach(order => {
        this.addTestOrder(order);
      })
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = Actions.view) {
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.testCodeComponent) {
        if (res != null && res.data != null && res.data.TestCode) {
          let value = res.data.TestCode;
          this.testOrders.controls[value.Index].setValue({ Code: value.Code, Test: value.Description,
          Result: "", Flag: "", Units: "", Range: "", Delete:""});
        }
      }

    });
  }
  getCodeInfo(element, index) {
    let testCode: TestCode = new TestCode();
    testCode.Query = element.target.value;
    testCode.Scope = 'Lonics';
    testCode.Index = index;
    if(testCode.Query.length >= 3 )
      this.openComponentDialog(this.testCodeComponent,testCode);
  }
}
