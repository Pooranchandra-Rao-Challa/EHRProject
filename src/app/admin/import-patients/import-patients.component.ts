import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Attachment } from './../../_models/_provider/LabandImage';
import { UploadService } from './../../_services/upload.file.service';
import { Component } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { IUploadProgress } from 'src/app/file.upload/file-upload.type';
import { HttpEventType } from '@angular/common/http';
import { ImportFile } from 'src/app/_models/_admin/importfile';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage'
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-patients',
  templateUrl: './import-patients.component.html',
  styleUrls: ['./import-patients.component.scss']
})
export class ImportPatientsComponent {
  importFiles: ImportFile[];
  ProviderList: Provider[] = [];
  filterredProviders: any;
  ProviderId: string = null;
  entityName: string = "patientImport"
  private uploadProgressSubject = new ReplaySubject<IUploadProgress>();
  uploadProgress$ = this.uploadProgressSubject.asObservable();

  private uploadInProgressSubject = new BehaviorSubject<boolean>(false);
  uploadInProgress$ = this.uploadInProgressSubject.asObservable();

  uploadInfo: Attachment;
  file: File;
  fileName:string;
  uploaded: boolean = false;

  constructor(private adminservice: AdminService,
    private authService: AuthenticationService,
    private alertMessage: AlertMessage,
    private uploadService: UploadService,
    private router: Router,
    private alertmsg: AlertMessage) { }

  ngOnInit(): void {
    this.GetProviderNameList();
  }
  GetProviderNameList() {
    this.adminservice.GetProviderList().subscribe(resp => {
      if (resp.IsSuccess) {
        let pros: Provider[] = resp.ListResult as Provider[]
        this.ProviderList = pros.filter((fn) =>
          fn.Status == true && fn.ClinicName != null && fn.ClinicName != ''
          && fn.Paid == true);
        this.filterredProviders = this.ProviderList.slice();
      }
    });
  }
  onFileSelected(event) {
    this.file = event.target.files[0];
  }

  updateImportData() {
    let importFile = new ImportFile()
    importFile.ProviderId = this.ProviderId
    importFile.Dateof = "patient";
    importFile.ImportId = this.uploadInfo.AttachmentId;
    importFile.FileName = this.uploadInfo.FileName;
    importFile.ImportedUserId = this.authService.userValue.UserId;
    importFile.FullFileName = this.uploadInfo.FullFileName;
    this.ProviderId = null;
    this.file = null;
    this.adminservice.ImportData(importFile).subscribe((resp) => {
      this.uploaded = true;
      if (resp.IsSuccess) {

      }
    })
  }

  upload() {
    if (this.file) {
      this.fileName = this.file.name;
      const formData = new FormData();
      formData.append("patientImport", this.file, this.fileName);
      this.uploadService.uploadFile(formData, this.entityName)
        .subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgressSubject.next({
                progressPercentage: Math.floor(
                  (event.loaded * 100) / event.total
                ),
                loaded: event.loaded,
                total: event.total,
              });
            }
            if (event.body) {
              this.uploadInfo = event.body as Attachment;
              this.updateImportData();
              this.getImportPatient();
              this.alertmsg.displayMessageDailogForAdmin(ERROR_CODES["M1UDIP001"]);
              this.router.navigate(['admin/importeddata'], { queryParams: { name: 'Import Data'} });
            }
            else {
              this.alertmsg.displayErrorDailog(ERROR_CODES["E1UDIP001"]);
            }
          },
          (error: any) => {
            this.uploadInProgressSubject.next(false);
          },
          () => this.uploadInProgressSubject.next(false)
        )
    }
  }

  get enableImport(): boolean {
    return this.ProviderId != null && this.ProviderId != "" && this.file != null;
  }
  BackToListImportData(name, url) {
    this.router.navigate(
      [url],
      { queryParams: { name: name } }
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
}

class Provider {
  ProviderId?: string;
  ClinicId?: string;
  ProviderName?: string;
  ClinicName?: string;
  Status?: boolean;
  Paid?: boolean;
}



