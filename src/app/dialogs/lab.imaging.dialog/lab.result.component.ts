
import { LabsImagingService } from '../../_services/labsimaging.service';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientSearch, PracticeProviders, User } from 'src/app/_models';
import { LabProcedureWithOrder, LabResultInfo, TestOrder } from 'src/app/_models/_provider/LabandImage';
import { PatientService } from 'src/app/_services/patient.service';
import { TestCode, TestCodeComponent } from './test.code.component';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { DatePipe } from '@angular/common';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
@Component({
  selector: 'app-editlabimageorder',
  templateUrl: './lab.result.component.html',
  styleUrls: ['./lab.result.component.scss']
})
export class LabResultComponent implements OnInit {
  editorderlab: FormGroup;
  formGroups: FormGroup;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  labOrders?: LabProcedureWithOrder[] = [];
  practiceProviders?: PracticeProviders[] = []
  ResultStatuses: any[];
  testCodeComponent = TestCodeComponent;
  orderIsManual?: boolean = false;
  saveClicked?: boolean = false;
  user: User;
  constructor(private ref: EHROverlayRef,
    private fb: FormBuilder,
    private patientService: PatientService,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private overlayService: OverlayService,
    private utilityService: UtilityService,
    private labsImagingService: LabsImagingService,
    private alertMessage: AlertMessage,
    private datePipe: DatePipe) {
    if (ref.RequestData == null) {
      this.orderIsManual = true;
      this.labandImaging = new LabProcedureWithOrder();
      if (this.labandImaging.LabResult == null)
        this.labandImaging.LabResult = new LabResultInfo()
    }
    else {
      this.labandImaging = ref.RequestData as LabProcedureWithOrder;
      if (this.labandImaging.CurrentPatient == null)
        this.labandImaging.CurrentPatient = new PatientSearch();
      this.labOrders.push(this.labandImaging);
      if (this.labandImaging.LabResult == null)
        this.labandImaging.LabResult = new LabResultInfo()
    }
  }

  ngOnInit(): void {
    this.pageloadevent();
    this.updatePatientInfo();
    this.loadDefaults();
    this.initTestOrderGrid();
    this.initResultStatuses();
    this.loadLabResult();
  }
  cancel() {
    this.ref.close(null);
  }
  initResultStatuses() {
    this.utilityService.ResultStatuses().subscribe(resp => {
      this.ResultStatuses = resp.ListResult;
    })

  }
  loadLabResult() {

    this.labsImagingService.LabResult(this.labandImaging)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let labResult = resp.Result as LabResultInfo;
          if (labResult.CollectedDate != null) {
            labResult.CollectedDate = new Date(labResult.CollectedDate);
            labResult.CollectedTime = this.datePipe.transform(labResult.CollectedDate, "hh:mm a");
          }

          if (labResult.ReceivedDate != null) {
            labResult.ReceivedDate = new Date(labResult.ReceivedDate);
            labResult.ReceivedTime = this.datePipe.transform(labResult.ReceivedDate, "hh:mm a");
          }

          if (labResult.TestedDate != null) {
            labResult.TestedDate = new Date(labResult.TestedDate);
            labResult.TestedTime = this.datePipe.transform(labResult.TestedDate, "hh:mm a");
          }

          if (labResult.TestReportedDate != null)
            labResult.TestReportedDate = new Date(labResult.TestReportedDate);

          this.labandImaging.LabResult = labResult;
        } else {
          this.labandImaging.LabResult = new LabResultInfo();
        }
      })
  }
  updatePatientInfo() {
    this.patientService
      .PatientSearch({
        PatientId: this.labandImaging.PatientId
      })
      .subscribe(resp => {
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
  updateNPI(event){
    var a:PracticeProviders[]  = this.practiceProviders.filter((value)=>value.ProviderId==event.value);
    if(a.length == 1)
    this.labandImaging.LabResult.NPI = a[0].NPI;
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

  addTestOrder(torder: TestOrder = {}) {

    this.testOrders.push(
      this.newTestOrder(torder));

  }
  newTestOrder(torder: TestOrder = {}) {

    return this.fb.group({
      Code: torder.Code,
      Test: torder.Test,
      Result: torder.Result,
      Units: torder.Units,
      Flag: torder.Flag,
      Range: torder.Range,
      TestOrderId: torder.TestOrderId == null || torder.TestOrderId == '' ?
        -1 * (this.testOrders.length + 1) : torder.TestOrderId,
      Delete: ""

    })

  }

  removeLabOrder(index: number) {
    this.testOrders.controls.splice(index, 1).forEach(ctrl => {
      if (isNaN(ctrl.get("TestOrderId").value))
        if (this.labandImaging.RemovedTestOrderIds == null) this.labandImaging.RemovedTestOrderIds = [];
      this.labandImaging.RemovedTestOrderIds.push(ctrl.get("TestOrderId").value);
    });
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
          this.testOrders.controls[value.Index].setValue({
            Code: value.Code, Test: value.Description,
            Result: "", Flag: "", Units: "", Range: "", Delete: "",
            TestOrderId: -1 * value.Index
          });
        }
      }

    });
  }
  getCodeInfo(element, index) {
    let testCode: TestCode = new TestCode();
    testCode.Query = element.target.value;
    testCode.Scope = 'Lonics';
    testCode.Index = index;
    if (testCode.Query.length >= 3)
      this.openComponentDialog(this.testCodeComponent, testCode);
  }
  save(item) {
    this.labandImaging.Signed = item;
    this.saveClicked = true;
    let testResults = this.testOrders.getRawValue();
    this.labandImaging.Tests = testResults;

    if (this.labandImaging.LabResult.CollectedDate != null)
      this.labandImaging.LabResult.CollectedAt = this.datePipe.transform(this.labandImaging.LabResult.CollectedDate, "MM/dd/yyyy");
    if (this.labandImaging.LabResult.CollectedTime != null && this.labandImaging.LabResult.CollectedAt != null)
      this.labandImaging.LabResult.CollectedAt = this.labandImaging.LabResult.CollectedAt + ' ' + this.labandImaging.LabResult.CollectedTime;

    if (this.labandImaging.LabResult.ReceivedDate != null)
      this.labandImaging.LabResult.ReceivedAt = this.datePipe.transform(this.labandImaging.LabResult.ReceivedDate, "MM/dd/yyyy");
    if (this.labandImaging.LabResult.ReceivedAt && this.labandImaging.LabResult.ReceivedTime != null)
      this.labandImaging.LabResult.ReceivedAt = this.labandImaging.LabResult.ReceivedAt + ' ' + this.labandImaging.LabResult.ReceivedTime;

    if (this.labandImaging.LabResult.TestedDate != null)
      this.labandImaging.LabResult.TestedAt = this.datePipe.transform(this.labandImaging.LabResult.TestedDate, "MM/dd/yyyy");
    if (this.labandImaging.LabResult.TestedAt != null && this.labandImaging.LabResult.TestedTime != null)
      this.labandImaging.LabResult.TestedAt = this.labandImaging.LabResult.TestedAt + ' ' + this.labandImaging.LabResult.TestedTime;

    if (this.labandImaging.LabResult.TestReportedDate != null)
      this.labandImaging.LabResult.TestReportedAt = this.datePipe.transform(this.labandImaging.LabResult.TestReportedDate, "MM/dd/yyyy");

    this.labandImaging.strResult = JSON.stringify(this.labandImaging.LabResult);
    this.labandImaging.LabResult.NPI = this.labandImaging.NPI;

    let isAdd = this.labandImaging.LabResult.LabResultId == null || this.labandImaging.LabResult.LabResultId == '';
    this.labsImagingService.UpdateLabResult(this.labandImaging).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({ "saved": true });
        this.alertMessage.displayMessageDailog(ERROR_CODES[isAdd ? "M2G1004" : "M2G1005"]);
      } else {
        this.close();
        this.alertMessage.displayErrorDailog(ERROR_CODES[isAdd ? "E2G1004" : "E2G1005"]);
      }
    });
  }

  close() {
    this.ref.close();
  }
}
