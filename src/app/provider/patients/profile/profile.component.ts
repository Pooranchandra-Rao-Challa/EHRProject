import { Patient } from 'src/app/_models/newPatient';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { patientService } from 'src/app/_services/patient.service';
import { Dropdown, PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PracticeProviders } from 'src/app/_models/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  AduthorizesModal = "none";
  AddAduthorizesModal="none";
  PatientDetails:any=[];
  PatientList:any=[];
  PatientMyProfile: PatientProfile;
  ImmunizationRadiobtn:string;
  LanguageList = Dropdown;
  PracticeProviders: PracticeProviders[];
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  isShow: boolean;

  constructor(private route: ActivatedRoute,private patientservise: patientService,
    private smartSchedulerService: SmartSchedulerService,private authService: AuthenticationService) { }

  ngOnInit(): void {
  this.getPatientDetails();
  this.getPatientMyProfile();
  this.LanguageList;
  console.log(this.LanguageList);
  this.GetProviderList();
  }

  GetProviderList() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    console.log(req);
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
        console.log(this.PracticeProviders);
        this.isShow = this.PracticeProviders.length == 0 ? true : false;
        this.filteredOptions =this.myControl.valueChanges
          .pipe(startWith(''), map(company => company ? this.filterProvider(company) : this.PracticeProviders.slice()));
      }
    });
  }

 //filter Provider on search text
    filterProvider(searchText: string) {
      if (searchText.length < 1) {
        return [];
      }
      this.isShow = false;
      var searchData = this.PracticeProviders.filter(company => ((company.FullName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)));
      this.isShow = searchData.length == 0 ? true : false;
      return searchData
  }

  getPatientDetails()
  {
    this.route.queryParams.subscribe((params) => {
      this.PatientDetails = JSON.parse(params.patient);
      let patientId =  this.PatientDetails.PatientId;
      console.log(this.PatientDetails);
      console.log(patientId);
   });
  }

  getPatientMyProfile() {
   debugger;
    var reqparam={
      "PatientId":this.PatientDetails.PatientId
    }
    this.patientservise.PatientMyProfileByPatientId(reqparam).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.PatientMyProfile = resp.ListResult[0];
        this.ImmunizationRadiobtn=this.PatientMyProfile.ImmunizationrRegistry;
      }
      console.log(this.PatientMyProfile);
      console.log(this.PatientMyProfile.FirstName);
    });
  }

  GetProviderDetails(id)
  {

  }

  DisplayAduthorizes()
  {
    this.AduthorizesModal = "block";
  }

  AddAuthorized()
  {
    this.AddAduthorizesModal="block";
  }

}
