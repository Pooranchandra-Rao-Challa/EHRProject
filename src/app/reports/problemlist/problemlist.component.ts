import { ProblemData } from "../../_models/_provider/_reports/problem";
import { DatePipe } from "@angular/common";
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from "src/app/_services/authentication.service";
import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
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
import { TableUtil } from "../tableUtil";
declare const $: any;

@Component({
  selector: "app-problemlist",
  templateUrl: "./problemlist.component.html",
  styleUrls: ["./problemlist.component.scss"],
})
export class ProblemlistComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  providerlist: any;
  filteredproviderList = [];
  filteredlocationList = [];
  provider_Id: string;
  problemreportform: FormGroup;
  customizedspinner: boolean;
  tomorrow = new Date();
  applyButtonToDisableproblem: boolean = true;
  disableEndDateInput: boolean = true;

  filter: {
    StartDate: any;
    EndDate: any;
    Checked: any;
    ProviderId: any;
    LocationId: any;
    ClinicId: any;
  };
  public problemreportlist = new MatTableDataSource<ProblemData>();
  ProblemListColumns: string[] = [
    "PatientName",
    "Sex",
    "DOB",
    "Address1",
    "Address2",
    "City",
    "State",
    "ZipCode",
    "LastEncounter",
    "Active",
    "DxCode",
    "DxDescription",
    "DxStartDate",
    "DxEndDate",
    "SmokingStatus",
    "Allergy",
  ];
  showPromblemListTable: boolean;
  showProblemListControls: boolean;
  disabledowloadExportbtn: boolean = true;
  PracticeProviders: PracticeProviders[];
  constructor(private authenticationService: AuthenticationService, private smartSchedulerService: SmartSchedulerService,
    private service: Accountservice,
    private fb: FormBuilder,
    private tableutil: TableUtil,
    public datepipe: DatePipe
  ) {
    this.problemreportlist = new MatTableDataSource<ProblemData>();
  }

  ngOnInit() {
    this.ProblemReportForm();
    this.getProviderList();
  }
  ngAfterViewInit(): void {
    this.problemreportlist.paginator = this.paginator.toArray()[0];
    this.problemreportlist.sort = this.sort.toArray()[0];
  }
  disableApplyButtonProblemlist() {
    var ProviderId =
      this.problemreportform.value.ProviderId == null
        ? ""
        : this.problemreportform.value.ProviderId;
    var StartDate =
      this.problemreportform.value.StartDate == null
        ? ""
        : this.problemreportform.value.StartDate;
    var EndDate =
      this.problemreportform.value.EndDate == null
        ? ""
        : this.problemreportform.value.EndDate;
    if (ProviderId != "" && StartDate == "" && EndDate == "") {
      this.applyButtonToDisableproblem = false;
    }
    else if (ProviderId != "" && StartDate != "" && EndDate != "") {
      this.applyButtonToDisableproblem = false;
      this.disableEndDateInput = false;
    }
    else if (ProviderId != "" && StartDate != "" && EndDate == "") {
      this.applyButtonToDisableproblem = true;
      this.disableEndDateInput = false;
    }
    else if (ProviderId != "" && StartDate == "" && EndDate != "") {
      this.applyButtonToDisableproblem = true;
    }
    else if (StartDate == "") {
      this.disableEndDateInput = true;
    }
    else if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.applyButtonToDisableproblem = true;
    }
  }
  ProblemReportForm() {
    this.problemreportform = this.fb.group({
      StartDate: [""],
      EndDate: [""],
      Checked: [""],
      ProviderId: [""],
      LocationId: [""],
    });
  }

  onSubmitProblemReportList() {
    if (
      this.problemreportform.value.ProviderId == "" &&
      this.problemreportform.value.LocationId == ""
    ) {
      return;
    }
    this.filter = {
      StartDate: this.datepipe.transform(
        this.problemreportform.value.StartDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      EndDate: this.datepipe.transform(
        this.problemreportform.value.EndDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      ClinicId: null,
      Checked: this.problemreportform.value.Checked,
      ProviderId:
        this.problemreportform.value.ProviderId == "" || this.problemreportform.value.ProviderId == "All"
          ? null
          : this.problemreportform.value.ProviderId,
      LocationId:
        this.problemreportform.value.LocationId == "" || this.problemreportform.value.LocationId == "All"
          ? null
          : this.problemreportform.value.LocationId,
    };
    if (this.filter.ProviderId == null && this.filter.LocationId == null)
      this.filter.ClinicId = this.authenticationService.userValue.ClinicId;
    this.getProblemReportList();

  }

  getProblemReportList() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.ProblemListForReport(this.filter).subscribe((data) => {
      this.problemreportlist.data = [];
      this.showPromblemListTable = true;
      if (data.IsSuccess) {
        this.showProblemListControls = true;
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        this.problemreportlist.data = data.ListResult as ProblemData[];
        this.showPromblemListTable = true;
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
        //this.PracticeProviders = resp.ListResult as PracticeProviders[];
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
  downloadProblemListExcel() {
    let exportdata = []
    this.problemreportlist.data.forEach((d) => {
      exportdata.push({
        'PatientId': d.PatientId,
        'Patient_Name': d.PatientName,
        'Sex': d.Sex,
        'DateofBirth': d.DOB != null ? this.datepipe.transform(new Date(d.DOB), "MM/dd/yyyy") : null,
        'Address1': d.Address1,
        'Address2': d.Address2,
        'City': d.City,
        'State': d.State,
        'Zip-Code': d.ZipCode,
        'Last_Encounter': d.LastEncounter != null ? this.datepipe.transform(new Date(d.LastEncounter), "MM/dd/yyyy") : null,
        'Active': d.Active,
        'Dx_ICD10-SNOMED_Code': d.DxCode,
        'Dx_ICD10-SNOMED_Description': d.DxDescription,
        'Dx_Start_Date': d.DxStartDate,
        'Dx_End_Date': d.DxEndDate,
        'Smoking_Status': d.SmokingStatus,
        'Allergy': d.Allergy
      });



    });
    if (exportdata.length != 0) {
      this.tableutil.exportAsExcelFileProblem(
        exportdata,
        "Problem-List"
      );
    }
  }
}
