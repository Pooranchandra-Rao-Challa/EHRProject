import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BillingService } from 'src/app/_services/billing.service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-labs.imaging',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  @ViewChild('select') select: MatSelect;
  @ViewChild('TABLE') table: ElementRef;
  dataSource: any
  allSelected = false;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  user: User;
  serachdata: any;
  data: any;
  filtered: Object[]
  sampledata: any = [];
  startDate: string;
  enddate: string;


  constructor(private bs: BillingService, private authService: AuthenticationService, public datepipe: DatePipe) {
    this.user = authService.userValue;

  }
  ngOnInit(): void {


    this.getBillings();

  }
  displayedColumns = ['ProcDate', 'PatientName', 'BirthDate', 'PrimSubscriberID',
    'ProviderName', 'ProcCode', 'Description', 'Tooth', 'Surface', 'Procfees', 'PrimInsCompanyName',
    'SecInsCompanyName'];
  //get the billing details
  getBillings() {
    var reqparams = {

      // provider_Id: "5b686dd4c832dd0c444f271b",
      Provider_id: this.user.ProviderId,
      startDate: this.startDate,
      enddate: this.enddate
    }
    this.bs.BillingDetails(reqparams).subscribe(response => {

      this.dataSource = response.ListResult;
      this.sampledata = this.dataSource;

    })
  }

  //checkox with dropdown
  filterstatus: any[] = [
    { value: 'Treatment Plan', viewValue: 'Treatment Plan' },
    { value: 'Completed', viewValue: 'Completed' },
    { value: 'Existing/Current', viewValue: 'Existing/Current Prov' }
  ];
  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

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

  resetpage() {
    window.location.reload();
  }

}
