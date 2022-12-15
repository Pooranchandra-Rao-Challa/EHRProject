import { DownloadService } from './../../_services/download.service';
import { saveAs } from 'file-saver';

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { EducationMaterial, PatientEducationInfomation, User } from '../../_models';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MedicalCode } from 'src/app/_models/codes';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { UPLOAD_URL } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { Attachment } from 'src/app/_models/_provider/LabandImage';

@Component({
  selector: 'patientednmaterial-settings',
  templateUrl: './patientednmaterial.component.html',
  styleUrls: ['./patientednmaterial.component.scss']
})
export class PatientEdnMaterialComponent implements OnInit {
  user: User;
  searchnow: boolean = true;
  patientmaterialfrom: FormGroup
  expandedchangecolor: boolean = false;
  codeSystemsForPatientEducation: string[] = ['SNOMED/ICD10', 'SNOMED/ICD10', 'CDT/CPT', 'Lonics', 'NDC', 'RxNorm'];
  EducationMaterials: EducationMaterial[] =[];
  patientEducationSearchList = new BehaviorSubject<EducationMaterial[]>([]);
  columnsToDisplay = ['action', 'name', 'weight', 'symbol', 'position'];
  patientEdMaterialSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "Delete"];
  Patientedmateriallist: any = [];
  educationMaterial: EducationMaterial = new EducationMaterial();
  indexExpanded: number = 0;
  valuedisable: boolean = false
  EntityName: string = "EdnMaterial"
  fileUploadUrl: string = ""
  fileTypes = ".jpg,.gif,.png,.pdf"
  fileSize: number = 20;
  EntityId: string;
  httpRequestParams = new HttpParams();

  constructor(private fb: FormBuilder, private settingservice: SettingsService,
    private authService: AuthenticationService, private alertmsg: AlertMessage,
    private downloadService: DownloadService) {
    this.user = authService.userValue;
    this.fileUploadUrl = UPLOAD_URL('api/upload/UploadSingleFile')

    this.httpRequestParams = this.httpRequestParams.append("EntityName", this.EntityName);
  }

  ngOnInit(): void {
    this.pageloadevent();
    this.getPatientedmateriallist();
  }

  getPatientedmateriallist() {
    var reqparams = {
      ClinicId: this.user.ClinicId
    }
    this.settingservice.EducationMaterials(reqparams).subscribe(response => {
      if (response.IsSuccess) {
        this.EducationMaterials = response.ListResult as EducationMaterial[];
        this.EducationMaterials.forEach(endmaterial =>{
          endmaterial.Attachments = JSON.parse(endmaterial.strAttachments);
        })
      } else this.EducationMaterials = []
    })
  }

  togglePanels(index: number) {
    this.indexExpanded = index == this.indexExpanded ? -1 : index;
    this.expandedchangecolor = false;
  }

  pageloadevent() {
    this.patientmaterialfrom = this.fb.group({
    })
  }

  get attachments() {
    return this.patientmaterialfrom.get('attachments') as FormArray
  }

  attachements() {
    this.attachments.push(
      this.newattachedfile());
  }

  newattachedfile() {
    return this.fb.group({
      file: "",
    });
  }

  removeattachemnt(i: number) {
    this.attachments.removeAt(i);
  }

  refershform() {
    this.patientmaterialfrom.reset();
    (this.patientmaterialfrom.controls['attachments'] as FormArray).clear();
  }

  optionChangedForPed(value: MedicalCode) {
    this.educationMaterial.Code = value.Code
    this.educationMaterial.CodeSystem = value.CodeSystem
    this.educationMaterial.Name = value.Description
    this.educationMaterial.CanDelete = false;
    return " ";
  }

  displayWithPatientEd(value: MedicalCode): string {
    if (!value) return "";
    return "";
  }

  removePatientEdM(value: EducationMaterial, index: number) {
    value.CanDelete = true;
    this.educationMaterial = new EducationMaterial();
  }

  resetDialog() {
    this.educationMaterial = new EducationMaterial();
    this.patientEducationSearchList = new BehaviorSubject<EducationMaterial[]>([]);
    this.getPatientedmateriallist();
  }

  createUpadateEducationMaterial() {
    let isAdd = this.educationMaterial.EducationalId == undefined;
    this.educationMaterial.ClinicId = this.user.ClinicId;
    this.settingservice.CreatePatientEducationMaterial(this.educationMaterial).subscribe((resp) => {
      this.resetDialog();
      if (resp.IsSuccess) {
        this.getPatientedmateriallist();
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2JPE001" : "M2JPE002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JPE001"]);
      }
    });
  }

  editEducationMaterial(item) {
    this.educationMaterial = item;
  }

  enableSavePEDN() {
    return !(this.educationMaterial.Code != null && this.educationMaterial.Code != ''
      && this.educationMaterial.CodeSystem != null && this.educationMaterial.CodeSystem != ''
      && this.educationMaterial.Name != null && this.educationMaterial.Name != ''
      && this.educationMaterial.ResourceNotes != null && this.educationMaterial.ResourceNotes != '')
  }

  ItemsModified(data) {
    this.educationMaterial.Attachments = data;
  }


  public UploadCompleted(data): any {
    if (data.event.body) {
      if (!this.educationMaterial.Attachments)
        this.educationMaterial.Attachments = [];
      this.educationMaterial.Attachments.push(data.event.body as Attachment);
    }
  }
  DeleteAttachment(attachment) {
    if(!attachment.EntityName) attachment.EntityName = this.EntityName;
    if (attachment) {
      this.educationMaterial.Attachments.filter(fn => fn.AttachmentId == attachment.AttachmentId)[0].IsDeleted = true;
      this.settingservice.DeleteAttachment(attachment).subscribe((resp) =>{
        if(resp.IsSuccess){
          this.alertmsg.displayMessageDailog(ERROR_CODES["2AD001"]);
          this.getPatientedmateriallist();
        }else{
          this.alertmsg.displayErrorDailog(ERROR_CODES["2EAD001"]);
        }
      })
    }
  }
  DownloadAttachment(attachment: Attachment){
    attachment.EntityName = this.EntityName;
    this.downloadService.DownloadAttachment(attachment);
  }

  get Attachments(): Attachment[] {
    if (!this.educationMaterial.Attachments) this.educationMaterial.Attachments = [];
    return this.educationMaterial.Attachments.filter(fn => !fn.IsDeleted);
  }
  ItemRemoved($event) {
    console.log($event);
  }
}

