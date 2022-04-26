import { Component, OnInit } from '@angular/core';
import { inactivepatient } from 'src/app/_models/Admin.ts/inactivepatient';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-inactivepatients',
  templateUrl: './inactivepatients.component.html',
  styleUrls: ['./inactivepatients.component.scss']
})
export class InActivePatientsComponent implements OnInit {

  inactivepatientDataSource: inactivepatient[];
  dataSource: inactivepatient[];
  pageSize: number = 10;
  page: number = 1;
  GetFilterList: any;
  SearchKey = "";

  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getInactivepatientList();
  }
  getInactivepatientList() {
    this.adminservice.InActivePatients().subscribe(resp => {
      if (resp.IsSuccess) {
        this.inactivepatientDataSource = resp.ListResult;
        this.GetFilterList = this.inactivepatientDataSource;
      } else
        this.inactivepatientDataSource = [];
        // this.inactivepatientDataSource
    });
  }


  SearchDetails() {
    this.inactivepatientDataSource=this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null?'':item.toString().indexOf(this.SearchKey) > -1
    }
  }
  }


