import { PatientService } from 'src/app/_services/patient.service';
import { MedicalCode } from 'src/app/_models/codes';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Observable, of } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { filter, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientSearch, } from 'src/app/_models';
import { LabProcedureWithOrder, TestOrder } from 'src/app/_models/_provider/LabandImage';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { TestCode, TestCodeComponent } from './test.code.component';
import { OverlayService } from 'src/app/overlay.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order.dialog.component.html',
  styleUrls: ['./order.dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  filteredPatients: Observable<PatientSearch[]>;
  orderTypeDD = [{ value: 'Lab', viewValue: 'Lab' }, { value: 'Imaging', viewValue: 'Imaging' }]
  formGroups: FormGroup;
  labLabImageStatusesDD: any = [];
  LabImageOrderStatusesDD: any[];
  PracticeProviders: PracticeProviders[];
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  isLoading: boolean = false;
  filteredOptions: Observable<MedicalCode[]>;
  testCodeComponent = TestCodeComponent;
  constructor(private ref: EHROverlayRef,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService,
    private pateintService: PatientService,
    private labsImagingService: LabsImagingService,
    private alertMessage: AlertMessage,
    private authService: AuthenticationService,
    private overlayService: OverlayService,
    private datePipe: DatePipe) {
    this.labandImaging = ref.RequestData as LabProcedureWithOrder;
    this.labandImaging.ProcedureType = this.labandImaging.View;
    this.labandImaging.OrderingFacility = this.labandImaging.View;
  }

  ngOnInit(): void {
    this.getLabImageStatuses();
    this.getLabImageOrderStatuses();
    this.loadDefaults();
    this.initFormGroups();
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 2 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient(value));
  }
  _filterPatient(term) {
    this.isLoading = true;
    this.pateintService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        } else this.filteredPatients = of([]);
      })
  }
  onPatientSelected(selected) {
    this.labandImaging.CurrentPatient = selected.option.value;
  }
  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
  }
  cancel() {
    this.ref.close(null);
  }
  initFormGroups() {
    this.formGroups = this.fb.group({
      orders: this.fb.array([]),
      attachments: this.fb.array([])
    })
  }
  get orders() {
    return this.formGroups.get('orders') as FormArray
  }
  addLabOrders() {
    this.orders.push(this.addOrder());
  }
  removeLabOrder(index: number) {
    this.orders.controls.splice(index, 1);
  }
  addOrder() {
    return this.fb.group({
      Code: "",
      Test: ""
    })
  }

  get attachments() {
    return this.formGroups.get('attachments') as FormArray
  }

  attachements() {
    this.attachments.push(
      this.addAttachment());
  }

  addAttachment() {
    return this.fb.group({
      file: "",
    })
  }
  removeAttachemnt(index: number) {
    this.attachments.removeAt(index);
  }

  getLabImageStatuses() {
    this.utilityService.LabImageStatuses().subscribe(resp => {
      this.labLabImageStatusesDD = resp.ListResult;
    })
  }
  getLabImageOrderStatuses() {
    this.utilityService.LabImageOrderStatuses().subscribe(resp => {
      this.LabImageOrderStatusesDD = resp.ListResult;
    })

  }
  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
  enableSave() {
    return !(this.labandImaging.CurrentPatient != null
      && this.labandImaging.ProcedureType != null && this.labandImaging.ProcedureType != ""
      && this.labandImaging.LabName != null && this.labandImaging.LabName != ""
      && this.labandImaging.Status != null && this.labandImaging.Status != ""
      && this.labandImaging.ScheduledAt != null && this.labandImaging.ScheduledAt != ""
      && this.labandImaging.OrderingPhyscianId != null && this.labandImaging.OrderingPhyscianId != ""
      && this.labandImaging.OrderingFacility != null && this.labandImaging.OrderingFacility != ""
      && this.labandImaging.OrderStatus != null && this.labandImaging.OrderStatus != ""
      && this.hasOrders)


  }

  get hasOrders() {
    let values = this.orders.getRawValue() as TestOrder[];
    this.labandImaging.Tests = values;
    let flag: boolean = true;
    values.forEach(value => {
      flag = flag && value.Code != "" && value.Test != "";
    })
    return flag && values.length > 0;
  }

  save() {
    console.log(this.labandImaging);
    let isAdd = this.labandImaging.LabProcedureId == null;
    this.labandImaging.ClinicId = this.authService.userValue.ClinicId;
    this.labandImaging.LocationId = this.authService.userValue.CurrentLocation;
    this.labandImaging.StrScheduledAt = this.datePipe.transform(this.labandImaging.ScheduledAt,"MM/dd/yyyy")
    this.labandImaging.strReceivedAt = this.datePipe.transform(this.labandImaging.ReceivedAt,"MM/dd/yyyy")

    this.labsImagingService.CreateLabOrImagingOrder(this.labandImaging)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.ref.close({ "saved": true });
          this.alertMessage.displayMessageDailog(ERROR_CODES[isAdd ? "M2G1001" : "M2G1002"]);

        } else {
          this.close();
          this.alertMessage.displayErrorDailog(ERROR_CODES[isAdd ? "E2G1001" : "E2G1002"]);
        }

      });
  }

  close() {
    this.ref.close();
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = Actions.view) {
    const ref = this.overlayService.open(content, dialogData);
    ref.afterClosed$.subscribe(res => {
      if (content === this.testCodeComponent) {
        if (res != null && res.data != null && res.data.TestCode) {
          let value = res.data.TestCode;
          this.orders.controls[value.Index].setValue({ Code: value.Code, Test: value.Description });
        }
      }

    });
  }
  getCodeInfo(element, index) {
    let testCode: TestCode = new TestCode();
    testCode.Query = element.target.value;
    testCode.Scope = 'Lonics';
    testCode.Index = index;
    this.openComponentDialog(this.testCodeComponent,testCode);
  }
}
