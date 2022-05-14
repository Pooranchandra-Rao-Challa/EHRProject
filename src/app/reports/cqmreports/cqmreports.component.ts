import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Accountservice } from "../../_services/account.service";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import * as pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";


import {
  CQMReportsData,
  DrillEncounters,
  DrillPatient,
  DrillAuthor,
  User,
  UserLocations,
} from "../../_models";

import { DownloadService } from "../../_services/download.service";
import { AuthenticationService } from "../../_services/authentication.service";
declare const $: any;
@Component({
  selector: "app-cqmreports",
  templateUrl: "./cqmreports.component.html",
  styleUrls: ["../../app.component.scss", "./cqmreports.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CqmreportsComponent implements OnInit, AfterViewInit {
  drilldownEncounterColumns = [
    "Action",
    "Date_Start",
    "Date_Stop",
    "code",
    "Code_System_Name",
    "Code_Description",
    "Status",
  ];
  drilldownClientColumns = [
    "action",
    "Patient_LastName",
    "Patient_MiddleName",
    "Patient_FirstName",
    "Patient_DoB",
    "Patient_Gender",
  ];
  drilldownAuthorsColumns = [
    "actionn",
    "Author_BusinessName",
    "NameGiven",
    "NameSuffix",
    "Author_BusinessPhone",
  ];
  public getDrilldownEncountersData = new MatTableDataSource<DrillEncounters>();
  public getDrilldownListTabData = new MatTableDataSource<DrillPatient>();
  public getDrilldownListTabData1 = new MatTableDataSource<DrillAuthor>();

  expandedElement: DrillEncounters | null;
  expandedElement1: DrillPatient | null;
  expandedElement2: DrillAuthor | null;
  user: User;
  conditions: any = [];
  selected = "100";
  p: any;
  createReportForm: FormGroup;
  patientlistfilterForm: FormGroup;
  queuedreportfilterForm: FormGroup;
  ipp68: any;
  Denominator68: any;
  ipp: any[] = [];
  sample: any = [];
  isViewResults: boolean;
  ViewResults: boolean = true;
  customizedspinner: boolean = true;
  getDashBoardreport: any;
  showQueuedReportsTable: boolean;
  panelOpenState: boolean = false;
  showPatientList: boolean = false;
  showDrilldown: boolean = false;
  showTopData: boolean;
  showUseFilterForm: boolean = false;
  showClearFilterBtn: boolean = false;
  showChooseFile: boolean = false;
  disableEndDateInput: boolean = true;
  queuedReportsColumns = [
    "Description",
    "Measures",
    "Measurement",
    "Date",
    "Type",
    "Report",
    "Action",
  ];
  // pageSize = 10;
  // pageIndex = 0;
  // pageSizeOptions: number[] = [5, 10, 25, 100];
  // pageEvent: PageEvent;
  providerlist: any[] = [];
  locationslist: any;
  filteredproviderList: any = [];
  filteredlocationList: any;
  checksbtn: boolean = true;
  countsbtn: boolean = false;

  // @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public getoverrallreport = new MatTableDataSource<CQMReportsData>();

  router: any;
  cqmcreatereport: boolean;
  tabId: string;
  isLoggedIn: boolean;
  datasourceid: string;
  datasesssion: string;
  getPatientListTabData: any;
  ReportId: MatTableDataSource<CQMReportsData>;
  showcheckcountbtn: boolean;
  displayedRows$: Observable<any>;
  patientlistdata: any = {};
  patientlistmeasure: any;
  Id: any;
  x: any;
  getDetailsTabData: any;
  getDetailsTabData1: any;
  getDetailsTabData2: any;
  patientinfo: any;
  y: any;
  providerslocationwise: any;
  providerslocationwise1: any;
  MeasureReportId: any;
  loc: any;
  location: any;
  providerslocationwisefilter: any;
  startDate: any;
  patientlistfilter: any;
  xml: any;
  qrdareport: any;
  queuedreportdata: any = [];
  ipp_conditions: any = [];
  deno_conditions: any = [];
  num_conditions: any = [];
  deno_excep_conditions: any = [];
  deno_exclu_conditions: any = [];
  DrilldownPatientData: any = [];
  MeasureSetId: any;
  MeasureIdentifier: any;
  StratificationText: any;
  firstencounter: any;
  lastencounter: string;
  startdate: string;
  enddate: string;
  populationdescription: any;
  stratificationText: any;
  patientdob: string;
  //locationarray: string[];
  measures: any;
  filteredproviders: any;
  providerid: any;
  patientlistfilterlength: number;
  getoverrallreportlength: number;
  userLocationInfo: UserLocations[];

  public downloadAsPDF() {
    //debugger;
    const documenDefinition = {
      content: [
        {
          table: {
            widths: [150, 380],

            font: "sans-serif",
            body: [
              [
                {
                  text: "Document Created",
                  fillColor: "#41b6a6",
                  color: "white",
                },
                {
                  text: this.patientlistmeasure.DateCreated,
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
              [
                { text: "Performer", fillColor: "#41b6a6", color: "white" },
                {
                  text: this.patientlistmeasure.ProviderName,
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
              [
                { text: "Author", fillColor: "#41b6a6", color: "white" },
                {
                  text: this.patientlistmeasure.LocationName,
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
              [
                {
                  text: "Regulated product",
                  fillColor: "#41b6a6",
                  color: "white",
                },
                {
                  text: "Medical record,Device",
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
              [
                {
                  text: "Document maintained by",
                  fillColor: "#41b6a6",
                  color: "white",
                },
                {
                  text: this.patientlistmeasure.LocationName,
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
              [
                { text: "Contact Info", fillColor: "#41b6a6", color: "white" },
                {
                  text: this.patientlistmeasure.Location_phone,
                  fillColor: "#e5f8f5",
                  color: "black",
                },
              ],
            ],
          },
        },
        {
          text: "     ",
        },

        {
          text: "Table of Contents",
          alignment: "left",
        },
        {
          ul: [
            {
              fontSize: 9,
              decoration: "underline",
              text: "Reporting Parameters",
              alignment: "left",
            },
          ],
        },

        {
          ul: [
            {
              fontSize: 9,
              decoration: "underline",
              text: "Measure Section",
              alignment: "left",
            },
          ],
        },
        {
          text: "     ",
        },
        {
          decoration: "underline",
          text: "Reporting Parameters",
          alignment: "left",
        },

        {
          ul: [
            {
              fontSize: 9,
              text: "Reporting Period :" + this.startdate + "-" + this.enddate,
              alignment: "left",
            },
          ],
        },
        {
          ul: [
            {
              fontSize: 9,
              text: "First Encounter :" + this.firstencounter,
              alignment: "left",
            },
          ],
        },
        {
          ul: [
            {
              fontSize: 9,
              text: "Last Encounter :" + this.lastencounter,
              alignment: "left",
            },
          ],
        },
        {
          text: "     ",
        },

        this.getMeasures(),
      ],
    };
    // pdfMake.createPdf(documenDefinition).open();
    pdfMake
      .createPdf(documenDefinition)
      .download(this.patientlistmeasure.ReportId + ".pdf");
  }

  constructor(
    private downloadservice: DownloadService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    protected http: HttpClient,
    private accountservice: Accountservice,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.getoverrallreport = new MatTableDataSource<CQMReportsData>();
    this.user = authenticationService.userValue;
    this.userLocationInfo = JSON.parse(this.user.LocationInfo);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngAfterViewInit(): void {
    // this.getoverrallreport.paginator = this.paginator.toArray()[0];
    this.getoverrallreport.sort = this.sort.toArray()[0];
  }

  ngOnInit() {
    this.createReport();
    this.patientlistapplyfilter();
    this.queuedreportapplyfilter();
    this.displayedRows$ = of(messages);
    this.getCQMReportsQueuedReports();
    this.getProviderList(this.providerid);
    this.getLocationsList("");
    this.getlocations();
  }
  getProviderList(i: any) {
    let locationid = localStorage.getItem("providerlocation");
    if (i == null || i == "") {
      var req = {
        "LocationId": locationid,
      }
      this.accountservice.getProviderList(req).subscribe((data) => {
        if (data.IsSuccess) {
          this.providerlist = data.ListResult;
          this.filteredproviderList = this.providerlist.slice();
          this.filteredproviders = this.providerlist;
          this.filteredproviders = JSON.parse(JSON.stringify(this.providerlist));
        }
      });
    }
    else if (i != null || i != "") {
      var req = {
        "LocationId": locationid,
      }
      //debugger;
      this.accountservice.getProviderList(req).subscribe((data) => {
        if (data.IsSuccess) {
          this.providerlist = data.ListResult;
          this.filteredproviderList = this.providerlist.slice();
          this.filteredproviders = this.providerlist.filter(a => a.Provider_Id === i);
          //this.filteredproviders = JSON.parse(JSON.stringify(this.providerlist));
        }
      });
    }
  }

  getLocationsList(ProviderId) {
    this.providerid = ProviderId;
    //debugger;
    this.accountservice.getLocationsList(this.providerid).subscribe(data => {
      if (data.IsSuccess) {
        this.locationslist = data.ListResult;
        this.filteredlocationList = this.locationslist.slice();
      }
      this.getProviderList(ProviderId);
    });
  }
  getlocations() {
    //var location = this.user.LocationName;
    //this.locationarray = location.split(',');
    //for (var i = 0; i < this.locationarray.length; i++) {
      //this.locationarray[i] = this.locationarray[i].replace(/^\s*/, "").replace(/\s*$/, "");
    //}

  }

  onViewResults(queuedReportData: any) {
    this.patientlistmeasure = queuedReportData;
    this.firstencounter = formatDate(
      this.patientlistmeasure.First_Encounter,
      "dd MMM yyyy",
      "en-US"
    );
    this.lastencounter = formatDate(
      this.patientlistmeasure.Last_Encounter,
      "dd MMM yyyy",
      "en-US"
    );
    this.startdate = formatDate(
      this.patientlistmeasure.StartDate,
      "MM/dd/yyyy",
      "en-US"
    );
    this.enddate = formatDate(
      this.patientlistmeasure.EndDate,
      "MM/dd/yyyy",
      "en-US"
    );
    this.isViewResults = true;
    this.showTopData = true;
    this.GetDashBoardReport(queuedReportData.ReportId);
    // this.getPatientList(queuedReportData.ReportId);
    this.detailsTab("dashBoard");
  }

  disableEndDateInCreateReport() {
    var StartDate =
      this.createReportForm.value.startDate == null
        ? ""
        : this.createReportForm.value.startDate;
    if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.disableEndDateInput = true;
    }
  }

  disableEndDateInQueuedReports() {
    var StartDate =
      this.queuedreportfilterForm.value.startDate == null
        ? ""
        : this.queuedreportfilterForm.value.startDate;
    if (StartDate != "") {
      this.disableEndDateInput = false;
    }
    else {
      this.disableEndDateInput = true;
    }
  }

  getMeasures() {
    if (this.getDetailsTabData.length == 0) {
      return null;
    } else {
      const msr = [];
      this.getDetailsTabData.forEach((element) => {
        msr.push(
          [
            {
              table: {
                widths: [100, 100, 70, 70, 70, 80],

                font: "sans-serif",
                body: [
                  [
                    {
                      text: "eMeasure Title",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                    {
                      text: "Version Neutral Identifier",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                    {
                      text: "eMeasure Version Number",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                    {
                      text: "NQF eMeasure Number",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                    {
                      text: "eMeasure Identifier (MAT)",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                    {
                      text: "Version Specific Identifier",
                      fillColor: "#41b6a6",
                      color: "white",
                    },
                  ],
                  [
                    {
                      text: element.eMeasure_Title,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                    {
                      text: element.Version_neutral_identifier,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                    {
                      text: element.eMeasure_Version_Number,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                    {
                      text: element.NQF_eMeasure_Number,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                    {
                      text: element.eMeasure_Identifier_MAT,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                    {
                      text: element.Version_specific_identifier,
                      fillColor: "#e5f8f5",
                      color: "black",
                    },
                  ],
                ],
              },
            },
            {
              text: "       ",
            },
            {
              fontSize: 11,
              text: " Member of Measure Set:",
            },
          ],

          {
            fontSize: 11,
            bold: true,


            ul: [
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Performance Rate 1 :" + element.Performance_Rate1, margin: [11, 2, 11, 2] }
                  : { text: "Performance Rate  :" + element.Performance_Rate1, margin: [11, 2, 11, 2] },
              ],
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Performance Rate 2 :" + element.Performance_Rate2, margin: [11, 2, 11, 2] }
                  : { text: "" },
              ],
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Performance Rate 3 :" + element.Performance_Rate3, margin: [11, 2, 11, 2] }
                  : { text: "" },
              ],
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Reporting Rate 1 :" + element.Reporting_Rate1, margin: [11, 2, 11, 2] }
                  : { text: "Reporting Rate  :" + element.Reporting_Rate1, margin: [11, 2, 11, 2] },
              ],
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Reporting Rate 2 :" + element.Reporting_Rate2, margin: [11, 2, 11, 2] }
                  : { text: "" },
              ],
              [
                element.eMeasure_Identifier_MAT === 138 ||
                  element.eMeasure_Identifier_MAT === 155
                  ? { text: "Reporting Rate 3 :" + element.Reporting_Rate3, margin: [11, 2, 11, 2] }
                  : { text: "" },
              ],

              this.getippcount(element.eMeasure_Identifier_MAT),
            ],
          }
        );
      });
      return {
        columns: [
          [
            {
              table: {
                widths: [100, 100, 70, 70, 70, 80],
                body: [
                  [
                    {
                      border: [false, false, false, false],
                      fillColor: "white",
                      decoration: "underline",
                      text: "Measure Section",
                      margin: [-5, 0],
                    },
                  ],
                ],
              },
            },
            msr,
          ],
        ],
      };
    }
  }

  getippcount(data) {
    if (this.getDetailsTabData.length == 0) {
      return null;
    } else {
      const ipp = [];
      this.getDetailsTabData2 = this.getDetailsTabData1.filter(
        (x) => x.MeasureIdentifier === parseInt(data)
      );

      this.getDetailsTabData2.forEach((element) => {
        ipp.push([
          {
            bold: true,
            fontSize: 11,
            ul: [
              element.ResultsFor == "IPP"
                ? [
                  {
                    text:
                      element.seq == 0
                        ? "Initial Patient Population :" +
                        element.ResultsForCount
                        : "Initial Patient Population " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                    alignment: 'left'
                  },
                  {
                    type: "circle",
                    fontSize: 11,
                    ul: [
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 1 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 2 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum3,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 4 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 5 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 6 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],

                      {
                        text: "Male :" + element.Male,
                      },
                      {
                        text: "Female :" + element.Female,
                      },
                      {
                        text:
                          "Not Hispanic or Latino :" + element.NotHispanic,
                      },
                      {
                        text: "Hispanic or Latino:" + element.Hispanic,
                      },
                      {
                        text: "Other Race:" + element.OtherRace,
                      },
                      {
                        text: "Payer - Other:" + element.PayerOther,
                      },
                    ],
                  },
                ]
                : [
                  {
                    text: "",
                  },
                ],
            ],
          },
          {
            fontSize: 11,
            bold: true,
            ul: [
              element.ResultsFor == "Denominator"
                ? [
                  {
                    text:
                      element.seq == 0
                        ? "Denominator :" + element.ResultsForCount
                        : "Denominator " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: "circle",
                    fontSize: 11,
                    ul: [
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 1 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 2 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum3,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 4 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 5 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 6 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],

                      {
                        text: "Male :" + element.Male,
                      },
                      {
                        text: "Female :" + element.Female,
                      },
                      {
                        text:
                          "Not Hispanic or Latino :" + element.NotHispanic,
                      },
                      {
                        text: "Hispanic or Latino:" + element.Hispanic,
                      },
                      {
                        text: "Other Race:" + element.OtherRace,
                      },
                      {
                        text: "Payer - Other:" + element.PayerOther,
                      },
                    ],
                  },
                ]
                : [
                  {
                    text: "",
                  },
                ],
            ],
          },
          {
            fontSize: 11,
            bold: true,
            ul: [
              element.ResultsFor == "DenException"
                ? [
                  {
                    text:
                      element.seq == 0
                        ? "Denominator Exception :" + element.ResultsForCount
                        : "Denominator Exception " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: "circle",
                    fontSize: 11,
                    ul: [
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 1 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 2 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum3,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 4 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 5 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 6 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],

                      {
                        text: "Male :" + element.Male,
                      },
                      {
                        text: "Female :" + element.Female,
                      },
                      {
                        text:
                          "Not Hispanic or Latino :" + element.NotHispanic,
                      },
                      {
                        text: "Hispanic or Latino:" + element.Hispanic,
                      },
                      {
                        text: "Other Race:" + element.OtherRace,
                      },
                      {
                        text: "Payer - Other:" + element.PayerOther,
                      },
                    ],
                  },
                ]
                : [
                  {
                    text: "",
                  },
                ],
            ],
          },

          {
            fontSize: 11,
            bold: true,
            ul: [
              element.ResultsFor == "DenExclusion"
                ? [
                  {
                    text:
                      element.seq == 0
                        ? "Denominator Exclusion :" + element.ResultsForCount
                        : "Denominator Exclusion " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: "circle",
                    fontSize: 11,
                    ul: [
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 1 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 2 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum3,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 4 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 5 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 6 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],

                      {
                        text: "Male :" + element.Male,
                      },
                      {
                        text: "Female :" + element.Female,
                      },
                      {
                        text:
                          "Not Hispanic or Latino :" + element.NotHispanic,
                      },
                      {
                        text: "Hispanic or Latino:" + element.Hispanic,
                      },
                      {
                        text: "Other Race:" + element.OtherRace,
                      },
                      {
                        text: "Payer - Other:" + element.PayerOther,
                      },
                    ],
                  },
                ]
                : [
                  {
                    text: "",
                  },
                ],
            ],
          },
          {
            fontSize: 11,
            bold: true,
            ul: [
              element.ResultsFor == "Numerator"
                ? [
                  {
                    text:
                      element.seq == 0
                        ? "Numerator :" + element.ResultsForCount
                        : "Numerator " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: "circle",
                    fontSize: 11,
                    ul: [
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 1 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74 ||
                          (element.MeasureIdentifier === 155 &&
                            element.seq === 1)
                          ? {
                            text:
                              "Reporting Stratum 2 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 74
                          ? {
                            text:
                              "Reporting Stratum 3 :" +
                              element.Reporting_Stratum3,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 2
                          ? {
                            text:
                              "Reporting Stratum 4 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 5 :" +
                              element.Reporting_Stratum1,
                          }
                          : { text: "" },
                      ],
                      [
                        element.MeasureIdentifier === 155 && element.seq === 3
                          ? {
                            text:
                              "Reporting Stratum 6 :" +
                              element.Reporting_Stratum2,
                          }
                          : { text: "" },
                      ],

                      {
                        text: "Male :" + element.Male,
                      },
                      {
                        text: "Female :" + element.Female,
                      },
                      {
                        text:
                          "Not Hispanic or Latino :" + element.NotHispanic,
                      },
                      {
                        text: "Hispanic or Latino:" + element.Hispanic,
                      },
                      {
                        text: "Other Race:" + element.OtherRace,
                      },
                      {
                        text: "Payer - Other:" + element.PayerOther,
                      },
                    ],
                  },
                ]
                : [
                  {
                    text: "",
                  },
                ],
            ],
          },
        ]);
      });
      return {
        columns: [
          [
            {
              table: {
                widths: [100, 100, 70, 70, 70, 80],
                body: [
                  [
                    {
                      border: [false, false, false, false],
                      fillColor: "white",
                      text: "",
                    },
                  ],
                ],
              },
            },
            ipp,
          ],
        ],
      };
    }
  }

  getDetails() {
    this.x = this.patientlistmeasure.MeasurementPeriod.split("-");

    this.y = this.patientlistmeasure.MeasuresList.split(",");
    var req = {
      SessionName: "Detail",
      ReportId: this.patientlistmeasure.ReportId,
      PatientId: this.patientlistmeasure.PatientId,
      LocationId: this.patientlistmeasure.PracticeID,
      ProviderId: this.patientlistmeasure.ProviderId,
      StartDate: this.x[0],
      EndDate: this.x[1],
    };
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      let mainData = data.ListResult[0];
      let childData = data.ListResult[1];
      // let main = mainData;
      for (let i = 0; i < mainData.length; i++) {
        const ele = mainData[i];
        ele.details1 = [];
        for (let index = 0; index < childData.length; index++) {
          const element = childData[index];
          if (
            ele.eMeasure_Identifier_MAT.toString() ===
            element.MeasureIdentifier.toString()
          ) {
            ele.details1.push(element);
          }
        }
      }
      this.getDetailsTabData = mainData;
      this.getDetailsTabData1 = childData;
    });
  }

  searchByLocationId(Location_Id) {
    if (Location_Id != "") {
      this.providerslocationwisefilter = this.providerslocationwise.filter(
        function (data) {
          return data.LocationId == Location_Id;
        }
      );
    }
  }

  getCQMReportsQueuedReports() {

    let locationid = localStorage.getItem("providerlocation");

    let obj = {
      practiceId: locationid,
    };
    // let obj = {
    //   PracticeId: "5b686dd7c832dd0c444f288a",
    // };
    this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
    this.accountservice.getCQMReportsQueuedReports(obj).subscribe((data) => {
      this.getoverrallreport.data = [];
      this.getoverrallreportlength = null;
      if (data.IsSuccess) {
        this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
        this.getoverrallreport.data = data.ListResult[0] as CQMReportsData[];
        this.queuedreportdata = JSON.parse(
          JSON.stringify(data.ListResult[0] as CQMReportsData[])
        );
        this.getoverrallreportlength = this.getoverrallreport.data.length;
        this.showQueuedReportsTable = true;
        for (var i of data.ListResult[0]) {
          this.measures = i.MeasuresList == '68,69,74,75,127,138,147,155,165' ? '68,69,74,75,127,138,147,155,165' : i.MeasuresList;
          break;
        }
      }
      this.customizedspinner = false; //$('body').removeClass('loadactive');
    });
  }

  endDateCalculationInQueuedReport(Days) {
    this.startDate = this.queuedreportfilterForm.value.startDate;
    var d = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth() + Days,
      this.startDate.getDate() - 1
    );
    this.queuedreportfilterForm.controls["endDate"].setValue(d);
  }

  GetDashBoardReport(ReportId) {
    var req = {
      SessionName: "Dashboard",
      ReportId: ReportId,
    };
    this.MeasureReportId = ReportId;
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      this.getDashBoardreport = data;
      //this.StratificationText=this.getDashBoardreport.StratificationText;
      this.getDashBoardreport = this.getDashBoardreport.ListResult;
    });
  }

  useFilterbtn() {
    if (this.showUseFilterForm == false) {
      this.showUseFilterForm = true;
    } else {
      this.showUseFilterForm = false;
    }
  }

  cstmPagination(size) {
    this.queuedreporttabfilter();
    this.getoverrallreport.data = this.getoverrallreport.data.slice(0, size);
  }

  queuedreportapplyfilter() {
    this.queuedreportfilterForm = this.fb.group({
      reportId: [""],
      description: [""],
      providerName: [""],
      locationName: [""],
      reportStatus: [""],
      startDate: [""],
      endDate: [""],
    });
  }

  queuedreporttabfilter() {
    if (this.queuedreportfilterForm.invalid) {
      return;
    }
    var PatientForm = {
      reportId:
        this.queuedreportfilterForm.value.reportId == null
          ? ""
          : this.queuedreportfilterForm.value.reportId,
      description:
        this.queuedreportfilterForm.value.description == null
          ? ""
          : this.queuedreportfilterForm.value.description,
      providerName:
        this.queuedreportfilterForm.value.providerName == null
          ? ""
          : this.queuedreportfilterForm.value.providerName,
      locationName:
        this.queuedreportfilterForm.value.locationName == null
          ? ""
          : this.queuedreportfilterForm.value.locationName,
      reportStatus:
        this.queuedreportfilterForm.value.reportStatus == null
          ? ""
          : this.queuedreportfilterForm.value.reportStatus,
      startDate: this.queuedreportfilterForm.value.startDate,
      endDate:
        this.queuedreportfilterForm.value.endDate == undefined
          ? ""
          : this.queuedreportfilterForm.value.endDate,
    };
    if (
      (PatientForm.reportId == "" || PatientForm.reportId == null) &&
      (PatientForm.description == "" || PatientForm.description == null) &&
      (PatientForm.providerName == "" || PatientForm.providerName == null) &&
      (PatientForm.locationName == "" || PatientForm.locationName == null) &&
      (PatientForm.reportStatus == "" || PatientForm.reportStatus == null) &&
      (PatientForm.startDate == "" || PatientForm.startDate == null) &&
      (PatientForm.endDate == "" || PatientForm.endDate == null)
    ) {
      this.getoverrallreport.data = this.queuedreportdata;
      this.getoverrallreportlength = this.getoverrallreport.data.length;
      this.showUseFilterForm = false;
      this.showClearFilterBtn = true;
    } else {
      this.getoverrallreport.data = this.queuedreportdata.filter(function (
        queuedreport
      ) {
        if (PatientForm.startDate == "") {
          var startDate = PatientForm.startDate;
        } else {
          startDate = formatDate(PatientForm.startDate, "MM-dd-yyyy", "en-US");
        }
        if (PatientForm.endDate == "") {
          var enDate = PatientForm.endDate;
        } else {
          enDate = formatDate(PatientForm.endDate, "MM-dd-yyyy", "en-US");
        }
        var StartDate = formatDate(
          queuedreport.StartDate,
          "MM-dd-yyyy",
          "en-US"
        );
        var EndDate = formatDate(queuedreport.EndDate, "MM-dd-yyyy", "en-US");
        return (
          queuedreport.ReportId == PatientForm.reportId ||
          queuedreport.Description == PatientForm.description ||
          queuedreport.ProviderName == PatientForm.providerName ||
          queuedreport.LocationName == PatientForm.locationName ||
          queuedreport.ReportStatus == PatientForm.reportStatus ||
          (StartDate == startDate && EndDate == enDate)
        );
      });
      this.getoverrallreportlength = this.getoverrallreport.data.length;
      this.showUseFilterForm = false;
      this.showClearFilterBtn = true;
    }
  }
  queuedreporttabfilterClear() {
    this.queuedreportfilterForm.reset();
    this.getoverrallreport.data = this.queuedreportdata;
    this.getoverrallreportlength = this.getoverrallreport.data.length;
    this.selected = "100";
    this.showUseFilterForm = false;
    this.showClearFilterBtn = false;
  }

  patientlistapplyfilter() {
    this.patientlistfilterForm = this.fb.group({
      lastName: [""],
      firstName: [""],
      patientId: [""],
    });
  }

  patientlisttabfilter() {
    if (this.patientlistfilterForm.invalid) {
      return;
    }
    var PatientForm = {
      firstName:
        this.patientlistfilterForm.value.firstName == null
          ? ""
          : this.patientlistfilterForm.value.firstName,
      lastName:
        this.patientlistfilterForm.value.lastName == null
          ? ""
          : this.patientlistfilterForm.value.lastName,
      patientId:
        this.patientlistfilterForm.value.patientId == null
          ? ""
          : this.patientlistfilterForm.value.patientId,
    };
    this.patientlistfilter = [];
    if (
      (PatientForm.lastName == "" || PatientForm.lastName == null) &&
      (PatientForm.firstName == "" || PatientForm.firstName == null) &&
      (PatientForm.patientId == "" || PatientForm.patientId == null)
    ) {
      this.patientlistfilter = this.getPatientListTabData;
    } else {
      this.patientlistfilter = this.getPatientListTabData.filter(function (
        data
      ) {
        var PatientName = data.Patient_Name.split(", ");
        return (
          PatientName[1].toLowerCase() == PatientForm.lastName.toLowerCase() ||
          PatientName[0].toLowerCase() == PatientForm.firstName.toLowerCase() ||
          data.PatientId.toLowerCase() == PatientForm.patientId.toLowerCase()
        );
      });
    }
  }

  patientlisttabfilterClear() {
    this.patientlistfilterForm.reset();
    this.patientlistfilter = this.getPatientListTabData;
  }

  getPatientList(MeasureSetId) {
    var req = {
      SessionName: "Patient List",
      ReportId: this.MeasureReportId,
      MeasureSetId: MeasureSetId,
    };
    this.MeasureSetId = MeasureSetId;
    this.getPatientListTabData = [];
    this.patientlistfilter = [];
    this.patientlistfilterlength = null;
    this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0)
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      if (data.IsSuccess) {
        this.getPatientListTabData = data;
        this.getPatientListTabData = this.getPatientListTabData.ListResult;
        this.patientlistfilter = this.getPatientListTabData;
        this.patientlistfilterlength = this.patientlistfilter.length;
        this.p = 1;
      }
      this.customizedspinner = false; //$('body').removeClass('loadactive');
    });
  }

  createreportt(location, loc) {
    (location.providerId = this.createReportForm.value.providerId),
      (loc.Location_Id = this.createReportForm.value.locationId),
      (loc.Measures = this.createReportForm.value.measureList);
  }

  getDrilldownList(PatientId, PracticeId) {
    var req = {
      SessionName: "Drilldown",
      PatientId: PatientId,
      LocationId: PracticeId,
    };
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      this.getDrilldownListTabData = data.ListResult[0];
      this.getDrilldownListTabData.data = data.ListResult as DrillPatient[];
      this.getDrilldownEncountersData = data.ListResult[1];
      this.getDrilldownListTabData1.data = data.ListResult[1] as DrillAuthor[];
      this.getDrilldownEncountersData.data =
        data.ListResult as DrillEncounters[];
    });
  }

  getCMSConditionsData(PatientId) {
    var req = {
      ReportId: this.MeasureReportId,
      MeasureSetId: this.MeasureSetId,
      PatientId: PatientId,
    };
    //this.MeasureIdentifier = this.MeasureIdentifier;
    this.measureidentifiler = this.MeasureIdentifier;
    this.DrilldownPatientData = [];
    this.ipp_conditions = [];
    this.deno_conditions = [];
    this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
    this.accountservice
      .getCQMReportsMeasurePatientMetInfo(req)
      .subscribe((cmscoditions_data) => {
        if (cmscoditions_data.IsSuccess) {
          this.DrilldownPatientData = cmscoditions_data.ListResult[0];

          this.customizedspinner = false;// $('body').removeClass('loadactive');
        } else {
          this.customizedspinner = false; //$('body').removeClass('loadactive');

        }

        if (
          this.measureidentifiler == "CMS 68" ||
          this.measureidentifiler == "CMS 69" ||
          this.measureidentifiler == "CMS 74" ||
          this.measureidentifiler == "CMS 75" ||
          this.measureidentifiler == "CMS 127" ||
          this.measureidentifiler == "CMS 147" ||
          this.measureidentifiler == "CMS 165"
        ) {
          this.ipp_conditions =
            this.DrilldownPatientData.IPPConditions != null
              ? JSON.parse(this.DrilldownPatientData.IPPConditions)
              : JSON.parse(this.ippconditions[this.measureidentifiler]);
          this.deno_conditions =
            this.DrilldownPatientData.DenConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenConditions)
              : JSON.parse(this.denconditions[this.measureidentifiler]);
          this.deno_exclu_conditions =
            this.DrilldownPatientData.DenExclusionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExclusionConditions)
              : JSON.parse(this.denexcluconditions[this.measureidentifiler]);
          this.num_conditions =
            this.DrilldownPatientData.NumeratorConditions != null
              ? JSON.parse(this.DrilldownPatientData.NumeratorConditions)
              : JSON.parse(this.numconditions[this.measureidentifiler]);
          this.deno_excep_conditions =
            this.DrilldownPatientData.DenExceptionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExceptionConditions)
              : JSON.parse(this.denexcepconditions[this.measureidentifiler]);
        } else if (this.measureidentifiler == "CMS 138") {
          this.ipp_conditions =
            this.DrilldownPatientData.IPPConditions != null
              ? JSON.parse(this.DrilldownPatientData.IPPConditions)
              : JSON.parse(this.ippconditions[this.measureidentifiler]);
          this.deno_conditions =
            this.DrilldownPatientData.DenConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenConditions)
              : JSON.parse(this.denconditions[this.measureidentifiler]);
          this.deno_exclu_conditions =
            this.DrilldownPatientData.DenExclusionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExclusionConditions)
              : JSON.parse(this.denexcluconditions[this.measureidentifiler]);
          this.num_conditions =
            this.DrilldownPatientData.NumeratorConditions != null
              ? JSON.parse(this.DrilldownPatientData.NumeratorConditions)
              : JSON.parse(
                this.numconditions.CMS138[this.populationdescription]
              );
          this.deno_excep_conditions =
            this.DrilldownPatientData.DenExceptionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExceptionConditions)
              : JSON.parse(
                this.denexcepconditions.CMS138[this.populationdescription]
              );
        } else if (this.measureidentifiler == "CMS 155") {
          this.ipp_conditions =
            this.DrilldownPatientData.IPPConditions != null
              ? JSON.parse(this.DrilldownPatientData.IPPConditions)
              : JSON.parse(this.ippconditions[this.measureidentifiler]);
          this.deno_conditions =
            this.DrilldownPatientData.DenConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenConditions)
              : JSON.parse(this.denconditions[this.measureidentifiler]);
          this.deno_exclu_conditions =
            this.DrilldownPatientData.DenExclusionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExclusionConditions)
              : JSON.parse(this.denexcluconditions[this.measureidentifiler]);
          this.deno_excep_conditions =
            this.DrilldownPatientData.DenExceptionConditions != null
              ? JSON.parse(this.DrilldownPatientData.DenExceptionConditions)
              : JSON.parse(this.denexcepconditions[this.measureidentifiler]);
          this.num_conditions =
            this.DrilldownPatientData.NumeratorConditions != null
              ? JSON.parse(this.DrilldownPatientData.NumeratorConditions)
              : JSON.parse(
                this.numconditions.CMS155[this.populationdescription]
              );
        }
      });
  }

  measureidentifiler: any = 68;
  ippconditions = {
    "CMS 68":
      '{"has_birthdate":0, "age_gt_18": 0, "encountered":1, "encounter_met_ondate":1 }',
    "CMS 69":
      '{"has_brithdate":1, "age_gt_18": 1, "encountered":0, "encounter_met_ondate":0}',
    "CMS 74":
      '{"has_brithdate":1, "age_lt_20":0, "office_visit":0, "established_office_visit":1, "encountered_preventive_init" :1, "initial_office_visit": 0, "service_established_office_visit":0, "service_initial_office_visit":0, "encounter_met_ondate":0 }',
    "CMS 75":
      '{"has_brithdate":1, "age_lt_20":0, "office_visit":0, "established_office_visit":1, "encountered_preventive_init" :1, "initial_office_visit": 0, "service_established_office_visit":0, "service_initial_office_visit":0, "encounter_met_ondate":0 }',
    "CMS 127":
      '{"has_brithdate":1, "age_gte_65":1, "office_visit":0, "annual_wellness":1, "established_office_visit":1, "initial_office_visit":0, "home_health_service":1, "care_service_long_term":0, "nursing_facility_visit":1, "Discharge_service_nursing":0, "encounter_met_ondate":0 }',
    "CMS 138":
      '{ "has_brithdate":1, "age_gte_18":1, "health_assessment_individual":1, "health_assessment_initial":0, "home_healthcare":0, "health_reassessment":1, "occupational_therapy":0, "office_visit":1, "ophthalmological_services":0, "psych_visit_diagnostic":1, "psych_visit_psychotherapy":0, "psychoanalysis":1, "speech_hearing":0, "annual_wellness":1, "established_office_visit":0, "established_office_visit":0, "group_counseling":0, "services_other":1, "services_individual":1, "services_initial":1,"encounter_met_ondate":1}',
    "CMS 147":
      '{"has_brithdate":1, "age_gte_6":1, "peritoneal_dialysis":1, "peritoneal_dialysis_met_ondate":0, "hemodialysis":1, "hemodialysis_met_ondate":0, "office_visit":1, "outpatient":0, "care_service":1, "health_care":1, "patient_interaction":0, "initial_office_0_to_17":1, "initial_office_0_to_18":0, "individual_Counselling":1, "group_counselling":0, "care_service":1, "nursing_facility":0, "facility_visit":1, "wellness_visit":0, "established_office_visit":0, "service_office_visit":1, "encounter_met_ondate":1 }',
    "CMS 155":
      '{ "has_brithdate":1, "age_bw_3to17":1 , "office_visit":0, "individual":0, "establishe_office_visit":1, "initial_office_visit":0, "group_counseling":0, "home_healthcare":1, "encounter_on_metdate":0}',
    "CMS 165":
      '{ "has_brithdate":1, "age_bw_18to85":1, "office_visit":0, "wellness_visit":0, "established_office_visit":0, "Initial_office_visit":0, "home_healthcare":0, "encounter_met_ondate":0, "diagnosis_hypertension":0, "diagnosis_hypertension_6_less_after_metondate":1, "diagnosis_hypertension_overlap_met_ondate":0}',
  };

  denconditions = {
    "CMS 68":
      '{"has_birthdate":0, "age_gt_18": 0, "encountered":1, "encounter_met_ondate":1 }',
    "CMS 69":
      '{"has_brithdate":1, "age_gt_18": 0, "encountered":0, "encounter_met_ondate":0}',
    "CMS 74":
      '{"has_brithdate":1, "age_lt_20":0, "office_visit":0, "established_office_visit":1, "encountered_preventive_init":1, "initial_office_visit": 0, "service_established_office_visit":0, "service_initial_office_visit":0, "encounter_met_ondate":0 }',
    "CMS 75":
      '{"has_brithdate":1, "age_lt_20":0, "office_visit":0, "established_office_visit":1, "encountered_preventive_init":1, "initial_office_visit":0, "service_established_office_visit":0, "service_initial_office_visit":0, "encounter_met_ondate":0 }',
    "CMS 127":
      '{"has_brithdate":1, "age_gte_65":1, "office_visit":0, "annual_wellness":1, "established_office_visit":1, "initial_office_visit":0, "home_health_service":1, "care_service_long_term":0, "nursing_facility_visit":1, "Discharge_service_nursing":0, "encounter_met_ondate":0 }',
    "CMS 138":
      '{"tobacco_user":0, "has_brithdate":1, "age_gte_18":1 ,"health_assessment_individual":1, "health_assessment_initial":0, "home_healthcare":0, "health_reassessment":1, "occupational_therapy":0, "office_visit":1, "ophthalmological_services": 0, "psych_visit_diagnostic":1, "psych_visit_psychotherapy": 0, "psychoanalysis": 1, "speech_hearing":0, "annual_wellness":1, "established_office_visit":0, "established_office_visit":0, "group_counseling":0, "services_other":1, "services_individual":1, "services_initial":1, "encounter_met_ondate":1}',
    "CMS 147":
      '{"peritoneal_dialysis":0, "hemodialysis":1, "Influenza":0, "Encounter_influeza_met_ondate":1, "Infleza_season":0, "has_brithdate":1, "age_gte_6":1, "peritoneal_dialysis":1, "peritoneal_dialysis_met_ondate":0, "hemodialysis":1, "hemodialysis_met_ondate":0, "office_visit":1, "outpatient":0, "care_service":1, "health_care":1, "patient_interaction":0, "initial_office_0_to_17":1, "initial_office_0_to_18":0, "individual_Counselling":1, "group_counselling":0, "care_service":1, "nursing_facility":0, "facility_visit":1, "wellness_visit":0, "established_office_visit":0, "service_office_visit":1, "encounter_met_ondate":1}',
    "CMS 155":
      '{ "has_brithdate":1, "age_bw_3to17":1 , "office_visit":0, "individual":0, "establishe_office_visit":1, "initial_office_visit":0, "group_counseling":0, "home_healthcare":1, "encounter_on_metdate":0}',
    "CMS 165":
      '{ "has_brithdate":1, "age_bw_18to85":1, "office_visit":0, "wellness_visit":0, "established_office_visit":0, "Initial_office_visit":0, "home_healthcare":0, "encounter_met_ondate":0, "diagnosis_hypertension":0, "diagnosis_hypertension_6_less_after_metondate":1, "diagnosis_hypertension_overlap_met_ondate":0}',
  };

  denexcluconditions = {
    "CMS 68": '{"":""}',
    "CMS 69":
      '{"palliative_care_order":1, "palliative_care_order_on_or_before":0, "palliative_care_encounter":0, "palliative_care_encounter_on_or_before":0, "physical_exam_performed":1, "no_bmi_refused": 0, "no_bmi_during_encountered":0, "pregnancy": 0, "pregnancy_overlaps_measuring_period": 0}',
    "CMS 74":
      '{"discharge_hospice":0, "home_hospice":1, "healthcare_facility":0, "hospice_order":1, "hospice_performed":1 }',
    "CMS 75":
      '{ "encounterd":0, "discharge_home_met_ondate":0, "discharge_healthcare_met_ondate":0, "interventioned_order":0, "interventioned_order_met_ondate":1, "interventioned_ambulatory":1, "interventioned_met_overlap_ondate":0}',
    "CMS 127":
      '{"encounterd":0, "discharge_home_met_ondate":0, "discharge_healthcare_met_ondate":0, "interventioned_order":0 , "interventioned_order_met_ondate":1, "interventioned_ambulatory":1, "interventioned_met_overlap_ondate":0 }',
    "CMS 138": '{"":""}',
    "CMS 147": '{"":""}',
    "CMS 155":
      '{ "diagnosis_pregnancy":0, "diagnosis_pregnancy_overlap_date":1, "encounter_inpatient":0, "encounter_inpatient_to_home":1, "encounter_inpatient_to_healthcare":0, "encounter_met_ondate":1, "intervention_order":1, "intervention_order_met_ondate":0, "intervention_performed":1, "intervention_met_ondate":0}',
    "CMS 165":
      '{ "esrd_services":0, "esrd_services_before_on_metdate":0, "access_for_dialysis":1, "access_for_dialysis_before_on_metdate":0, "kidney_transplant":0, "kidney_transplant_before_on_metdate":1, "dialysis_services":1, "dialysis_services_before_met_ondate":1, "diagnosis_pregnancy":0, "diagnosis_pregnancy_overlaps_ondate":0, "diagnosis_reneal":0, "diagnosis_reneal_overlaps_ondate":0, "kidney_transplant":0, "kidney_transplant_overlaps_ondate":0, "kidney_disease":1, "kidney_disease_overlaps_ondate":0, "encounter_inpatient":1, "encounter_inpatient_home_procedure":0, "encounter_inpatient_healthcare_procedure":0, "encounter_inpatient_on_metdate":0, "order_ambulatory":1, "order_ambulatory_on_metdate":0, "performed_ambulatory":0, "performed_ambulatory_overlaps_ondate":1}',
  };

  denexcepconditions = {
    "CMS 68":
      '{ "encountered":0, "encounter_met_ondate":0, "notperformed":0, "procedure_done":0 }',
    "CMS 69":
      '{ "nobmi":1, "nobmi_reason": 0, "nobmi_reason_met": 0, "highbmi_no_medication":0, "highbmi_medical_reason":0, "highbmi_reason_met":0, "highbmi_no_followup":0, "highbmi_no_followup_reason":0, "highbmi_no_followup_met":0, "lowbmi_no_medication":0, "lowbmi_medical_reason":0, "lowbmi_reason_met":0, "lowbmi_no_followup":0, "lowbmi_no_followup_reason":0, "lowbmi_no_followup_met":0, "noreferral":0, "noreferral_reason":0, "noreferral_reason_met":0}',
    "CMS 74": '{"nodata":1}',
    "CMS 75": '{"":""}',
    "CMS 127": '{"":""}',
    "CMS 147":
      '{ "Allergey_influenza_vaccine":0, "Allergey_influenza_vaccine_overlaps_metdate":0, "diagnosis_influenza_vaccine":0, "diagnosis_influenza_vaccine_overlaps_metdate":0, "egg_influenza_vaccine":1, "egg_influenza_vaccine_overlaps_metdate":1, "immunization_influenza_vaccine":0, "immunization_influen_vaccine_overlap_metdate":1, "procedure_influenza_vaccine":0, "procedure_influenza_vaccine_metdate":1, "communication_influenza_vaccine":0, "communication_influenza_vaccine_on_metdate":1}',
    "CMS 155": '{"":""}',
    "CMS 165": '{"":""}',
    CMS138: {
      "Population 1: Screened for tobacco use at least once within 24 mos":
        '{"tobacco_user":0, "diagnosis":0, "diagnosis_met_overlap_ondate":1, "assessment":0, "assessment_met_before_24mons":1, "assessment_medical_reason_met_in":0, "no_tobacco_cessation_counseling":0, "no_pharmacotherapy_ordered":0, "limited_life":0, "limited_life_overlaps_on_metdate":1, "medication_not_ordered":1, "medication_not_ordered_same_after_date":0, "medication_not_ordered":1, "medication_not_ordered_before_on_metdate":1, "medication_not_ordered_in_medical_reason":0, "intervention_tobacco_user":0, "intervention_tobacco_user_same_after_date":1, "intervention_tobacco_user_before_date":0, "intervention_tobacco_user_in_medical_reason":1, "assessment_tobacco_user":0, "assessment_tobacco_before_metdate":1, "assessment_tobacco_in_medical_reason":0 }',
      "Population 3: Screened for tobacco use at least once within 24 mos AND received cessation intervention if identified as a tobacco user":
        '{"tobacco_user":0, "diagnosis":0, "diagnosis_met_overlap_ondate":1, "assessment":0, "assessment_met_before_24mons":1, "assessment_medical_reason_met_in":0, "no_tobacco_cessation_counseling":0, "no_pharmacotherapy_ordered":0, "limited_life":0, "limited_life_overlaps_on_metdate":1, "medication_not_ordered":1, "medication_not_ordered_same_after_date":0, "medication_not_ordered":1, "medication_not_ordered_before_on_metdate":1, "medication_not_ordered_in_medical_reason":0, "intervention_tobacco_user":0, "intervention_tobacco_user_same_after_date":1, "intervention_tobacco_user_before_date":0, "intervention_tobacco_user_in_medical_reason":1, "assessment_tobacco_user":0, "assessment_tobacco_before_metdate":1, "assessment_tobacco_in_medical_reason":0 }',
      "Population 2: Received tobacco cessation intervention":
        '{"tobacco_user":0, "tobacco_nonuser":1, "tobacco_met_ondate": 1, "pharmacotherapy_cesation":1, "pharmacotherapy_ordered":0, "tobacco_cessation_counseling":0, "medication_active_tobacco":1, "medication_active_tobacco_met_ondate":1, "medication_active_tobacco_before_met_ondate":1, "medication_order_tobacco":0, "medication_order_tobacco_before_met_ondate":0, "intervention_tobacco":1, "intervention_tobacco_same_after_metdate":0, "intervention_tobacco_before_met_ondate":1, "assessment_tobacco":0, "assessment_tobacco_start_24mons_before":1, "tobacco_nonuser":0, "tobacco_nonuser_24monts_before_date":1, "tobacco_non_user":1, "tobacco_user":0, "diagnosis":0, "diagnosis_met_overlap_ondate":1, "assessment":0, "assessment_met_before_24mons":1, "assessment_medical_reason_met_in":0, "no_tobacco_cessation_counseling":0, "no_pharmacotherapy_ordered":0, "limited_life":0, "limited_life_overlaps_on_metdate":1, "medication_not_ordered":1, "medication_not_ordered_same_after_date":0, "medication_not_ordered":1, "medication_not_ordered_before_on_metdate":1, "medication_not_ordered_in_medical_reason":0, "intervention_tobacco_user":0, "intervention_tobacco_user_same_after_date":1, "intervention_tobacco_user_before_date":0, "intervention_tobacco_user_in_medical_reason":1, "assessment_tobacco_user":0, "assessment_tobacco_before_metdate":1, "assessment_tobacco_in_medical_reason":0 }',
    },
  };

  numconditions = {
    "CMS 68":
      '{ "encountered":0, "encounter_met_ondate":0, "performed":0, "procedure_done":0}',
    "CMS 69":
      '{ "physical_exam_performed":1, "has_last_bmi_in_encounted_period":0, "bmi_not_null":0, "bmi_normal":0, "bmi_high":1, "bmi_low": 0}',
    "CMS 74": '{ "fluoride_met":0, "fluoride_met_ondate":0 }',
    "CMS 75": '{ "Diagnosised":0, "Diagnosised_met_ondate":1 }',
    "CMS 127":
      '{"Immunization_vaccine":1, "Immunization_vaccine_met_ondate":0, "procedure_vaccine":1, "procedure_vaccine_met_ondate":0 }',
    "CMS 147":
      '{ "communication_influzeea_vaccine":0, "communication_influzeea_vaccine_on_metdate":1, "immunization_influzeea_vaccine":0, "immunization_influzeea_vaccine_met_ondate":1, "procedure_influzeea_vaccine":0, "procedure_influzeea_vaccine_met_ondate":1}',
    "CMS 165":
      '{ "systolic_blood_pressure":0, "systolic_blood_pressure_not_null":1, "systolic_blood_pressure_met_ondate":1, "dialstolic_blood_pressure":0, "dialstolic_blood_pressure_on_metdate":0, "essential_hypertension":1, "essential_hypertension_6m_less_after_ondate":0, "essential_hypertension_overlaps_on_metdate":0, "outpatientVisit":0, "hypertensionDiagnosis":1, "hypertensiondiagnosis_overlap_outpatientVisit_metdate":0, "diastolicBP":0, "outpatientVisit_overlaps_diastolicBP_metdate":0, "systolicBP":1, "outpatientVisit_overlaps_systolicBP_metdate":1, "visitwithBP":1, "has_systolic_blood_pressure_less_than_140":0, "has_diastolic_blood_pressure_less_than_90":1}',
    CMS155: {
      "Population 1: Height, weight, and body mass index (BMI) percentile documentation":
        '{"physical_exam_weight":0, "physical_exam_weight_met_ondate":0, "physical_exam_weight_not_null":0, "physical_exam_height":0, "physical_exam_height_met_ondate":0, "physical_exam_height_not_null":0, "physical_exam_percentile":0, "physical_exam_percentile_on_metdate":0, "physical_exam_percentile_not_null":0}',
      "Population 2: Counseling for nutrition":
        '{ "Intervention_nutrition":0, "Intervention_nutrition_on_metdate":0}',
      "Population 3: Counseling for physical activity":
        '{ "Intervention_physical_activity":0, "Intervention_physical_activity_on_metdate":0 }',
    },
    CMS138: {
      "Population 1: Screened for tobacco use at least once within 24 mos":
        '{"tobacco_user":0, "tobacco_nonuser":1, "tobacco_met_ondate": 1, "pharmacotherapy_cesation":1, "pharmacotherapy_ordered":0, "tobacco_cessation_counseling":0, "medication_active_tobacco":1, "medication_active_tobacco_met_ondate":1, "medication_active_tobacco_before_met_ondate":1, "medication_order_tobacco":0, "medication_order_tobacco_before_met_ondate":0, "intervention_tobacco":1, "intervention_tobacco_same_after_metdate":0, "intervention_tobacco_before_met_ondate":1, "assessment_tobacco":0, "assessment_tobacco_start_24mons_before":1, "tobacco_nonuser":0, "tobacco_nonuser_24monts_before_date":1, "tobacco_non_user":1 }',
      "Population 3: Screened for tobacco use at least once within 24 mos AND received cessation intervention if identified as a tobacco user":
        '{"tobacco_user":0, "tobacco_nonuser":1, "tobacco_met_ondate": 1, "pharmacotherapy_cesation":1, "pharmacotherapy_ordered":0, "tobacco_cessation_counseling":0, "medication_active_tobacco":1, "medication_active_tobacco_met_ondate":1, "medication_active_tobacco_before_met_ondate":1, "medication_order_tobacco":0, "medication_order_tobacco_before_met_ondate":0, "intervention_tobacco":1, "intervention_tobacco_same_after_metdate":0, "intervention_tobacco_before_met_ondate":1, "assessment_tobacco":0, "assessment_tobacco_start_24mons_before":1, "tobacco_nonuser":0, "tobacco_nonuser_24monts_before_date":1, "tobacco_non_user":1 }',
      "Population 2: Received tobacco cessation intervention":
        '{"tobacco_user":0, "tobacco_nonuser":1, "tobacco_met_ondate": 1, "pharmacotherapy_cesation":1, "pharmacotherapy_ordered":0, "tobacco_cessation_counseling":0, "medication_active_tobacco":1, "medication_active_tobacco_met_ondate":1, "medication_active_tobacco_before_met_ondate":1, "medication_order_tobacco":0, "medication_order_tobacco_before_met_ondate":0, "intervention_tobacco":1, "intervention_tobacco_same_after_metdate":0, "intervention_tobacco_before_met_ondate":1, "assessment_tobacco":0, "assessment_tobacco_start_24mons_before":1, "tobacco_nonuser":0, "tobacco_nonuser_24monts_before_date":1, "tobacco_non_user":1, "tobacco_user":0, "diagnosis":0, "diagnosis_met_overlap_ondate":1, "assessment":0, "assessment_met_before_24mons":1, "assessment_medical_reason_met_in":0, "no_tobacco_cessation_counseling":0, "no_pharmacotherapy_ordered":0, "limited_life":0, "limited_life_overlaps_on_metdate":1, "medication_not_ordered":1, "medication_not_ordered_same_after_date":0, "medication_not_ordered":1, "medication_not_ordered_before_on_metdate":1, "medication_not_ordered_in_medical_reason":0, "intervention_tobacco_user":0, "intervention_tobacco_user_same_after_date":1, "intervention_tobacco_user_before_date":0, "intervention_tobacco_user_in_medical_reason":1, "assessment_tobacco_user":0, "assessment_tobacco_before_metdate":1, "assessment_tobacco_in_medical_reason":0 }',
    },
  };

  createReport() {
    this.createReportForm = this.fb.group({
      description: ["", Validators.required],
      providerId: [""],
      locationId: [""],
      bundleYear: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      measureList: [""],
      ranByUserID: [""],
    });
  }

  matCheckbox(loc, location) {
    this.loc = loc;
    this.location = location;
  }

  onSubmitCreateReport() {
    //debugger;
    if (this.createReportForm.invalid) {
      return;
    }
    var Createreport = {
      description: this.createReportForm.value.description,
      providerId:
        this.createReportForm.value.providerId == "" ||
          this.createReportForm.value.providerId == null
          ? this.loc.Provider_Id
          : this.createReportForm.value.providerId,
      locationId:
        this.createReportForm.value.locationId == "" ||
          this.createReportForm.value.locationId == null
          ? this.userLocationInfo[0].locationId
          : this.createReportForm.value.locationId,
      bundleYear: this.createReportForm.value.bundleYear,
      startDate: formatDate(
        this.createReportForm.value.startDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      endDate: formatDate(
        this.createReportForm.value.endDate,
        "yyyy-MM-dd",
        "en-US"
      ),
      measureList: this.measures,
      ranByUserID:
        this.createReportForm.value.providerId == "" ||
          this.createReportForm.value.providerId == null
          ? this.loc.Provider_Id
          : this.createReportForm.value.providerId,
    };
    this.createupdateEmployee(Createreport);
  }

  createupdateEmployee(data: any) {
    //debugger;
    this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
    this.accountservice.CreateQueuedReport(data).subscribe((data) => {
      if (data.IsSuccess) {
        this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
        this.queuedreport();
        this.toastr.success("Report created successfully", "Success Message", {
          timeOut: 3000,
        });
      }
      this.customizedspinner = false; //$('body').removeClass('loadactive');
    });
  }

  CQMReports() {
    window.location.href = "cqmreports";
  }

  endDateCalculation(Days) {
    this.startDate = this.createReportForm.value.startDate;
    var d = new Date(
      this.startDate.getFullYear(),
      this.startDate.getMonth() + Days,
      this.startDate.getDate() - 1
    );
    this.createReportForm.controls["endDate"].setValue(d);
  }

  createreport() {
    this.customizedspinner = true; //$('body').addClass('loadactive').scrollTop(0);
    this.ViewResults = false;
    this.cqmcreatereport = true;
    this.showClearFilterBtn = false;
    this.GetProvidersLocationwise();
  }

  queuedreport() {
    this.isViewResults = false;
    this.ViewResults = true;
    this.ViewResults = true;
    this.cqmcreatereport = false;
    this.getCQMReportsQueuedReports();
    this.createReportForm.reset();
    this.queuedreportfilterForm.reset();
    this.showUseFilterForm = false;
    this.selected = "100";
    this.getLocationsList("");
    this.showClearFilterBtn = false;
    this.disableEndDateInput = true;
  }

  showPatientListTab(details) {
    this.patientlistdata = details;
    //var populationdescription = details.PopulationDescription;
    this.populationdescription = details.PopulationDescription;
    this.stratificationText = details.StratificationText;
    this.MeasureIdentifier = details.MeasureIdentifier;
    this.showTopData = false;
    this.showPatientList = true;
    this.tabId = "patientList";
    this.getPatientList(details.MeasureSetId);
    this.patientlistfilterForm.reset();
  }

  showDrilldownTab(i, PatientId, PracticeId) {
    this.patientinfo = i;
    this.showTopData = false;
    this.showDrilldown = true;
    this.tabId = "drilldown";
    this.getDrilldownList(PatientId, PracticeId);
    this.getCMSConditionsData(PatientId);
    // this.drilldownConditions();
    this.drilldownViewConditions(PatientId);
  }

  // drilldownConditions() {
  //   this.conditions = [
  //     {
  //       section: "Initial Patient Population:",
  //       conditions: [
  //         {
  //           title: '[1] define "Initial Population":',
  //           groupindex: 1,
  //           tabindex: 1,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[0] Qualifying Encounters During Measurement Period" QualifyingEncounter',
  //           groupIndex: 1,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] where "Patient Age 18 or Older at Start of Measurement Period"',
  //           groupIndex: 1,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] define "Patient Age 18 or Older at Start of Measurement Period":',
  //           groupIndex: 2,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title: '[1] exists ["Patient Characteristic Birthdate"] BirthDate',
  //           groupIndex: 2,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] where Global."CalendarAgeInYearsAt"(BirthDate.birthDatetime, start of "Measurement Period")>= 18',
  //           groupIndex: 2,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] define "Qualifying Encounters During Measurement Period":',
  //           groupIndex: 3,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1] ["Encounter, Performed": "Medications Encounter Code Set"] QualifyingEncounter',
  //           groupIndex: 3,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] where QualifyingEncounter.relevantPeriod during "Measurement Period"',
  //           groupIndex: 3,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //       ],
  //     },

  //     {
  //       section: "Denominator:",
  //       conditions: [
  //         {
  //           title: '[1] define "Denominator":',
  //           groupIndex: 1,
  //           tabIndex: 1,
  //           newLine: 0,
  //         },
  //         {
  //           title: '[1] "Initial Population"',
  //           groupIndex: 1,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title: '[1] define "Initial Population":',
  //           groupIndex: 2,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1] "Qualifying Encounters During Measurement Period" QualifyingEncounter',
  //           groupIndex: 2,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1]  where "Patient Age 18 or Older at Start of Measurement Period"',
  //           groupIndex: 2,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1]  define "Patient Age 18 or Older at Start of Measurement Period":',
  //           groupIndex: 3,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title: '[1]  exists ["Patient Characteristic Birthdate"] BirthDate',
  //           groupIndex: 3,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1]  where Global."CalendarAgeInYearsAt"(BirthDate.birthDatetime, start of "Measurement Period")>= 18',
  //           groupIndex: 3,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1]  define "Qualifying Encounters During Measurement Period":',
  //           groupIndex: 4,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1]  ["Encounter, Performed": "Medications Encounter Code Set"] QualifyingEncounter',
  //           groupIndex: 4,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1]  where QualifyingEncounter.relevantPeriod during "Measurement Period"',
  //           groupIndex: 4,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //       ],
  //     },

  //     {
  //       section: "Numerator:",
  //       conditions: [
  //         {
  //           title: '[0]  define "Numerator":',
  //           groupIndex: 1,
  //           tabIndex: 1,
  //           newLine: 0,
  //         },
  //         {
  //           title: '[0]  "Medications Documented During Qualifying Encounter"',
  //           groupIndex: 1,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[0]  define "Medications Documented During Qualifying Encounter":',
  //           groupIndex: 2,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1]  "Qualifying Encounters During Measurement Period" QualifyingEncounterDuringMeasurementPeriod',
  //           groupIndex: 2,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[0]  with ["Procedure, Performed": "Documentation of current medications (procedure)"] MedicationsDocumented',
  //           groupIndex: 2,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             "such that MedicationsDocumented.relevantPeriod during QualifyingEncounterDuringMeasurementPeriod.relevantPeriod",
  //           groupIndex: 2,
  //           tabIndex: 4,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] define "Qualifying Encounters During Measurement Period":',
  //           groupIndex: 3,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1] ["Encounter, Performed": "Medications Encounter Code Set"] QualifyingEncounter',
  //           groupIndex: 3,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] where QualifyingEncounter.relevantPeriod during "Measurement Period"',
  //           groupIndex: 3,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //       ],
  //     },

  //     {
  //       section: "Denominator Exception:",
  //       conditions: [
  //         {
  //           title: '[0] define "Denominator Exceptions":',
  //           groupIndex: 1,
  //           tabIndex: 1,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] "Qualifying Encounters During Measurement Period" EncounterDuringMeasurementPeriod',
  //           groupIndex: 1,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[0] with "Medications Not Documented for Medical Reason" MedicationsNotDocumented',
  //           groupIndex: 1,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             "such that MedicationsNotDocumented.authorDatetime during EncounterDuringMeasurementPeriod.relevantPeriod",
  //           groupIndex: 1,
  //           tabIndex: 4,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[0] define "Medications Not Documented for Medical Reason":',
  //           groupIndex: 2,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[0] ["Procedure, Not Performed": "Documentation of current medications (procedure)"] NotPerformed',
  //           groupIndex: 2,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             'where NotPerformed.negationRationale in "Medical or Other reason not done"',
  //           groupIndex: 2,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] define "Qualifying Encounters During Measurement Period":',
  //           groupIndex: 3,
  //           tabIndex: 1,
  //           newLine: 1,
  //         },
  //         {
  //           title:
  //             '[1] ["Encounter, Performed": "Medications Encounter Code Set"] QualifyingEncounter',
  //           groupIndex: 3,
  //           tabIndex: 2,
  //           newLine: 0,
  //         },
  //         {
  //           title:
  //             '[1] where QualifyingEncounter.relevantPeriod during "Measurement Period"',
  //           groupIndex: 3,
  //           tabIndex: 3,
  //           newLine: 0,
  //         },
  //       ],
  //     },
  //   ];
  // }
  drilldownViewConditions(PatientId) {
    //debugger;
    var req = {
      // ReportId: this.MeasureReportId,
      // MeasureId: this.MeasureSetId,
      // PatientId: PatientId,
      // PopulationId: this.populationdescription,
      // Stratum: this.stratificationText
      // for Testing
      "ReportId": 44,
      "MeasureId": 68,
      "PatientId": "5c191704c832dd2f7910404b",
    };
    this.accountservice.DrilldownViewConditions(req).subscribe(data => {
      this.conditions = JSON.parse(data.Result);
    });
  }
  //   this.downloadservice.getDrilldownViewConditions(req);
  //   if (data.IsSuccess) {
  //     this.conditions = data.Result;
  //     }
  //  });

  toTop68() {
    document.getElementById("p68").scrollIntoView();
  }
  toTop69() {
    document.getElementById("p69").scrollIntoView();
  }
  toTop74() {
    document.getElementById("p74").scrollIntoView();
  }
  toTop75() {
    document.getElementById("p75").scrollIntoView();
  }
  toTop127() {
    document.getElementById("p127").scrollIntoView();
  }
  toTop138() {
    document.getElementById("p138").scrollIntoView();
  }
  toTop147() {
    document.getElementById("p147").scrollIntoView();
  }
  toTop155() {
    document.getElementById("p155").scrollIntoView();
  }
  toTop165() {
    document.getElementById("p165").scrollIntoView();
  }
  Measuresection() {
    document.getElementById("Measuresection").scrollIntoView();
  }
  ReportingParameters() {
    document.getElementById("ReportingParameters").scrollIntoView();
  }

  detailsTab(event) {
    if (event.nextId == "details") {
      this.showTopData = true;
      this.showPatientList = false;
      this.showDrilldown = false;
      this.tabId = "details";
      this.getDetails();
      // this.getdownloadQRDA3Report(this.patientlistmeasure.ReportId);
    } else if (event.nextId == "dashBoard") {
      this.showTopData = true;
      this.showPatientList = false;
      this.showDrilldown = false;
      this.tabId = "dashBoard";
    } else if (event.nextId == "summary") {
      this.showTopData = true;
      this.showPatientList = false;
      this.showDrilldown = false;
      this.tabId = "summary";
      this.getDetails();
    } else if (event.nextId == "patientList") {
      this.showTopData = false;
      this.showPatientList = true;
      this.showDrilldown = false;
      this.tabId = "patientList";
    } else if (event == "dashBoard") {
      this.showTopData = true;
      this.showPatientList = false;
      this.showDrilldown = false;
      this.tabId = "dashBoard";
    }
  }
  downloadpatient(PatientID) {
    var req = {
      ReportId: this.patientlistmeasure.ReportId,
      MeasureSetId: this.patientlistdata.MeasureSetId,
      PatientId: PatientID,
    };
    this.downloadservice.getdownloadPatientReport(req);
  }
  getdownloadQRDA3Report() {
    var req = {
      ReportId: this.patientlistmeasure.ReportId,
    };
    this.downloadservice.getdownloadQRDA3Report(req);
  }
  getdownloadQRDA3() {
    var req = {
      ReportId: this.patientlistmeasure.ReportId,
    };
    this.downloadservice.getdownloadQRDA3(req);
  }
  getdownloadQRDA3MIPSReport() {
    //debugger;
    var req = {
      ReportId: this.patientlistmeasure.ReportId,
    };
    this.downloadservice.getdownloadQRDA3MIPSReport(req);
  }
  getdownloadQRDA1Report() {
    var req = {
      ReportId: this.patientlistmeasure.ReportId,
      ProviderName: this.patientlistmeasure.ProviderName,
    };
    this.downloadservice.getdownloadQRDA1Report(req);
  }
  GetProvidersLocationwise() {
    // this.customizedspinner = true;
    this.accountservice.getProvidersLocationwise().subscribe((data) => {
      if (data.IsSuccess) {
        this.providerslocationwise = data.ListResult;
        this.providerslocationwisefilter = this.providerslocationwise;
        this.providerslocationwise1 = data.ListResult.Provider;
      }
      this.customizedspinner = false; //$('body').removeClass('loadactive');
    });
  }

  displayrow(row) {
    this.expandedElement = row;
    this.onGetJobPostingResponseExpand();
  }

  onGetJobPostingResponseExpand() {
    throw new Error("Method not implemented.");
  }
}

export const messages = [
  {
    id: "9becc4aff0234ce128bcc8639e59000a",
    result_metadata: {
      score: 1,
    },
    state: "0x00",
    description: [
      " M7 display {screen} shows a {payment} card with a red “X” through it",
      "M7 display {screen} shows card reader error symbol",
    ],
    state_ext: "0x00",
    doc: 2,
    device_type: "M7",
    c_s: [
      {
        possible_reason: " is gasket is misplaced",
        solution: [
          {
            text: " missing one. Finally activate the unit",
            subelement: [
              {
                text: "ssdfdfdgf",
                subelement: [
                  {
                    text: "fsdfsd",
                  },
                ],
              },
              {
                text: "hjhjfdf",
              },
            ],
          },
          {
            text: " smissing one. Finally activate the unit",
          },
        ],
      },
    ],
    error: "0x00",
    status: "in-error",
    extracted_metadata: {
      sha1: "b30d3442e858e75e3650ebf248ce08c53d29e157",
      filename: "test1.json",
      file_type: "json",
    },
    component: "cardreader",
  },
];
