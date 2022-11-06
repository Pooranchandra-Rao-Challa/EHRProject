import { DownloadService } from './../../_services/download.service';
import { ImportFile } from 'src/app/_models/_admin/importfile';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-list-imported-data',
  templateUrl: './list-imported-data.component.html',
  styleUrls: ['./list-imported-data.component.scss']
})
export class ListImportedDataComponent implements OnInit {

  importFiles: ImportFile[];
  page: any = 1;
  pageSize: any = 20
  collectionSize: any = 10000;
  premiumData: any[] = [];
  constructor(private router: Router, private adminservice: AdminService,
    private downloadService: DownloadService) { }
  ngOnInit(): void {
    this.getImportPatient();
  }

  onSubmit(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name, edit: 'Edit default messages' } }
    );
  }
  getImportPatient() {
    this.adminservice.AdminImportedPatientEncounter().subscribe(resp => {
      if (resp.IsSuccess) {
        this.importFiles = resp.ListResult;
      } else
        this.importFiles = [];
    });
  }
  onPageChange(index) {
    this.importFiles = this.premiumData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    this.getImportPatient();
  }
  gotoImportPatientOrImportEncounter(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
    );
  }

  getDownloadUploadDataReport(ImportId) {
    let req = {
      Id: ImportId
    };
    this.downloadService.getDownloadData('DownloadUploadDataReport',req);
  }

}
