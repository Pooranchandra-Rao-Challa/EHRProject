import { WeekdayFormatPipe } from './../../_pipes/weekday-format-pipe';
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
  filteredproviderList = [];
  filteredlocationList = [];
  provider_Id: string;
  customizedspinner: boolean;
  showpatientTable: boolean;
  patientForm: FormGroup;
  tomorrow = new Date();
  public allPatientList = new MatTableDataSource<PatientData>();
  filter: {
    SstartDate?: string;
    SendDate?: string;
    Checked?: any;
    ProviderId?: any;
    LocationId?: any;
    AstartDate?: string;
    AendDate?: string;
    ClinicId?: any;

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

  constructor(private authenticationService: AuthenticationService, private smartSchedulerService: SmartSchedulerService,
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
      locationId: [""],
    });
  }

  onSubmitallpatientlist() {
    if (
      this.patientForm.value.ProviderId == "" &&
      this.patientForm.value.locationId == ""
    ) {
      return;
    }
    this.filter = {
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
      ClinicId: null,
      ProviderId:
        this.patientForm.value.ProviderId == "" || this.patientForm.value.ProviderId == "All"
          ? null
          : this.patientForm.value.ProviderId,
      LocationId:
        this.patientForm.value.locationId == "" || this.patientForm.value.locationId == "All"
          ? null
          : this.patientForm.value.locationId,
    };
    if (this.filter.ProviderId == null && this.filter.LocationId == null)
      this.filter.ClinicId = this.authenticationService.userValue.ClinicId;
    console.log(this.filter);
    this.getAllPatientList();
  }
  disableApplyButton() {
    var ProviderId =
      this.patientForm.value.ProviderId == null
        ? ""
        : this.patientForm.value.providerId;
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
  getAllPatientList() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.getAllPatientList(this.filter).subscribe((data) => {
      this.allPatientList.data = [];
      if (data.IsSuccess) {
        this.showPatientControls = true;
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.allPatientList.data = data.ListResult as PatientData[];
        this.showpatientTable = true;
        this.disabledowloadExportbtn = false;
      } else this.showpatientTable = true;
      this.customizedspinner = false; $('body').removeClass('loadactive');
    });
  }
  getProviderList() {
    let req = { "ClinicId": this.authenticationService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      this.PracticeProviders = [];
      if (resp.IsSuccess) {
        this.PracticeProviders.push({
          'ProviderId': 'All',
          'FullName': 'All Providers'
        } as PracticeProviders);
        (resp.ListResult as PracticeProviders[]).forEach((p) => {
          this.PracticeProviders.push({
            'ProviderId': p.ProviderId,
            'FullName': p.FullName
          } as PracticeProviders);
        })
      } else {
        this.PracticeProviders.push({
          'ProviderId': 'All',
          'FullName': 'All'
        } as PracticeProviders)
      }
    });
  }
  downloadPatientListExcel() {
    let exportdata = [];
    this.allPatientList.data.forEach((d) => {
      exportdata.push({
        'Patient_Id': d.Patient_Id,
        'Patient_Name': d.Patient_Name,
        'Date_of_Birth': d.Date_of_Birth,
        'Age': d.Age,
        'Gender': d.Gender,
        'Cell_Phone': d.Cell_Phone,
        'Home_phone': d.Home_phone,
        'Work_Phone': d.Work_Phone,
        'Email_Address': d.Email_Address,
        'Address': d.Address,
        'City': d.City,
        'State': d.State,
        'Zip': d.Zip,
        'Prime_Subscriber_Id': d.Prime_Subscriber_No,
        'Prime_Subscriber_Name': d.Prime_Subscriber_Name,
      })
    })
    if (this.allPatientList.data.length != 0) {
      this.tableutil.exportAsExcelFilePatient(
        exportdata,
        "Patient"
      );
    }
  }
  onProviderSelected(Provider: any) {
    let temp = {
      "ProviderId": Provider.ProviderId == "All" ? null : Provider.ProviderId,
      "ClinicId": Provider.ProviderId == "All" ? this.authenticationService.userValue.ClinicId : null
    };
    this.smartSchedulerService.ProviderPracticeLocations(temp).subscribe(data => {
      this.filteredlocationList = [];
      if (data.IsSuccess) {
        this.filteredlocationList.push({
          'LocationId': 'All',
          'LocationName': 'All Locations'
        });
        (data.ListResult as any[]).forEach((location) => {
          this.filteredlocationList.push({
            'LocationId': location.LocationId,
            'LocationName': location.LocationName
          });
        })

      } else {
        this.filteredlocationList.push({
          'LocationId': 'All',
          'LocationName': 'All Locations'
        });
      }
    });

  }
}
