import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/_models/_admin/patient';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-activepatients',
  templateUrl: './activepatients.component.html',
  styleUrls: ['./activepatients.component.scss']
})
export class ActivePatientsComponent implements OnInit {

  activepatientDataSource: Patient[];
  pageSize:number=10;
  // recordIndex:any=0;
  SearchKey = "";
  collectionSize:any=5000;
  page: number = 1;
  premiumData : any[] = [];
  constructor(private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getactivepatientList();
  }

  getactivepatientList() {
    debugger
    var data = {
      // Sort: '',
      // Direction: '',
      Active: true,
      NameFilter: this.SearchKey,
      PageSize: this.pageSize,
      RecordIndex: this.page
    }

    this.adminservice.ActivePatients(data).subscribe(resp => {

      if (resp.IsSuccess) {
        this.activepatientDataSource = resp.ListResult;
        console.log(JSON.stringify(this.activepatientDataSource));
      } else{
        this.activepatientDataSource = [];
      }
    });
  }
  onPageChange(index){
    debugger;
    this.activepatientDataSource =  this.premiumData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.getactivepatientList();
  }
}


