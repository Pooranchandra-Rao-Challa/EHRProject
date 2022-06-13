import { ProblemData } from "../../_models/_provider/_reports/problem";
import { DatePipe } from "@angular/common";
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
  filteredproviderList: any;
  locationslist: any;
  filteredlocationList: any;
  provider_Id: string;
  problemreportform: FormGroup;
  customizedspinner: boolean;
  tomorrow = new Date();
  applyButtonToDisableproblem: boolean = true;
  disableEndDateInput: boolean = true;

  problemreportlistdata: {
    StartDate: any;
    EndDate: any;
    Checked: any;
    ProviderId: any;
    LocationId: any;
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
  constructor(
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
    this.getLocationsList("");
  }
  ngAfterViewInit(): void {
    this.problemreportlist.paginator = this.paginator.toArray()[0];
    this.problemreportlist.sort = this.sort.toArray()[0];
  }
  disableApplyButtonProblemlist() {
    var Provider_Id =
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
    if (Provider_Id != "" && StartDate == "" && EndDate == "") {
      this.applyButtonToDisableproblem = false;
    }
    else if (Provider_Id != "" && StartDate != "" && EndDate != "") {
      this.applyButtonToDisableproblem = false;
      this.disableEndDateInput = false;
    }
    else if (Provider_Id != "" && StartDate != "" && EndDate == "") {
      this.applyButtonToDisableproblem = true;
      this.disableEndDateInput = false;
    }
    else if (Provider_Id != "" && StartDate == "" && EndDate != "") {
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
    var problemreportlist = {
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
      Checked: this.problemreportform.value.Checked,
      ProviderId:
        this.problemreportform.value.ProviderId == ""
          ? null
          : this.problemreportform.value.ProviderId,
      LocationId:
        this.problemreportform.value.LocationId == ""
          ? null
          : this.problemreportform.value.LocationId,
    };
    this.getProblemReportList(problemreportlist);
    this.problemreportlistdata = problemreportlist;
  }

  getProblemReportList(data: any) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.getProblemListReportByProviderId(data).subscribe((data) => {
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
    let locationid = localStorage.getItem("providerlocation");

    var req = {
      LocationId: locationid,
    };
    this.service.getProviderList(req).subscribe((data) => {
      if (data.IsSuccess) {
        this.providerlist = data.ListResult;
        this.filteredproviderList = this.providerlist.slice();
      }
    });
  }

  getLocationsList(Location: any) {
    this.service.getLocationsList(Location.Provider_Id).subscribe((data) => {
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
  downloadProblemListExcel() {
    if (this.problemreportlist.data.length != 0) {
      this.tableutil.exportAsExcelFileProblem(
        this.problemreportlist.data,
        "Problem-List"
      );
    }
  }
}
