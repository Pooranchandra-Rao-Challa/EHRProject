import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BillingService } from 'src/app/_services/billing.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { Observable, fromEvent, of } from 'rxjs';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { PatientSearchResults, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  @ViewChild('select') select: MatSelect;
  @ViewChild('TABLE') table: ElementRef;
  bills: any[] = [];
  allSelected = false;
  user: User;
  filterData: SearchItems = {}

  displayedColumns = ['BillId','ProcDate', 'PatientName', 'BirthDate', 'SubscriberID',
    'ProviderName', 'CompanyName','Total Fee'];
  //checkox with dropdown
  filterstatus: any[] = [
    { value: 'Treatment Plan', Text: 'Treatment Plan' },
    { value: 'Completed', Text: 'Completed' },
    { value: 'Existing/Current', Text: 'Existing/Current Prov' }
  ];
  filteredPatients: Observable<PatientSearchResults[]>;
  @ViewChild('filterpatients', { static: true }) serachPatients: ElementRef;
  isLoading: boolean = false;

  constructor(private bs: BillingService,private patientService: PatientService, private authService: AuthenticationService, public datepipe: DatePipe) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.filterData.ClinicId = this.user.ClinicId;
    this.getBills();
    if (this.serachPatients != null)

    fromEvent(this.serachPatients.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        return event.target.value;
      })
      // if character length greater then 2
      , filter(res => res.length > 1 && res.length < 6)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatients(value));
  }


  _filterPatients(term) {
    this.isLoading = true;
    this.patientService.PatientSearch({
        ClinicId: this.user.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearchResults[]);
        } else this.filteredPatients = of([]);
      })
  }


  //get the billing details
  getBills() {
    console.log(this.filterData);
    if(this.filterData.FormDate != null)
    this.filterData.strFromDate =  this.datepipe.transform(this.filterData.FormDate,"MM/dd/yyyy");
    if(this.filterData.ToDate != null)
    this.filterData.strToDate =  this.datepipe.transform(this.filterData.ToDate,"MM/dd/yyyy");
    if(this.filterData.Status)
    this.filterData.Statuses = this.filterData.Status.join(',');
    this.bs.BillingDetails(this.filterData).subscribe(resp => {
      console.log(this.bills);
      console.log(resp);

      if(resp.IsSuccess){
        this.bills = resp.ListResult;
      }else this.bills = [];
    });
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }

  // optionClick() {
  //   let newStatus = true;
  //   this.select.options.forEach((item: MatOption) => {
  //     if (!item.selected) {
  //       newStatus = false;
  //     }
  //   });
  //   this.allSelected = newStatus;
  // }

  //exporting the csv file
  exportToCsv() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'Billing.csv');
  }

  exportToPdf() {
    var doc = new jsPDF("p", "mm", "a2")
    autoTable(doc.text('Billing Report', 170, 11),
      {
        html: '#my-table',
        styles: { cellWidth: 30, cellPadding: 2, lineWidth: 0.1, lineColor: 0, fontSize: 15 },
        headStyles: { fillColor: '#dedede', textColor: 'black', minCellHeight: 20, minCellWidth: 95, cellPadding: 3 },
        // margin: { top: 15},
      })
    doc.save('Billing.pdf')
  }

  resetFilter() {
    this.filterData.FormDate = null;
    this.filterData.ToDate = null;
    this.filterData.patientId = null;
    this.filterData.Status = null;
    this.getBills();
  }

  billView(bill: any){

  }

}

export class SearchItems{
  patientId?: string;
  FormDate?: Date;
  strFromDate?: string;
  ToDate?: Date;
  strToDate?: string;
  Status?: string[];
  ClinicId?:string;
  Statuses?: string;
}
