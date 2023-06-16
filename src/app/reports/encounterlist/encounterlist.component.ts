import { Location } from './../../_models/_provider/_settings/settings';
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormBuilder } from "@angular/forms";
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
import { Accountservice } from "../../_services/account.service";
import { EncounterData } from "../../_models";
import { TableUtil } from "../tableUtil";
import { $$ } from "protractor";
import { AuthenticationService } from "src/app/_services/authentication.service";
declare const $: any;

@Component({
  selector: "app-encounterlist",
  templateUrl: "./encounterlist.component.html",
  styleUrls: ["./encounterlist.component.scss"],
})
export class EncounterlistComponent implements OnInit {
  encounterForm: FormGroup;
  public encounterlist = new MatTableDataSource<EncounterData>();
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  applyButtonToDisableencounter: boolean = true;
  disableEndDateInput: boolean = true;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  tomorrow = new Date();
  filter: {
    StartDate: string;
    EndDate: string;
    Checked: any;
    ProviderId: any;
    LocationId: any;
    ClinicId:any;
  };
  showEncounterControls: boolean;
  showencounterTable: boolean;
  customizedspinner: boolean;
  EncountersColumns = [
    "EncounterId",
    "PatientName",
    "ProviderName",
    "DateOfBirth",
    "Age",
    "ServicedAt",
    "ProcedureCode",
    "EncounterDescription",
    "ProcedureFee",
    "PrimarySubscriberNo",
    "PrimaryInsuranceCompany",
    "PrimarySourcePaymentTypology",
  ];
  providerlist: any;
  filteredproviderList: any;
  filteredlocationList: any;
  provider_Id: string;
  disabledowloadExportbtn: boolean = true;
  PracticeProviders: PracticeProviders[];

  constructor(private authenticationService: AuthenticationService,private smartSchedulerService: SmartSchedulerService,
    private service: Accountservice,
    private fb: FormBuilder,
    private tableutil: TableUtil,
    public datepipe: DatePipe
  ) {
    this.encounterlist = new MatTableDataSource<EncounterData>();
  }

  ngOnInit() {
    this.getProviderList();
    this.EncounterForm();
  }
  ngAfterViewInit(): void {
    this.encounterlist.paginator = this.paginator.toArray()[0];
    this.encounterlist.sort = this.sort.toArray()[0];
  }
  disableApplyButtonEncounterlist() {
    var ProviderId =
      this.encounterForm.value.ProviderId == null
        ? ""
        : this.encounterForm.value.ProviderId;
    var StartDate =
      this.encounterForm.value.SstartDate == null
        ? ""
        : this.encounterForm.value.SstartDate;
    var EndDate =
      this.encounterForm.value.SendDate == null
        ? ""
        : this.encounterForm.value.SendDate;
    if (ProviderId != "" && StartDate == "" && EndDate == "") {
      this.applyButtonToDisableencounter = false;
    }
    else if (ProviderId != "" && StartDate != "" && EndDate != "") {
      this.applyButtonToDisableencounter = false;
      this.disableEndDateInput = false;
    }
    else if (ProviderId != "" && StartDate != "" && EndDate == "") {
      this.applyButtonToDisableencounter = true;
      this.disableEndDateInput = false;
    }
    else if (ProviderId != "" && StartDate == "" && EndDate != "") {
      this.applyButtonToDisableencounter = true;
    }
    else if (StartDate == "") {
      this.disableEndDateInput = true;
    }
    else if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.applyButtonToDisableencounter = true;
    }
  }
  EncounterForm() {
    this.encounterForm = this.fb.group({
      SstartDate: [""],
      SendDate: [""],
      Checked: false,
      ProviderId: [""],
      LocationId: [""],
    });
  }

  onSubmitEncounterlist() {
    if (
      this.encounterForm.value.ProviderId == "" &&
      this.encounterForm.value.locationId == ""
    ) {
      return;
    }
    this.filter = {
      StartDate: this.datepipe.transform(
        this.encounterForm.value.SstartDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      EndDate: this.datepipe.transform(
        this.encounterForm.value.SendDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      Checked: this.encounterForm.value.Checked,
      ProviderId:
        this.encounterForm.value.ProviderId == "" || this.encounterForm.value.ProviderId == "All"
          ? null
          : this.encounterForm.value.ProviderId,
      LocationId:
        this.encounterForm.value.LocationId == "" || this.encounterForm.value.LocationId == "All"
          ? null
          : this.encounterForm.value.LocationId,
      ClinicId: null
    };
    if (this.filter.ProviderId == null && this.filter.LocationId == null)
    this.filter.ClinicId = this.authenticationService.userValue.ClinicId;

    this.getEncountersList();

  }

  getEncountersList() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.EncounterListForReport(this.filter).subscribe((data) => {
      this.encounterlist.data = [];
      this.showencounterTable = true;


      if (data.IsSuccess) {
        this.showEncounterControls = true;
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.encounterlist.data = data.ListResult as EncounterData[];
        this.showencounterTable = true;
        this.disabledowloadExportbtn = false;
      }
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

  downloadEncountersExcel() {
    let exportdata = [];
    this.encounterlist.data.forEach((d) => {
      exportdata.push({
        'Encounter_Id': d.EncounterId,
        'Patient_Name': d.PatientName,
        'Provider_Name': d.ProviderName,
        'Date_of_Birth': d.DateOfBirth != null ? this.datepipe.transform(new Date(d.DateOfBirth), "MM/dd/yyyy") : null,
        'Age': d.Age,
        'Encounter_Date': d.ServicedAt != null ? this.datepipe.transform(new Date(d.ServicedAt), "MM/dd/yyyy") : null,
        'Proc_Code': d.ProcedureCode,
        'Encounter_Description': d.EncounterDescription,
        'Proc_Fee': d.ProcedureFee,
        'Primary_Subscriber_Id': d.PrimarySubscriberNo,
        'Primary_Insurance_Company_Name': d.PrimaryInsuranceCompany,
        'Primary_Source_of_Payment_Typology': d.PrimarySourcePaymentTypology,
      })
    })
    if (this.encounterlist.data.length != 0) {
      this.tableutil.exportAsExcelFileEncounter(
        exportdata,
        "Encounter"
      );
    }
  }

  // [['Patient Id', 'Patient Name','Birth Date', 'Age', 'Gender',  'Encounter Id','Proc Code','Description', 'Provider Name', 'Encounter Date',
  //   'Proc Fees', 'Prime Subscriber Id', 'Prime Ins Company Name', 'Prime Source of Payment Typology']];
}
