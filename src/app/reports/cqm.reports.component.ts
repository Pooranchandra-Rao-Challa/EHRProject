
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ViewEncapsulation } from "@angular/core";
import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { Accountservice } from "../_services/account.service";
import { interval, Subscription } from "rxjs";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatSelect } from "@angular/material/select";
import { PageEvent } from "@angular/material/paginator";
//import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import * as jspdf from "jspdf";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";


export interface cqmreportsdata {
  Description: string;
  Measures: string;
  Measurement: string;
  Date: string;
  Type: string;
  Report: string;
  Action: string;
}
export interface Drillencounters {
  Date_Start: number;
  Date_Stop: number;
  code: string;
  Code_System_Name: string;
  Code_Description: string;
  Status: string;
}
export interface Drillpatient {
  Patient_FirstName: string;
  Patient_MiddleName: string;
  Patient_LastName: string;
  Patient_DoB: string;
  Patient_Gender: string;


}
export interface Drillauthor {

  Author_BusinessName: string;

  Author_BusinessPhone: string;

}


@Component({
  selector: "app-CQMReports",
  styleUrls: ["../app.component.scss", "./cqm.reports.component.scss"],
  templateUrl: "./cqm.reports.component.html",
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CQMReportsComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['Action', 'Date_Start', 'Date_Stop', 'code', 'Code_System_Name', 'Code_Description', 'Status'];
  columnsToDisplay1 = ['action', 'Patient_FirstName', 'Patient_MiddleName', 'Patient_LastName', 'Patient_DoB', 'Patient_Gender'];
  columnsToDisplay2 = ['actionn', 'Author_BusinessName', 'NameGiven', 'NameSuffix', 'Author_BusinessPhone'];
  // columnsToDisplay = [
  //   { head: 'Action',key: 'action'},
  //   { head: 'Date Start', key: 'Date_Start'},
  //   { head: 'Date_Stop', key: 'Date_Stop'},
  //   { head: 'Code', key: 'code'},
  //   { head: 'Code System Name', key: 'Code_System_Name'},
  //   { head: 'Code Description', key: 'Code_Description'},
  //   { head: 'Status', key: 'Status'}];
  public getDrilldownEncountersData = new MatTableDataSource<Drillencounters>();
  public getDrilldownListTabData = new MatTableDataSource<Drillpatient>();
  public getDrilldownListTabData1 = new MatTableDataSource<Drillauthor>();

  dataSource1: any;
  // columnsToDisplay = ['action', 'name', 'weight', 'symbol', 'position'];
  expandedElement: Drillencounters | null;
  expandedElement1: Drillpatient | null;
  expandedElement2: Drillauthor | null;

  fileUrl;
  selected = "100";
  p: any;
  datasource: any;
  createReportForm: FormGroup;
  patientlistfilterForm: FormGroup;
  queuedreportfilterForm: FormGroup;
  ipp68: any;
  Denominator68: any;
  ipp: any[] = [];
  subDetails: any;
  sample: any = [];
  isViewResults: boolean;
  ViewResults: boolean = true;
  customizedspinner: boolean = false;
  getbasicreport: any;
  getDashBoardreport: any;
  showQueuedReportsTable: boolean;
  panelOpenState: boolean = false;
  showPatientList: boolean = false;
  showDrilldown: boolean = false;
  showTopData: boolean;
  showUseFilterForm: boolean = false;
  showChooseFile: boolean = false;
  DisplayedColumns = [
    "Description",
    "Measures",
    "Measurement",
    "Date",
    "Type",
    "Report",
    "Action",
  ];
  DrilldownDisplayColumns = [
    "plus",
    "DateStart(Admission)",
    "DateStop(Discharge)",
    "Code",
    "CodeSystemName",
    "CodeDescription",
    "Status",
  ];
  length: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  providerlist: any;
  locationslist: any;
  filteredList: any;
  filteredList1: any;
  checksbtn: boolean = true;
  countsbtn: boolean = false;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  // @ViewChild('ctdTabset',{static:true}) ctdTabset;

  // @ViewChild(NgbTabset,{static:true})
  // private tabset: NgbTabset;
  public getoverrallreport = new MatTableDataSource<cqmreportsdata>();

  private updateSubscription: Subscription;
  router: any;
  getoverrallreportlength: any;
  cqmcreatereport: boolean;
  tabId: string;
  isLoggedIn: boolean;
  datasourceid: string;
  datasesssion: string;
  getPatientListTabData: any;
  ReportId: MatTableDataSource<cqmreportsdata>;



  getPatientListTabDatalength: any;
  showcheckcountbtn: boolean;
  getDrilldownListTabDatalength: any;
  getDrilldownEncountersDatalength: any;
  private messages;
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
  patientlistfilterlength: any;
  xml: any;
  qrdareport: any;
  queuedreportdata: any = [];
  // getDrilldownEncountersData: any;

  public downloadAsPDF() {
    debugger;

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
                { text: "", fillColor: "#e5f8f5", color: "black" },
              ],
            ],
          },
        },
        {
          text: "     "
        },

        {

          text: 'Table of Contents', alignment: 'left'
        },
        {
          ul: [{
            text: 'Reporting Parameters', alignment: 'left'
          }]
        },
        {
          ul: [{
            text: 'Measure section', alignment: 'left'
          }]
        },
        {
          ul: [{
            text:
              "Reporting period :" + this.patientlistmeasure.MeasurementPeriod,
            alignment: "left",
          }]
        },
        {
          ul: [{
            text: "First encounter :23 March 2018",
            alignment: "left",
          }]
        },
        {
          ul: [{
            text: "Last encounter :25 September 2021",
            alignment: "left",
          }]
        },

        this.getMeasures(),
      ],
    };
    //pdfMake.createPdf(documenDefinition).open();
    pdfMake
      .createPdf(documenDefinition)
      .download(
        this.patientlistmeasure.ReportId +
        this.patientlistmeasure.ProviderName +
        ".Pdf"
      );
  }

  constructor(
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    protected http: HttpClient,
    private accountservice: Accountservice,
    private fb: FormBuilder
  ) {
    this.getoverrallreport = new MatTableDataSource<cqmreportsdata>();
  }

  ngAfterViewInit(): void {
    this.getoverrallreport.paginator = this.paginator.toArray()[0];
    this.getoverrallreport.sort = this.sort.toArray()[0];
    // this.problemreportlist.paginator = this.paginator.toArray()[2];
    // this.problemreportlist.sort = this.sort.toArray()[2];
  }

  ngOnInit() {
    //this.getdownloadQRDA3Report('');
    this.GetProvidersLocationwise();
    this.createReport();
    this.patientlistapplyfilter();
    this.queuedreportapplyfilter();
    this.displayedRows$ = of(messages);
    this.GetReportByUserid();
    this.getProviderList("");
    this.getLocationsList("");
    //  this.bnIdle.startWatching(2).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //       localStorage.clear();
    //       window.location.href="/login";
    //         //window.location.href="/login";
    //           console.log('session expired');
    //   }
    // });
    //  this.updateSubscription = interval(1000).subscribe(
    //      (getoverrallreport) => { this.GetReportByUserid() });
  }

  onViewResults(lesson) {
    this.patientlistmeasure = lesson;
    // this.x = this.patientlistmeasure.MeasurementPeriod.split("-");
    // console.log(this.x[0]);
    // console.log(this.x[1]);
    // this.patientlistmeasure=this.getoverrallreport;
    // console.log('hi', this.patientlistmeasure)
    this.isViewResults = true;
    this.showTopData = true;
    // this.GetBasicReportInfo();
    this.GetdetailReport(lesson.ReportId);
    this.GetSubdetailReport(lesson.ReportId);


    //this.GetBasicReportInfo();
    this.GetBasicReportInfo(lesson.ReportId);
    this.GetDashBoardReport(lesson.ReportId);
    this.getPatientList(lesson.ReportId);
    this.getPatientList(lesson.ReportId);
    this.detailsTab("dashBoard");
  }
  GetdetailReport(getoverrallreport) {
    var obj = {
      reportID: getoverrallreport.lngID,
      PracticeName: getoverrallreport.PracticeName,
      bundle: getoverrallreport.Bundle,
    };
    this.accountservice.GetDetailsReport(obj).subscribe((data) => {
      this.datasource = data;
      this.datasource = this.datasource.ListResult;
      JSON.stringify(this.datasource);
      this.sample = this.datasource[0];
    });
  }

  GetSubdetailReport(getoverrallreport) {
    var obj = {
      reportID: getoverrallreport.lngID,
      PracticeName: getoverrallreport.PracticeName,
      bundle: getoverrallreport.Bundle,
    };
    // "reportID":getoverrallreport.lngID,
    // "practiceLocation":getoverrallreport.PracticeName,
    // "bundle":getoverrallreport.Bundle

    this.accountservice.GetSubDetailsReport(obj).subscribe((data) => {
      this.subDetails = data;
      this.subDetails = this.subDetails.ListResult;

      console.log(this.subDetails);
      //this.subDetails.filter(x=>x.MeasureCMSNumber == 68);
      //this.ipp = this.subDetails.filter(x => { x.MeasureCMSNumber == 68} );
      // this.ipp68 = this.subDetails.filter((x)=>( x.MeasureCMSNumber == 68 && x.MeasureSubItemName =='IPP'));
      // this.Denominator68 = this.subDetails.filter((x)=>( x.MeasureCMSNumber == 68 && x.MeasureSubItemName =='Denominator'));

      // for(var i=0;i<this.subDetails.length;i++){
      //   if(this.subDetails[i].MeasureCMSNumber == 68 && MeasureSubItemName='IPP'){
      //     this.ipp.push(this.subDetails[i]);
      //   }

      // }

      console.log(this.ipp68);
    });
  }
  getMeasures() {
    if (this.getDetailsTabData.length == 0) {
      return null;
    } else {
      console.log(this.getDetailsTabData);
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
                      text: "Version neutral identifier",
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
                      text: "Version specific identifier",
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
              text: "       "
            },
            {
              fontSize: 11,
              text: " Member of Measure Set:"
            },
          ],
          [
            {
              fontSize: 11,
              bold: true,
              ul: [
                element.eMeasure_Identifier_MAT === "155" ||
                  element.eMeasure_Identifier_MAT === "138"
                  ? [
                    {
                      text: "Performance Rate 1:" + element.Performance_Rate1,
                    },
                    {
                      text: "Performance Rate 2:" + element.Performance_Rate2,
                    },
                    {
                      text: "Performance Rate 3:" + element.Performance_Rate3,
                    },
                    {
                      text: "Reporting Rate 1:" + element.Reporting_Rate1,
                    },
                    {
                      text: "Reporting Rate 2:" + element.Reporting_Rate2,
                    },
                    {
                      text: "Reporting Rate 3:" + element.Reporting_Rate3,
                    },
                    this.getippcount(element.eMeasure_Identifier_MAT),
                  ]
                  : [

                    {

                      text: "Performance Rate 1:" + element.Performance_Rate1,
                    },
                    {
                      text: "Reporting Rate 1:" + element.Reporting_Rate1,
                    },
                    this.getippcount(element.eMeasure_Identifier_MAT),
                  ],
              ],
            },
          ]
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
                      text: "Measure Section",
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
      console.log(this.getDetailsTabData1);
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
                  },
                  {
                    type: 'circle',
                    fontSize: 11,
                    ul: [
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 1 :" + element.Reporting_Stratum1 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 2 :" + element.Reporting_Stratum2 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 2) ? { text: "Reporting Stratum 3 :" + element.Reporting_Stratum3 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 2 ? { text: "Reporting Stratum 4 :" + element.Reporting_Stratum4 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 5 :" + element.Reporting_Stratum5 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 6 :" + element.Reporting_Stratum6 } : { text: "" }],


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
                  }
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
                        ? "Denominator :" +
                        element.ResultsForCount
                        : "Denominator " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: 'circle',
                    fontSize: 11,
                    ul: [
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 1 :" + element.Reporting_Stratum1 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 2 :" + element.Reporting_Stratum2 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 2) ? { text: "Reporting Stratum 3 :" + element.Reporting_Stratum3 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 2 ? { text: "Reporting Stratum 4 :" + element.Reporting_Stratum4 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 5 :" + element.Reporting_Stratum5 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 6 :" + element.Reporting_Stratum6 } : { text: "" }],
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
                  }
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
                        ? "Denominator Exception :" +
                        element.ResultsForCount
                        : "Denominator Exception " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: 'circle',
                    fontSize: 11,
                    ul: [
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 1 :" + element.Reporting_Stratum1 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 2 :" + element.Reporting_Stratum2 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 2) ? { text: "Reporting Stratum 3 :" + element.Reporting_Stratum3 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 2 ? { text: "Reporting Stratum 4 :" + element.Reporting_Stratum4 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 5 :" + element.Reporting_Stratum5 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 6 :" + element.Reporting_Stratum6 } : { text: "" }],
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
                  }
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
                        ? "Denominator Exclusion :" +
                        element.ResultsForCount
                        : "Denominator Exclusion " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: 'circle',
                    fontSize: 11,
                    ul: [
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 1 :" + element.Reporting_Stratum1 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 2 :" + element.Reporting_Stratum2 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 2) ? { text: "Reporting Stratum 3 :" + element.Reporting_Stratum3 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 2 ? { text: "Reporting Stratum 4 :" + element.Reporting_Stratum4 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 5 :" + element.Reporting_Stratum5 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 6 :" + element.Reporting_Stratum6 } : { text: "" }],
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
                  }
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
                        ? "Numerator :" +
                        element.ResultsForCount
                        : "Numerator " +
                        element.seq +
                        ":" +
                        element.ResultsForCount,
                  },
                  {
                    type: 'circle',
                    fontSize: 11,
                    ul: [
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 1 :" + element.Reporting_Stratum1 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 1) ? { text: "Reporting Stratum 2 :" + element.Reporting_Stratum2 } : { text: "" }],
                      [element.MeasureIdentifier === 74 || (element.MeasureIdentifier === 155 && element.seq === 2) ? { text: "Reporting Stratum 3 :" + element.Reporting_Stratum3 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 2 ? { text: "Reporting Stratum 4 :" + element.Reporting_Stratum4 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 5 :" + element.Reporting_Stratum5 } : { text: "" }],
                      [element.MeasureIdentifier === 155 && element.seq === 3 ? { text: "Reporting Stratum 6 :" + element.Reporting_Stratum6 } : { text: "" }],
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
                  }
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

    console.log(this.patientlistmeasure);
    var req = {
      SessionName: "Detail",
      ReportId: this.patientlistmeasure.ReportId,
      PatientId: this.patientlistmeasure.PatientId,
      LocationId: this.patientlistmeasure.PracticeID,
      ProviderId: this.patientlistmeasure.ProviderId,
      // "ProviderId": "sample string 4",
      //   "LocationId": "sample string 5",
      StartDate: this.x[0],
      EndDate: this.x[1],
    };
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      //debugger;
      // this.getDetailsTabData=data;
      // this.getDetailsTabData=this.getDetailsTabData.ListResult[0];
      // this.getDetailsTabData1=this.getDetailsTabData.ListResult[1];
      // this.getPatientListTabDatalength= data.ListResult.length;
      //this.sample=this.datasource[0];

      // Data Get
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
      console.log("main", mainData);
      this.getDetailsTabData = mainData;
      this.getDetailsTabData1 = childData;
    });
  }
  GetBasicReportInfo(getoverrallreport) {
    //debugger;
    var req = {
      reportID: getoverrallreport.lngID,
      PracticeID: getoverrallreport.PracticeID,
    };
    this.accountservice.GetBasicReportInfo(req).subscribe((data) => {
      this.getbasicreport = data;
      this.getbasicreport = this.getbasicreport.ListResult;
    });
  }
  getProviderList(ProviderId: any) {
    this.accountservice.getProviderList(ProviderId).subscribe((data) => {
      if (data.IsSuccess) {
        this.providerlist = data.ListResult;
        this.filteredList = this.providerlist.slice();
      }
    });
  }
  getLocationsList(LocationId: any) {
    this.accountservice.getLocationsList(LocationId).subscribe((data) => {
      if (data.IsSuccess) {
        this.locationslist = data.ListResult;
        this.filteredList1 = this.locationslist.slice();
        if (LocationId != '') {
          this.providerslocationwisefilter = this.providerslocationwise.filter(function (data) {
            return data.Provider[0].ProviderId == LocationId;
          });
        }
      }
      else if (LocationId == 0) {
        this.providerslocationwisefilter = this.providerslocationwise;
        this.accountservice.getLocationsList("").subscribe((data) => {
          if (data.IsSuccess) {
            this.locationslist = data.ListResult;
            this.filteredList1 = this.locationslist.slice();
          }
        });
      }
    });
  }
  searchByLocationId(Location_Id) {
    if (Location_Id != '') {
      this.providerslocationwisefilter = this.providerslocationwise.filter(function (data) {
        return data.LocationId == Location_Id;
      });
    }
  }

  GetReportByUserid() {
    let obj = {
      SessionName: "Queued Reports"
    };
    this.customizedspinner = true;
    this.accountservice.getCQMReportsQueuedReports(obj).subscribe((data) => {
      this.getoverrallreport.data = [];
      this.getoverrallreportlength = 0;
      if (data.IsSuccess) {
        this.customizedspinner = true;
        this.getoverrallreport.data = data.ListResult as cqmreportsdata[];
        this.queuedreportdata = JSON.parse(JSON.stringify(data.ListResult as cqmreportsdata[]));
        this.getoverrallreportlength = data.ListResult.length;
        // console.log(this.getoverrallreport.data);
        this.showQueuedReportsTable = true;
        // this.getoverrallreport=this.getoverrallreport.ListResult as cqmreportsdata[];
        // this.sample=this.datasource[0];
        // this.problemreportlist.data = data.ListResult as ProblemData[];
        // this.problemreportlistlength=data.ListResult.length;
      }
      this.customizedspinner = false;
    });
  }

  endDateCalculationInQueuedReport(Days) {
    this.startDate = this.queuedreportfilterForm.value.startDate;
    var d = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + Days, this.startDate.getDate() - 1)
    this.queuedreportfilterForm.controls['endDate'].setValue(d);
  }

  //   getCQMReportsQueuedReports() {
  //     this.service.getCQMReportsQueuedReports('Queued Reports').subscribe(data => {
  //     if(data.IsSuccess){
  //       this.problemreportlist.data = data.ListResult as ProblemData[];
  //       this.problemreportlistlength=data.ListResult.length;
  //       this.showPromblemListTable=true;
  //     }
  //       this.customizedspinner = false;
  //   });
  // }

  GetDashBoardReport(getoverrallreport) {
    var req = {
      SessionName: "Dashboard",
      ReportId: getoverrallreport,
    };
    this.ReportId = this.getoverrallreport;
    this.MeasureReportId = getoverrallreport;
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      this.getDashBoardreport = data;
      this.getDashBoardreport = this.getDashBoardreport.ListResult;
      //this.sample=this.datasource[0];
    });
  }

  useFilterbtn() {
    if (this.showUseFilterForm == false) {
      this.showUseFilterForm = true;
    }
    else {
      this.showUseFilterForm = false;
    }
  }
  zipFolder(event) {
    if (event.checked == false) {
      this.showChooseFile = false;
    }
    else {
      this.showChooseFile = true;
    }
  }
  cstmPagination(size) {
    this.getoverrallreport.data = this.queuedreportdata.slice(0, size);
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
      reportId: this.queuedreportfilterForm.value.reportId == null ? "" : this.queuedreportfilterForm.value.reportId,
      description: this.queuedreportfilterForm.value.description == null ? "" : this.queuedreportfilterForm.value.description,
      providerName: this.queuedreportfilterForm.value.providerName == null ? "" : this.queuedreportfilterForm.value.providerName,
      locationName: this.queuedreportfilterForm.value.locationName == null ? "" : this.queuedreportfilterForm.value.locationName,
      reportStatus: this.queuedreportfilterForm.value.reportStatus == null ? "" : this.queuedreportfilterForm.value.reportStatus,
      startDate: this.queuedreportfilterForm.value.startDate,
      endDate: this.queuedreportfilterForm.value.endDate == undefined ? "" : this.queuedreportfilterForm.value.endDate,
      // startDate: formatDate(this.queuedreportfilterForm.value.startDate, 'yyyy-MM-dd','en-US')==null? '':this.queuedreportfilterForm.value.startDate,
      // endDate: formatDate(this.queuedreportfilterForm.value.endDate, 'yyyy-MM-dd','en-US')==null? '':this.queuedreportfilterForm.value.endDate,
    }
    if ((PatientForm.reportId == "" || PatientForm.reportId == null)
      && (PatientForm.description == "" || PatientForm.description == null)
      && (PatientForm.providerName == "" || PatientForm.providerName == null)
      && (PatientForm.locationName == "" || PatientForm.locationName == null)
      && (PatientForm.reportStatus == "" || PatientForm.reportStatus == null)
      && (PatientForm.startDate == "" || PatientForm.startDate == null)
      && (PatientForm.endDate == "" || PatientForm.endDate == null)) {
      // this.queuedreportdata = this.getoverrallreport.data;
      this.getoverrallreport = this.queuedreportdata;
      this.getoverrallreportlength = this.queuedreportdata.length;
    }
    else {
      this.getoverrallreport.data = this.queuedreportdata.filter(function (queuedreport) {

        if (PatientForm.startDate == "") {
          var startDate = PatientForm.startDate;
        }
        else {
          startDate = formatDate(PatientForm.startDate, 'MM-dd-yyyy', 'en-US');
        }
        if (PatientForm.endDate == "") {
          var enDate = PatientForm.endDate;
        }
        else {
          enDate = formatDate(PatientForm.endDate, 'MM-dd-yyyy', 'en-US');
        }
        var StartDate = formatDate(queuedreport.StartDate, 'MM-dd-yyyy', 'en-US');
        var EndDate = formatDate(queuedreport.EndDate, 'MM-dd-yyyy', 'en-US');
        // var commaseparator = hero.Patient_Name.split(', ');
        //   return commaseparator[1].toLowerCase() == PatientForm.reportId.toLowerCase() || commaseparator[0].toLowerCase() == PatientForm.description.toLowerCase() || hero.PatientId.toLowerCase() == PatientForm.providerName.toLowerCase();
        return queuedreport.ReportId == PatientForm.reportId || queuedreport.Description == PatientForm.description
          || queuedreport.ProviderName == PatientForm.providerName || queuedreport.LocationName == PatientForm.locationName
          || queuedreport.ReportStatus == PatientForm.reportStatus || (StartDate == startDate && EndDate == enDate);
      });
      debugger;
      this.getoverrallreportlength = this.getoverrallreport.data.length;
    }

  }
  queuedreporttabfilterClear() {
    this.queuedreportfilterForm.reset();
    this.getoverrallreport.data = this.queuedreportdata;
    this.getoverrallreportlength = this.getoverrallreport.data.length;
    this.selected = "100";
  }

  patientlistapplyfilter() {
    this.patientlistfilterForm = this.fb.group({
      lastName: [""],
      firstName: [""],
      patientId: [""]
    });
  }
  patientlisttabfilter() {
    if (this.patientlistfilterForm.invalid) {
      return;
    }
    var PatientForm = {
      firstName: this.patientlistfilterForm.value.firstName == null ? "" : this.patientlistfilterForm.value.firstName,
      lastName: this.patientlistfilterForm.value.lastName == null ? "" : this.patientlistfilterForm.value.lastName,
      patientId: this.patientlistfilterForm.value.patientId == null ? "" : this.patientlistfilterForm.value.patientId,
    }
    if ((PatientForm.lastName == "" || PatientForm.lastName == null) && (PatientForm.firstName == "" || PatientForm.firstName == null) && (PatientForm.patientId == "" || PatientForm.patientId == null)) {
      this.patientlistfilter = this.getPatientListTabData;
      this.patientlistfilterlength = this.patientlistfilter.length;
    }
    else {
      this.patientlistfilter = this.getPatientListTabData.filter(function (data) {
        var commaseparator = data.Patient_Name.split(', ');
        return commaseparator[1].toLowerCase() == PatientForm.lastName.toLowerCase() || commaseparator[0].toLowerCase() == PatientForm.firstName.toLowerCase() || data.PatientId.toLowerCase() == PatientForm.patientId.toLowerCase();
      });
      this.patientlistfilterlength = this.patientlistfilter.length;
    }
  }
  patientlisttabfilterClear() {
    this.patientlistfilterForm.reset();
    this.patientlistfilter = this.getPatientListTabData;
    this.patientlistfilterlength = this.patientlistfilter.length;
  }

  getPatientList(getoverrallreport) {
    var req = {
      SessionName: "Patient List",
      ReportId: this.MeasureReportId,
      MeasureSetId: getoverrallreport,
    };
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      this.getPatientListTabData = data;
      this.getPatientListTabData = this.getPatientListTabData.ListResult;
      this.patientlistfilter = this.getPatientListTabData; this.getoverrallreportlength = data.ListResult.length;
      this.patientlistfilterlength = this.patientlistfilter.length;

      // this.getPatientListTabDatalength= data.ListResult.length;

      //this.sample=this.datasource[0];
    });
  }
  createreportt(location, loc) {
    location.providerId = this.createReportForm.value.providerId,
      loc.Location_Id = this.createReportForm.value.locationId,
      loc.Measures = this.createReportForm.value.measureList


  }
  getDrilldownList(PatientId, PracticeId) {
    var req = {
      SessionName: "Drilldown",
      PatientId: PatientId,
      LocationId: PracticeId,
    };
    this.accountservice.getCQMReportsDashboard(req).subscribe((data) => {
      // this.getDrilldownListTabData=data;
      //debugger;
      this.getDrilldownListTabData = data.ListResult[0];
      this.getDrilldownListTabData.data = data.ListResult as Drillpatient[];

      this.getDrilldownListTabDatalength = data.ListResult[0].length;
      this.getDrilldownEncountersData = data.ListResult[1];
      this.getDrilldownListTabData1.data = data.ListResult[1] as Drillauthor[];
      this.getDrilldownEncountersData.data = data.ListResult as Drillencounters[];
      this.getDrilldownEncountersDatalength = data.ListResult[1].length;
      console.log(data);

      console.log("0", data.ListResult[0]);
      console.log("1", data.ListResult[1]);

      //this.sample=this.datasource[0];
    });
  }

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
    if (this.createReportForm.invalid) {
      return;
    }
    var Createreport = {
      description: this.createReportForm.value.description,
      providerId: (this.createReportForm.value.providerId == "" || this.createReportForm.value.providerId == null) ? this.loc.ProviderId : this.createReportForm.value.providerId,
      locationId: (this.createReportForm.value.locationId == "" || this.createReportForm.value.locationId == null) ? this.location.LocationId : this.createReportForm.value.locationId,
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
      // "measureList": this.createReportForm.value.measureList==true?this.measureList:null,
      // measureList: "68, 69, 74, 75, 127, 138, 147, 155, 165",
      measureList: this.loc.Measures,

      ranByUserID: (this.createReportForm.value.providerId == "" || this.createReportForm.value.providerId == null) ? this.loc.ProviderId : this.createReportForm.value.providerId,
    };

    this.createupdateEmployee(Createreport);
  }
  createupdateEmployee(data: any) {
    this.customizedspinner = true;
    this.accountservice.CreateQueuedReport(data).subscribe((data) => {
      if (data.IsSuccess) {
        this.customizedspinner = true;
        this.queuedreport();
        this.toastr.success('Report created successfully', 'Success Message', {
          timeOut: 3000,
        });
      }
      this.customizedspinner = false;
    });
  }
  CQMReports() {
    window.location.href = "cqmreports";
  }
  endDateCalculation(Days) {
    this.startDate = this.createReportForm.value.startDate;
    var d = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + Days, this.startDate.getDate() - 1)
    this.createReportForm.controls['endDate'].setValue(d);
  }
  createreport() {
    this.ViewResults = false;
    this.cqmcreatereport = true;
  }
  queuedreport() {
    this.isViewResults = false;
    this.ViewResults = true;
    this.ViewResults = true;
    this.cqmcreatereport = false;
    this.GetReportByUserid();
    this.createReportForm.reset();
    this.queuedreportfilterForm.reset();
    this.showUseFilterForm = false;
    this.selected = "100";
    this.getLocationsList(0);
  }

  showPatientListTab(details) {
    this.patientlistdata = details;

    // if (details.MeasureSetId == 1) {
    //   this.showcheckcountbtn = true;
    // } else {
    //   this.showcheckcountbtn = false;
    // }
    this.showTopData = false;
    this.showPatientList = true;
    //  patientList
    // this.ctdTabset.select('patientList');
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
  }
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
    //debugger;
    // this.check();
    if (event.nextId == "details") {
      this.showTopData = true;
      this.showPatientList = false;
      this.showDrilldown = false;
      this.tabId = "details";
      this.getDetails();
      this.getdownloadQRDA3Report(this.patientlistmeasure.ReportId);
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

    // else if (event.nextId == 'drilldown') {
    //   this.showTopData=false;
    //   this.showDrilldown=true;
    //   this.tabId = "drilldown";
    // }
  }
  //  dashboardTab(){
  //   this.showTopData=true;
  //   this.showPatientList=false;
  //   this.showDrilldown=false;
  // }
  // summaryTab(){
  //   this.showTopData=true;
  //   this.showPatientList=false;
  //   this.showDrilldown=false;
  // }
  getdownloadQRDA3Report(data1: any) {

    debugger;

    this.accountservice.getdownloadQRDA3Report(data1).subscribe((data) => {
      // this.xmlfile = res.Content;
      this.qrdareport = data.Response.Content;
      const data2 = this.qrdareport;
      const qrdapdf = new Blob([data2], { type: 'application/octet-stream' });

      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(qrdapdf));



    });

  }

  GetProvidersLocationwise() {
    //debugger;
    this.accountservice.getProvidersLocationwise().subscribe((data) => {
      console.log(data.ListResult);
      this.providerslocationwise = data.ListResult;
      this.providerslocationwisefilter = this.providerslocationwise;
      this.providerslocationwise1 = data.ListResult.Provider;
    });
  }

  displayrow(row) {
    this.expandedElement = row;
    this.onGetJobPostingResponseExpand();
  }
  onGetJobPostingResponseExpand() {
    throw new Error("Method not implemented.");
  }

  checks() {
    this.checksbtn = true;
    this.countsbtn = false;
  }
  counts() {
    this.countsbtn = true;
    this.checksbtn = false;
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
