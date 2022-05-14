import { element } from 'protractor';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

declare var $: any;

@Component({
  selector: 'auditlog-settings',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss']
})


export class AuditLogComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  pageSize: number = 4;
  page: number = 1;
  collectionSize = 0;

  displayedColumns = ['Date','Patient','LocationName','Provider',
  'DataType','Action','Details'];
  datasource: any;
  TotalItems: any;
  constructor() {
  }
  ngOnInit(): void {
this.getdata();
  }
  dataType: string[] = [
    "schedule",
    "chart",
    "profile",
    "Insurance",
    "Erx",
    "Labs & Imaging",
    "Dosespot",
    "setting",
    "patient Portal",
    "Rcopia"
  ];
  Action: string[] = [
    "Add",
    "Change",
    "Delete",
    "Query",
    "Print",
    "Copy",
    "View",
    "Download",
    "Transmit",

  ];
  public print() {
    window.print();
  }
  exportToCsv()
  {
    //debugger;
    let element=document.getElementById('table')
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
    console.log(this.table.nativeElement);



    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Audit.csv');

  }

auid:auditlog[]=[
  { Date:"2/4/2022",
  Patient:"test",
  LocationName:"hyd",
  Provider:"john",
  DataType:"labimaging",
  Action:"add",
  Details:"querylaborder for"},
  { Date:"3/5/2021",
  Patient:"demo",
  LocationName:"gun",
  Provider:"deer",
  DataType:"clinical",
  Action:"sub",
  Details:"laborder"}]
  getdata(){

    this.datasource=this.auid;
    this.TotalItems = this.datasource.length;
    console.log(this.datasource)

  }

}
export interface auditlog{
  Date:string,
  Patient:string,
  LocationName:string,
  Provider:string,
  DataType:string,
  Action:string,
  Details:string
}
