import { Patient } from 'src/app/_models/newPatient';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { patientService } from 'src/app/_services/patient.service';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PracticeProviders } from 'src/app/_models/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormControl } from '@angular/forms';
import { map, startWith, filter } from 'rxjs/operators';
import { Observable, observable } from 'rxjs';
import { User } from 'src/app/_models';
import { PatientsData } from 'src/app/_models/patients';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput:ElementRef;
  AduthorizesModal = "none";
  AddAduthorizesModal = "none";
  PatientDetails: any = [];
  PatientList: any = [];
  PatientMyProfile: PatientProfile;
  PracticeProviders: PracticeProviders[];
  myControl: FormControl = new FormControl();
  filteredProviderOptions: Observable<any[]>;
  filterPatientOptions: Observable<any[]>;
  isShow: boolean;
  user: User;
  patientsList: PatientsData[];
  Patientdata: any = [];
  GetFilterList: any;
  SearchKey = "";
  allowaccess: boolean;
  removeAccess: boolean = true;
  deleteSearch: boolean;
  relationship: any = [

    { Id: '1', value: 'Parent-Mother' },
    { Id: '2', value: 'Parent-Father' },
    { Id: '3', value: 'Sibling-Sister' },
    { Id: '4', value: 'Sibling-Brother' },
    { Id: '5', value: 'Child-Daughter' },
    { Id: '6', value: 'Child-Son' },
    { Id: '8', value: 'Grandparent-Grandmother' },
    { Id: '9', value: 'Grandparent-Grandfather' },
    { Id: '10', value: 'Great Grandparent' },
    { Id: '11', value: 'Uncle' },
    { Id: '12', value: 'Aunt' },
    { Id: '13', value: 'Cousin' },
    { Id: '14', value: 'Other' },
    { Id: '15', value: 'UnKnown' },
  ]
  CareTeamList: any = [];
  careTeamName: any;
  primaryLanguages: any = [];
  secondaryLanguage: any = [];
  languageList: any = [];
  patientRelationList: any = [];
  displayNotes ="none";
  jQuery:any;
  constructor(private route: ActivatedRoute, private patientService: patientService,private utilityService:UtilityService,
    private smartSchedulerService: SmartSchedulerService, private authService: AuthenticationService,private alertmsg: AlertMessage) {
    this.user = authService.userValue;
    this.PatientMyProfile = {} as PatientProfile;
  }

  ngOnInit(): void {
    this.getPatientDetails();
    this.getPatientMyProfile();
    this.getProviderList();
    //  this.getPatientsByProvider();
    this.relationship;
    this.getlanguagesInfo();
    this.getPatientsRelationByProvider();
  }

  //get Language List
  getlanguagesInfo() {
    this.utilityService.LanguagesInfo().subscribe(resp => {
      if (resp.IsSuccess) {
        this.primaryLanguages = resp.ListResult[0];
        this.secondaryLanguage = resp.ListResult[1];
        this.languageList = this.languageList.concat(this.primaryLanguages, this.secondaryLanguage);
      }
    });
  }

  // get patient id
  getPatientDetails() {
    this.route.queryParams.subscribe((params) => {
      this.PatientDetails = JSON.parse(params.patient);
      console.log(this.PatientDetails);
    });
  }

  // get patient details by id
  getPatientMyProfile() {
    debugger;
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    console.log(reqparam);
    this.patientService.PatientMyProfileByPatientId(reqparam).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.PatientMyProfile = resp.ListResult[0];
        this.PatientMyProfile.Gender = this.PatientMyProfile.Gender;
        console.log(this.PatientMyProfile.Gender);
      }
    });
  }

  // get provider list
  getProviderList() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
        this.isShow = this.PracticeProviders.length == 0 ? true : false;
        this.filteredProviderOptions = this.myControl.valueChanges
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

  getCareTeamDetails(id) {
    debugger;
    let Providers: any = []
    Providers = id;
    var patientId = this.PatientDetails.PatientId;

    let reqparams =
    {
      "ProviderIds": [Providers],
      "PatientId": patientId
    }
    this.patientService.CreateCareTeam(reqparams).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        debugger;
        this.getCareTeamByPatientId(patientId);
      }
    });
  }


  getCareTeamByPatientId(patientId) {
    let reqparam = {
      'PatientId': patientId
    }
    this.patientService.CareTeamByPatientId(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        debugger;
        this.CareTeamList = resp.ListResult;
        this.careTeamName = this.CareTeamList.FirstName;
        console.log(this.CareTeamList)
      }
    });
  }

  getPatientsByProvider() {
    debugger;
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProviderId": this.user.ProviderId
    }
    this.patientService.PatientsByProvider(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.patientsList = resp.ListResult;
        // this.GetFilterList = resp.ListResult;
      }
    });
  }

  getPatientsRelationByProvider() {
    let reqparam = {
      "ProviderId": this.user.ProviderId
    }
    // this.patientService.PatientsRelationByProviderId(reqparam).subscribe(resp => {
    //   if (resp.IsSuccess) {
    //     // this.patientRelationList = resp.ListResult;
    //     // this.GetFilterList = resp.ListResult;
    //     console.log(this.patientRelationList);
    //   }
    // })
  }

  // search patient details
  SearchDetails() {
    this.patientRelationList = this.GetFilterList.filter((invoice) => this.isMatch(invoice));
    this.allowaccess = true;
    this.deleteSearch = true;
  }

  isMatch(item) {
    debugger;
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
    }
  }

  allowAccess() { }

  savePatientRelation() {
    this.allowaccess = false;
    this.removeAccess = false;
  }

  removeAccessed(item) {
    this.allowaccess = true;
    this.removeAccess = true;
  }

  removeSearch() {
    this.SearchKey = " ";
    this.deleteSearch = false;
  }

  removeCareTeam(index) {
    this.CareTeamList.splice(index, 1);
  }

  DisplayAduthorizes() {
    this.AduthorizesModal = "block";
  }

  AddAuthorized() {
    this.AddAduthorizesModal = "block";
  }

  updatePatientInformation() {
    debugger;
    this.patientService.UpdatePatientInformation(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP001"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }

  updateContactInform() {
    debugger;
    this.patientService.UpdateContactInformation(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP002"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP002"]);
      }
    });
  }

  updateEmergencyContact() {
    this.patientService.UpdateEmergencyContact(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP003"]);
      }
    });
  }

  updateNextOfKin() {
    this.patientService.UpdateNextofkin(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP006"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP006"]);
      }
    });
  }

  updateDemography() {
    this.patientService.UpdateDemographics(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP005"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP005"]);
      }
    });
  }

  updateImmunizationRegistry() {
    this.patientService.UpdateImmunizationRegistry(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if(resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP007"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP007"]);
      }
    });
  }

  updateNote() {
    this.patientService.UpdateNotes(this.PatientMyProfile).subscribe(resp => {
      debugger;
      if(resp.IsSuccess) {
        let success = resp.EndUserMessage;
        console.log(success);
        this.closeNotes();
      }

    });
  }

  openNotes()
  {
    this.displayNotes="block";
  }
  closeNotes()
  {
    this.displayNotes="none";
  }
}
