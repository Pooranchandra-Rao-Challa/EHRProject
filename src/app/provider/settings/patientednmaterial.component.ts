import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { EducationMaterialCode, EncounterDiagnosis, EncounterInfo, PatientEducationInfomation, User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
import { MedicalCode } from 'src/app/_models/codes';
declare var $: any;

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
  codeSystemsForPatientEducation: string[] = ['SNOMED','ICD10'];
  patientEducationInfo: PatientEducationInfomation = new PatientEducationInfomation;
   patientEducationSearchList= new BehaviorSubject<EducationMaterialCode[]>([]);
  // columnsToDisplay = [ 'name', 'codeSystem', 'resouceNote', 'attachments'];
  columnsToDisplay = ['action', 'name', 'weight', 'symbol', 'position'];
  patientEdMaterialSearchColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION","Delete"];
  Patientedmateriallist: any = [];
  educationMaterialCode:EducationMaterialCode=new EducationMaterialCode();
 

 

  constructor(private fb: FormBuilder, private settingservice: SettingsService, private authService: AuthenticationService) {
    this.user = authService.userValue;

  }
  ngOnInit(): void {
    this.pageloadevent();
    this.getPatientedmateriallist();

   

  }
  getPatientedmateriallist() {
    var reqparams = {
      //  ClinicId: "588ba23dc1a4c002ab2b37ae"
      ClinicId: this.user.ClinicId
    }
    // debugger;
    this.settingservice.EducationMaterials(reqparams).subscribe(response => {
      // debugger;
      this.Patientedmateriallist = response.ListResult;
      // console.log(this.Patientedmateriallist);

    })
  }
  indexExpanded: number = 0;

  togglePanels(index: number) {
    //debugger;

    this.indexExpanded = index == this.indexExpanded ? -1 : index;

    this.expandedchangecolor = false;
    // console.log(this.indexExpanded );

  }
  pageloadevent() {
    this.patientmaterialfrom = this.fb.group({
  
      // codeSystem: [''],
      // resouceNote: [''],
      // attachments: this.fb.array([])
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

    })

  }
  codeSystemDD = [{ value: 'Snomed', viewValue: 'Snomed' }, { value: 'ICD10', viewValue: 'ICD10' },
  { value: 'CDT', viewValue: 'CDT' }, { value: 'LOINC', viewValue: 'LOINC' }, { value: 'NDC', viewValue: 'NDC' }, { value: 'RxNorm', viewValue: 'RxNorm' }]


  removeattachemnt(i: number) {

    this.attachments.removeAt(i);
  }
  refershform() {

    this.patientmaterialfrom.reset();
    (this.patientmaterialfrom.controls['attachments'] as FormArray).clear();

  }

  optionChangedForDiagnosis(value: MedicalCode) {
    debugger;
  //  this.educationMaterialCode= new EducationMaterialCode();
   this.educationMaterialCode.Code = value.Code
   this.educationMaterialCode.CodeSystem = value.CodeSystem
   this.educationMaterialCode.Description = value.Description
   this.educationMaterialCode.CanDelete = false;
    this.patientEducationInfo.EducationMat.push(this.educationMaterialCode);
    this.patientEducationSearchList.next(this.patientEducationInfo.EducationMat.filter(fn => fn.CanDelete === false));
  }


  removeEncounterDiagnosis(value: EducationMaterialCode, index: number) {
    value.CanDelete = true;
    this.patientEducationSearchList.next(this.patientEducationInfo.EducationMat.filter(fn => fn.CanDelete === false));
  }
  resetDialog() {
    this.educationMaterialCode = new EducationMaterialCode();
    this.educationMaterialCode.CanDelete=false;
  }
}

