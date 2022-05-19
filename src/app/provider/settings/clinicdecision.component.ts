import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { UtilityService } from '../../_services/utiltiy.service';
import { User, UserLocations } from '../../_models';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'clinicdecision-settings',
  templateUrl: './clinicdecision.component.html',
  styleUrls: ['./clinicdecision.component.scss']
})
export class ClinicDecisionComponent implements OnInit {
  clinicalDecisionSupportList:any=[];
  user: User;
  multi: boolean = false;
  disabled: boolean = false;
  checkedName: boolean;
  uncheckedName:boolean;
  checkedDescription:boolean;
  uncheckedDescription:boolean;
  checkedResolution:boolean;
  unCheckedResolution:boolean
  checkedbiBliography:boolean;
  unCheckedBibliography:boolean;
  checkedDeveloper:boolean;
  unCheckedDeveloper:boolean;
  checkedfundingSource:boolean;
  unCheckedfundingSource:boolean;
  checkedReleaseDate:boolean;
  unCheckedReleaseDate:boolean;
  AddNewAlert: boolean = true;
  show: boolean = true;
  showon: boolean = true;
  showoff: boolean = false;
  decisionSuppotForm: FormGroup;

  TriggerRuleDD: any[] = [
    { value: 'ONE', viewValue: 'ONE' },
    { value: 'ONE of each category', viewValue: 'ONE of each category' },
    { value: 'Two or More', viewValue: 'Two or More' },
    { value: 'All', viewValue: 'All' },
  ];
  codeSystemDD=[{ value:'Snomed',viewValue: 'Snomed'},{value:'Local',viewValue:'Local'},{value:'ICD10',viewValue:'ICD10'}]
  constructor(private fb: FormBuilder,private authService: AuthenticationService,private settingservice:SettingsService) {
    this.user = authService.userValue;
  }
  ngOnInit(): void {
    this.decisionsupport();
this.getclinicaldesupportlist();
  }

  decisionsupport() {
    this.decisionSuppotForm = this.fb.group({
      alertName: [''],
      description: [''],
      resolution: [''],
      bibliography: [''],
      developer: [''],
      fundingSource: [''],
      releaseDate: [''],
      triggerRule: ['']
    })
  }
  nameCheck() {
    let alertName=this.decisionSuppotForm.value.alertName;
    if(alertName == "")
    {
      this.checkedName=false;
      this.uncheckedName=true;
    }
    else{
      this.checkedName=true;
      this.uncheckedName=false;
    }
  }
  nameUnCheck() {
let alertName=this.decisionSuppotForm.value.alertName;
if(alertName == "")
{
  this.checkedName=false;
  this.uncheckedName=false;
}
else
{
  this.checkedName=true;
  this.uncheckedName=false;
}
  }

  descriptionCheck() {
    let description=this.decisionSuppotForm.value.description;
    if(description =="")
    {
      this.checkedDescription=false;
      this.uncheckedDescription=true;
    }
    else{
      this.checkedDescription=true;
      this.uncheckedDescription=false;
    }
  }
  descriptionUnCheck(){
    let description=this.decisionSuppotForm.value.description;
    if(description == "")
    {
      this.checkedDescription=false;
      this.uncheckedDescription=false;
    }
    else{
      this.checkedDescription=true;
      this.uncheckedDescription=false;
    }
  }
  resolutionCheck() {
    let resolution=this.decisionSuppotForm.value.resolution;
    if(resolution =="")
    {
      this.checkedResolution=false;
      this.unCheckedResolution=true;
    }
    else{
      this.checkedResolution=true;
      this.unCheckedResolution=false;
    }
  }
  resolutionUnCheck(){
    let resolution=this.decisionSuppotForm.value.resolution;
    if(resolution == "")
    {
      this.checkedResolution=false;
      this.unCheckedResolution=false;
    }
    else{
      this.checkedResolution=true;
      this.unCheckedResolution=false;
    }
  }
  bibliographyCheck() {
    let bibliography=this.decisionSuppotForm.value.bibliography;
    if(bibliography =="")
    {
      this.checkedbiBliography=false;
      this.unCheckedBibliography=true;
    }
    else{
      this.checkedbiBliography=true;
      this.unCheckedBibliography=false;
    }
  }
  bibliographyUnCheck(){
    let bibliography=this.decisionSuppotForm.value.bibliography;
    if(bibliography == "")
    {
      this.checkedbiBliography=false;
      this.unCheckedBibliography=false;
    }
    else{
      this.checkedbiBliography=true;
      this.unCheckedBibliography=false;
    }
  }
  developerCheck() {
    let developer=this.decisionSuppotForm.value.developer;
    if(developer =="")
    {
      this.checkedDeveloper=false;
      this.unCheckedDeveloper=true;
    }
    else{
      this.checkedDeveloper=true;
      this.unCheckedDeveloper=false;
    }
  }
  developerUnCheck(){
    let developer=this.decisionSuppotForm.value.developer;
    if(developer == "")
    {
      this.checkedDeveloper=false;
      this.unCheckedDeveloper=false;
    }
    else{
      this.checkedDeveloper=true;
      this.unCheckedDeveloper=false;
    }
  }
  fundingSourceCheck() {
    let fundingSource=this.decisionSuppotForm.value.fundingSource;
    if(fundingSource =="")
    {
      this.checkedfundingSource=false;
      this.unCheckedfundingSource=true;
    }
    else{
      this.checkedfundingSource=true;
      this.unCheckedfundingSource=false;
    }
  }
  fundingSourceUnCheck(){
    let fundingSource=this.decisionSuppotForm.value.fundingSource;
    if(fundingSource == "")
    {
      this.checkedfundingSource=false;
      this.unCheckedfundingSource=false;
    }
    else{
      this.checkedfundingSource=true;
      this.unCheckedfundingSource=false;
    }
  }
  releaseDateCheck() {
    let releaseDate=this.decisionSuppotForm.value.releaseDate;
    if(releaseDate =="")
    {
      this.checkedReleaseDate=false;
      this.unCheckedReleaseDate=true;
    }
    else{
      this.checkedReleaseDate=true;
      this.unCheckedReleaseDate=false;
    }
  }
  releaseDateUnCheck(){
    let releaseDate=this.decisionSuppotForm.value.releaseDate;
    if(releaseDate == "")
    {
      this.checkedReleaseDate=false;
      this.unCheckedReleaseDate=false;
    }
    else{
      this.checkedReleaseDate=true;
      this.unCheckedReleaseDate=false;
    }
  }

  open() {
    this.show = true;
    this.step=-1

  }
  close() {
    this.show = false;
  }
  step:number;
  setStep(index: number) {
    this.step = index;
  }
  disablemedication(item,bool) {
    item.isdisabled=bool;
    this.step=-1;
  }
getclinicaldesupportlist()
{
  var reqparams={
    // providerid: "5b686dd4c832dd0c444f271b",
    providerid:this.user.ProviderId
  }
  this.settingservice.ClinicalDecisionSupport(reqparams).subscribe(response=>{
    this.clinicalDecisionSupportList=response.ListResult;
    console.log(this.clinicalDecisionSupportList);
    
  })
}
}
