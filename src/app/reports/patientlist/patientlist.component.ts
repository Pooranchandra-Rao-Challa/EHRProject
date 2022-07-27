import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Accountservice } from "../../_services/account.service";
import { PatientData } from "../../_models";
import { MatPaginator } from "@angular/material/paginator";
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import {
  MatSort
} from "@angular/material/sort";
import {
  MatTableDataSource
} from "@angular/material/table";
import {
  PageEvent
} from "@angular/material/paginator";
import { TableUtil } from "../tableUtil";
import { AuthenticationService } from "src/app/_services/authentication.service";
declare const $: any;

@Component({
  selector: "app-patientlist",
  templateUrl: "./patientlist.component.html",
  styleUrls: ["./patientlist.component.scss"],
})
export class PatientlistComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  providerlist: any;
  filteredproviderList: any;
  locationslist: any;
  filteredlocationList: any;
  provider_Id: string;
  customizedspinner: boolean;
  showpatientTable: boolean;
  patientForm: FormGroup;
  tomorrow = new Date();
  public allPatientList = new MatTableDataSource<PatientData>();
  patientlistdata: {
    SstartDate: string;
    SendDate: string;
    Checked: any;
    ProviderId: any;
    location_Id: any;
  };
  showPatientControls: boolean;
  PatientListColumns = [
    "Patient_Id",
    "Patient_Name",
    "Date_of_Birth",
    "Age",
    "Cell_Phone",
    "Home_phone",
    "Work_Phone",
    "Email_Address",
    "Gender",
    "Address",
    "City",
    "State",
    "Zip",
    "Prime_Subscriber_No",
    "Prime_Subscriber_Name",
  ];
  applyButtonToDisable: boolean = true;
  disableEndDateInput: boolean = true;
  name: string;
  subject: string;
  disabledowloadExportbtn: boolean = true;
  PracticeProviders: PracticeProviders[];

  constructor(private authenticationService: AuthenticationService,private smartSchedulerService: SmartSchedulerService,
    private service: Accountservice,
    private fb: FormBuilder,
    private tableutil: TableUtil,
    public datepipe: DatePipe
  ) {
    this.allPatientList = new MatTableDataSource<PatientData>();
  }

  ngOnInit() {
    this.PatientForm();
    this.getProviderList();
    this.getLocationsList("");
    
  }
  ngAfterViewInit(): void {
    this.allPatientList.paginator = this.paginator.toArray()[0];
    this.allPatientList.sort = this.sort.toArray()[0];
  }
  PatientForm() {
    this.patientForm = this.fb.group({
      SstartDate: [""],
      SendDate: [""],
      AstartDate: [""],
      AendDate: [""],
      Checked: [""],
      ProviderId: [""],
      location_Id: [""],
    });
  }

  onSubmitallpatientlist() {
    if (
      this.patientForm.value.ProviderId == "" &&
      this.patientForm.value.location_Id == ""
    ) {
      return;
    }
    var patientlist = {
      SstartDate: this.datepipe.transform(
        this.patientForm.value.SstartDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      SendDate: this.datepipe.transform(
        this.patientForm.value.SendDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      AstartDate: this.datepipe.transform(
        this.patientForm.value.AstartDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      AendDate: this.datepipe.transform(
        this.patientForm.value.AendDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      Checked: this.patientForm.value.Checked,
      ProviderId:
        this.patientForm.value.ProviderId == ""
          ? null
          : this.patientForm.value.ProviderId,
      location_Id:
        this.patientForm.value.location_Id == ""
          ? null
          : this.patientForm.value.location_Id,
    };
    this.getAllPatientList(patientlist);
    this.patientlistdata = patientlist;
  }
  disableApplyButton() {
    var ProviderId =
      this.patientForm.value.ProviderId == null
        ? ""
        : this.patientForm.value.provider_Id;
    var StartDate =
      this.patientForm.value.SstartDate == null
        ? ""
        : this.patientForm.value.SstartDate;
    var EndDate =
      this.patientForm.value.SendDate == null
        ? ""
        : this.patientForm.value.SendDate;
    var AstartDate =
      this.patientForm.value.AstartDate == null
        ? ""
        : this.patientForm.value.AstartDate;
    var AendDate =
      this.patientForm.value.AendDate == null
        ? ""
        : this.patientForm.value.AendDate;
    if (
      ProviderId != "" &&
      StartDate == "" &&
      EndDate == "" &&
      AstartDate == "" &&
      AendDate == ""
    ) {
      this.applyButtonToDisable = false;
    } else if (
      ProviderId != "" &&
      StartDate != "" &&
      EndDate != "" &&
      AstartDate != "" &&
      AendDate != ""
    ) {
      this.applyButtonToDisable = false;
      this.disableEndDateInput = false;
    } else if (
      ProviderId != "" &&
      StartDate != "" &&
      EndDate != "" &&
      AstartDate == "" &&
      AendDate == ""
    ) {
      this.applyButtonToDisable = false;
      this.disableEndDateInput = false;
    } else if (
      ProviderId != "" &&
      StartDate == "" &&
      EndDate == "" &&
      AstartDate != "" &&
      AendDate != ""
    ) {
      this.applyButtonToDisable = false;
    } else if (
      ProviderId != "" &&
      StartDate != "" &&
      EndDate == "" &&
      AstartDate == "" &&
      AendDate == ""
    ) {
      this.applyButtonToDisable = true;
      this.disableEndDateInput = false;
    } else if (
      ProviderId != "" &&
      StartDate == "" &&
      EndDate != "" &&
      AstartDate == "" &&
      AendDate == ""
    ) {
      this.applyButtonToDisable = true;
    } else if (
      ProviderId != "" &&
      AstartDate == "" &&
      AendDate != "" &&
      StartDate == "" &&
      EndDate == ""
    ) {
      this.applyButtonToDisable = true;
    } else if (
      ProviderId != "" &&
      AstartDate == "" &&
      AendDate != "" &&
      StartDate == "" &&
      EndDate == ""
    ) {
      this.applyButtonToDisable = true;
    }
    else if (StartDate == "") {
      this.disableEndDateInput = true;
    }
    else if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.applyButtonToDisable = true;
    }
  }
  getAllPatientList(data: any) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.getAllPatientList(data).subscribe((data) => {
      this.allPatientList.data = [];
      this.allPatientList.data = data.ListResult as PatientData[];
      this.showpatientTable = true;
      if (data.IsSuccess) {
        this.showPatientControls = true;
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.allPatientList.data = data.ListResult as PatientData[];
        this.showpatientTable = true;
        this.disabledowloadExportbtn = false;
      }
      this.customizedspinner = false; $('body').removeClass('loadactive');
    });
  }
  getProviderList() {
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
  }
  downloadPatientListExcel() {
    if (this.allPatientList.data.length != 0) {
      this.tableutil.exportAsExcelFilePatient(
        this.allPatientList.data,
        "Patient"
      );
    }
  }
  getLocationsList(Location: any) {
    this.service.getLocationsList(Location.ProviderId).subscribe((data) => {
      if (data.IsSuccess) {
        this.locationslist = data.ListResult;
        this.filteredlocationList = this.locationslist.slice();
      }
    });
    // if (Location == "") {
    //   this.service.getLocationsList(Location).subscribe((data) => {
    //     if (data.IsSuccess) {
    //       this.locationslist = data.ListResult;
    //       this.filteredlocationList = this.locationslist.slice();
    //     }
    //   });
    // }
  }
}
