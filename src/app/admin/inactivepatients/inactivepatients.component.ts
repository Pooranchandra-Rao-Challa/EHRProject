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
  pageSize:any=50
  page:any=1;
  searchKey = "";
  collectionSize:any=50000;
  premiumData : any[] = [];
  
  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getInactivepatientList();
    // this.collectionSize = this.inactivepatientDataSource.length;
  }
  getInactivepatientList() {
    debugger
    var data = {
      // Sort: '',
      // Direction: '',
      Active: true,
      NameFilter: this.searchKey,
      PageSize: this.pageSize,
      RecordIndex: this.page
    }
    this.adminservice.InActivePatients(data).subscribe(resp => {
      if (resp.IsSuccess) {
        this.inactivepatientDataSource = resp.ListResult;
       // this.collectionSize = resp.count;
      } else
        this.inactivepatientDataSource = [];
    });
  }

  onPageChange(index){
    debugger;
    this.inactivepatientDataSource =  this.premiumData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.getInactivepatientList();
  }
  }


