import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { User } from '../../_models';
import { Subject } from 'rxjs-compat';
declare var $: any;

@Component({
  selector: 'auditlog-settings',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.scss']
})

export class AuditLogComponent implements OnInit {
  @ViewChild('TABLE') table: ElementRef;
  pageSize: number = 10;
  page: number = 1;
  collectionSize: any = 5000;
  displayedColumns = ['Date', 'Patient', 'LocationName', 'Provider',
    'DataType', 'Action', 'Details'];
  mockHeaders = `Date,Patient,User,DataType,Action,Details`
  mockHeaders1 = `Name,Type,Value
    `
  TotalItems: any;
  user: User;
  startDate: string;
  enddate: string;
  auditLogList: any = [];
  ProviderId: string;
  loglist: any;
  SearchKey: '';
  mockCsvData: any = [];
  // mockHeaders = "";
  // mockHeaders = `'Date', 'Patient','User',
  // 'DataType', 'Action', 'Details'
  // `
  minDateToFinish = new Subject<string>()
  endDateForAuditLog;

  constructor(private authService: AuthenticationService, private settingservice: SettingsService) {
    this.user = authService.userValue;
    this.minDateToFinish.subscribe(a => {
      this.endDateForAuditLog = new Date(a);
    })
  }

  ngOnInit(): void {
    // this.getdata();
    this.getAuditLogList('');
  }

  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  getAuditLogList(event) {
    if (event == 'reset') {
      this.startDate = '';
      this.enddate = '';
      var reqparams = {
        ProviderId: this.user.ProviderId,
        // ProviderId: "5b686dd4c832dd0c444f271b",
        from: this.startDate,
        to: this.enddate
      }
    }
    else {
      var reqparams = {
        ProviderId: this.user.ProviderId,
        // ProviderId: "5b686dd4c832dd0c444f271b",
        from: this.startDate,
        to: this.enddate
      }
    }
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.settingservice.AuditLogs(reqparams).subscribe(reponse => {
      setTimeout(() => {
        this.customizedspinner = false;
        $('body').removeClass('loadactive')
      }, 2000);
      this.auditLogList = reponse.ListResult;
      this.loglist = this.auditLogList
    })
  }

  customizedspinner: boolean
  // auditloglistspinner() {
  //   this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
  //   setTimeout(() => {
  //     this.customizedspinner = false;
  //     $('body').removeClass('loadactive')
  //   }, 2500);
  // }
  dataType: string[] = [
    "Schedule",
    "Chart",
    "Profile",
    "Insurance",
    "Erx",
    "Labs & Imaging",
    "Dosespot",
    "Setting",
    "Patient Portal",
    "Rcopia",
    "Appointment"
  ];
  Action: string[] = [
    "Add",
    "Query",
    "Change",
    "Delete",
    "Print",
    "Copy",
    "View",
    "Download",
    "Transmit",

  ];
  public print() {
    window.print();
  }

  SearchDetails() {
    this.auditLogList = this.loglist.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
    }
  }

  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  fileTitle = 'Audit';
  download() {
    this.formatToCsvData()
    const exportedFilenmae = this.fileTitle + '.csv';

    const blob = new Blob([this.mockCsvData],
      { type: 'text/csv;charset=utf-8;' });
    {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  formatToCsvData() {
    let itemsFormatted = [];
    this.auditLogList.forEach((item) => {
      itemsFormatted.push({
        DATE: item.DATE,
        PatientName: item.PatientName,
        ProviderName: item.ProviderName,
        DataType: item.DataType,
        Action: item.Action,
        Detail: item.Detail,
      });
    });
    const jsonObject = JSON.stringify(itemsFormatted);
    const csv = this.convertToCSV(jsonObject);
    this.mockCsvData = this.mockHeaders + csv;
  }

}
