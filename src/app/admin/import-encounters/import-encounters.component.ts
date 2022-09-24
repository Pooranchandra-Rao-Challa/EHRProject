import { Component } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { PatientService } from 'src/app/_services/patient.service';
import { ProviderList } from 'src/app/_models/_admin/providerList';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { IUploadProgress } from 'src/app/file.upload/file-upload.type';
import { Attachment } from 'src/app/_models/_provider/LabandImage';
import { UploadService } from 'src/app/_services/upload.file.service';
import { HttpEventType } from '@angular/common/http';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ImportFile } from 'src/app/_models/_admin/importfile';

@Component({
  selector: 'app-import-encounters',
  templateUrl: './import-encounters.component.html',
  styleUrls: ['./import-encounters.component.scss']

})
export class ImportEncountersComponent {

  ProviderList: any = [];
  filterredProviders: any;
  providers: ProviderList = {} as ProviderList;
  entityName: string = "encounterImport"
  private uploadProgressSubject = new ReplaySubject<IUploadProgress>();
  uploadProgress$ = this.uploadProgressSubject.asObservable();

  private uploadInProgressSubject = new BehaviorSubject<boolean>(false);
  uploadInProgress$ = this.uploadInProgressSubject.asObservable();

  uploadInfo: Attachment;
  ProviderId: string;
  fileName:string;
  uploaded: boolean = false;

  constructor(private adminservice: AdminService,
    private authService: AuthenticationService,
    private uploadService: UploadService,) {
      this.providers = {} as ProviderList;
    }

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
        this.filterredProviders=this.ProviderList.slice();
      }
    });
  }
  updateImportData(){
    let importFile = new ImportFile()
    importFile.ProviderId = this.ProviderId
    importFile.Dateof = "encounter";
    importFile.ImportId = this.uploadInfo.AttachmentId;
    importFile.FileName = this.uploadInfo.FileName;
    importFile.ImportedUserId = this.authService.userValue.UserId;
    importFile.FullFileName = this.uploadInfo.FullFileName;
    this.file = null;
    this.ProviderId = "";
    this.adminservice.ImportData(importFile).subscribe((resp)=>{
      this.uploaded = true;
      if(resp.IsSuccess){

      }
    })
  }


  file: File;
  onFileSelected(event) {
    this.file = event.target.files[0];
  }

  upload() {
    if (this.file) {
      this.fileName = this.file.name;
      const formData = new FormData();
      formData.append("encounterImport", this.file, this.fileName);
      this.uploadService.uploadFile(formData,this.entityName)
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
            if(event.body){
              this.uploadInfo = event.body;
              this.updateImportData();
            }
          },
          (error: any) => {
            this.uploadInProgressSubject.next(false);
          },
          () => this.uploadInProgressSubject.next(false)
        )
    }
  }

  get enableImport():boolean{
    return this.ProviderId != null && this.ProviderId != "" && this.file != null;
  }
}
class Provider{
  //Status
  ProviderId?: string;
  ClinicId?: string;
  ProviderName?: string;
  ClinicName?:string;
  Status?: boolean;
  Paid?: boolean;
}
