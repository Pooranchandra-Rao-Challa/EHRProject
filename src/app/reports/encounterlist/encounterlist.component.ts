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
  encounterdata: {
    SstartDate: string;
    SendDate: string;
    Checked: any;
    ProviderId: any;
    location_Id: any;
  };
  showEncounterControls: boolean;
  showencounterTable: boolean;
  customizedspinner: boolean;
  EncountersColumns = [
    "Encounter_Id",
    "Patient_Name",
    "Provider_Name",
    "Birth_Date",
    "Patient_Age",
    "Encounter_Date",
    "Proc_Code",
    "Encounter_Description",
    "Proc_Fees",
    "Prime_Subscriber_No",
    "Prime_Ins_Company_Name",
    "Prim_Source_Payment_Typology",
  ];
  providerlist: any;
  filteredproviderList: any;
  locationslist: any;
  filteredlocationList: any;
  provider_Id: string;
  encounters: any;
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
    this.getLocationsList("");
    this.EncounterForm();
  }
  ngAfterViewInit(): void {
    this.encounterlist.paginator = this.paginator.toArray()[0];
    this.encounterlist.sort = this.sort.toArray()[0];
    this.encounterlist.sortingDataAccessor = (data, header) => {
      switch (header) {
        case 'Birth_Date': {
          let Birth_Date = new Date(data.Birth_Date);
          return Birth_Date;
        }
        case 'Encounter_Date': {
          let Encounter_Date = new Date(data.Encounter_Date);
          return Encounter_Date;
        }
        default: {
          return data[header];
        }
      }
    };
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
      location_Id: [""],
    });
  }

  onSubmitEncounterlist() {
    if (
      this.encounterForm.value.ProviderId == "" &&
      this.encounterForm.value.location_Id == ""
    ) {
      return;
    }
    var encounterlist = {
      SstartDate: this.datepipe.transform(
        this.encounterForm.value.SstartDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      SendDate: this.datepipe.transform(
        this.encounterForm.value.SendDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      Checked: this.encounterForm.value.Checked,
      ProviderId:
        this.encounterForm.value.ProviderId == ""
          ? null
          : this.encounterForm.value.ProviderId,
      location_Id:
        this.encounterForm.value.location_Id == ""
          ? null
          : this.encounterForm.value.location_Id,
    };
    this.getEncountersList(encounterlist);
    this.encounterdata = encounterlist;
  }

  getEncountersList(data: any) {
    this.encounters = data;
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.service.getEncountersList(data).subscribe((data) => {
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
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
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

  downloadEncountersExcel() {
    if (this.encounterlist.data.length != 0) {
      this.tableutil.exportAsExcelFileEncounter(
        this.encounterlist.data,
        "Encounter"
      );
    }
  }
}
