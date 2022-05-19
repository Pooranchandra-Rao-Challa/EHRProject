import { ImportPatient } from './../../_models/_admin/importpatient';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-list-imported-data',
  templateUrl: './list-imported-data.component.html',
  styleUrls: ['./list-imported-data.component.scss']
})
export class ListImportedDataComponent implements OnInit {

  importpatient:ImportPatient[];
  page:any=1;
  pageSize:any=10
  collectionSize:any=10000;
  premiumData : any[] = [];

  constructor( private router: Router,private adminservice: AdminService) { }

  ngOnInit(): void {
    this.getImportPatient();
  }

  onSubmit(name,url){
    this.router.navigate(
      [url],
      { queryParams: { name: name,edit:'Edit default messages'} }
    );
    }
    getImportPatient () {
      this.adminservice.AdminImportedPatientEncounter().subscribe(resp => {
        if (resp.IsSuccess) {
          this.importpatient = resp.ListResult;
        } else
          this.importpatient = [];
      });
    }
    onPageChange(index){
      //debugger;
      this.importpatient =  this.premiumData
        .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      this.getImportPatient();
    }
}
