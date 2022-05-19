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
import { disableDebugTools } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'auditlog-settings',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss']
})


export class AuditLogComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  pageSize: number = 50;
  page: number = 1;
  collectionSize:any = 5000;

  displayedColumns = ['Date','Patient','LocationName','Provider',
  'DataType','Action','Details'];

  TotalItems: any;
  user:User;
  startDate: string;
  enddate: string;
  auditLogList: any=[];
  ProviderId: string;
  constructor(private authService: AuthenticationService,private settingservice:SettingsService) {
    this.user = authService.userValue;
  
  }
  ngOnInit(): void {
// this.getdata();
    this.getAuditLogList('');
  }
  getAuditLogList(event)
  {
    if(event == 'reset')
    {
      this.startDate = '';
      this.enddate = '';
      debugger;
      var reqparams={
        ProviderId: this.user.ProviderId,
        // ProviderId: "5b686dd4c832dd0c444f271b",
        from:this.startDate,
        to: this.enddate
      }
    }
    else{
      var reqparams={
         ProviderId: this.user.ProviderId,
        // ProviderId: "5b686dd4c832dd0c444f271b",
        from:this.startDate,
        to:this.enddate
      }
    }
    this.settingservice.AuditLogs(reqparams).subscribe(reponse=>
      {
        this.auditLogList=reponse.ListResult;
        // this.TotalItems = this.auditLogList.length;
        console.log(this.auditLogList);
        
      })
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

}