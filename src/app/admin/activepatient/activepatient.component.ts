import { Component, OnInit } from '@angular/core';
import { activepatient } from 'src/app/_models/Admin.ts/activepatietn';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-activepatient',
  templateUrl: './activepatient.component.html',
  styleUrls: ['./activepatient.component.scss']
})
export class ActivepatientComponent implements OnInit {
  activepatientDataSource: activepatient[];
  dataSource: activepatient[];
  pageSize: number = 50;
  page: number = 1;
  SearchKey = "";
  GetFilterList: any;
  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getactivepatientList();
  }

  getactivepatientList() {
    this.adminservice.GetAllActivePatientsList().subscribe(resp => {
      if (resp.IsSuccess) {
        this.activepatientDataSource = resp.ListResult;
        this.GetFilterList = this.activepatientDataSource;
      } else
        this.activepatientDataSource = [];
        this.activepatientDataSource
    });
  }

  SearchDetails() {
    debugger;
    this.activepatientDataSource=this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    debugger;
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null?'':item.toString().indexOf(this.SearchKey) > -1
    }
  }
  }
  

