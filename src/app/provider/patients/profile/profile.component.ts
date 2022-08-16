import { Component,OnInit } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormControl } from '@angular/forms';
import { map,startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { calcProjectFileAndBasePath } from '@angular/compiler-cli';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  PatientDetails: any = [];
  PatientMyProfile: PatientProfile;
  PracticeProviders: PracticeProviders[];
  myControl: FormControl = new FormControl();
  filteredProviderOptions: Observable<any[]>;
  filterPatientOptions: Observable<any[]>;
  ethnicities = [{name: 'Hispanic or Latino'},{name: 'Not Hispanic or Latino'},{name: 'Patient Declined to specify'}];
  isShow: boolean;
  user: User;
  patientsList: ProviderPatient[];
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
  hoverDATEOFBIRTH:string='MM/DD/YYYY';
  hoverDATEOFDEATH:string='MM/DD/YYYY'
  addressVerfied: boolean = false;
  manuallybtn: boolean = false;
  disableaddressverification: boolean = false;
  emergencyManuallybtn:boolean = false;
  emergencyAddressVerfied:boolean = false;
  emergencyDisableAddressVerification:boolean = false;


  constructor(private patientService: PatientService, private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService, private authService: AuthenticationService, private alertmsg: AlertMessage, private accountservice: Accountservice,) {
    this.user = authService.userValue;
    this.PatientMyProfile = {} as PatientProfile;
  }

  ngOnInit(): void {
    this.getPatientDetails();
    this.getPatientMyProfile();
    this.getProviderList();
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
    this.PatientDetails = this.authService.viewModel.Patient;
  }

  // get patient details by id
  getPatientMyProfile() {
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    this.patientService.PatientMyProfileByPatientId(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientMyProfile = resp.ListResult[0];
        this.PatientMyProfile.Gender = this.PatientMyProfile.Gender;
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
    let Providers: any = []
    Providers = id;
    var patientId = this.PatientDetails.PatientId;

    let reqparams =
    {
      "ProviderIds": [Providers],
      "PatientId": patientId
    }
    this.patientService.CreateCareTeam(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
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
        this.CareTeamList = resp.ListResult;
        this.careTeamName = this.CareTeamList.FirstName;
      }
    });
  }

  getPatientsByProvider() {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProviderId": this.user.ProviderId
    }
    this.patientService.PatientsByProvider(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.patientsList = resp.ListResult;
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
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
    }
  }

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

  updatePatientInformation() {
    this.patientService.UpdatePatientInformation(this.PatientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP001"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }

  updateContactInform() {
    this.patientService.UpdateContactInformation(this.PatientMyProfile).subscribe(resp => {
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
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP007"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP007"]);
      }
    });
  }

  updateNote() {
    this.patientService.UpdateNotes(this.PatientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        let success = resp.EndUserMessage;
      }

    });
  }
  AddressVerification() {
    this.accountservice.VerifyAddress(this.PatientMyProfile.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientMyProfile.city = resp.Result.components.city_name
        this.PatientMyProfile.state = resp.Result.components.state_abbreviation
        this.PatientMyProfile.StreetAddress = resp.Result.delivery_line_1
        this.PatientMyProfile.zip = resp.Result.components.zipcode
        this.PatientMyProfile.Street = "";
        this.addressVerfied = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0010"])
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP009"])
      }
    });
  }

  enableManualEntry() {
    this.clearAddress();
    this.manuallybtn = true;
    
  }

  clearAddress() {
    this.PatientMyProfile.Street = "";
    this.PatientMyProfile.city = ""
    this.PatientMyProfile.state = ""
    this.PatientMyProfile.StreetAddress = ""
    this.PatientMyProfile.zip = ""
  }

  enterAddressManually(item) {
    this.disableaddressverification = true;
  }



  EmergencyAddressVerification() {
    this.accountservice.VerifyAddress(this.PatientMyProfile.EmergencyStreet).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientMyProfile.EmergencyCity = resp.Result.components.city_name
        this.PatientMyProfile.EmergencyState = resp.Result.components.state_abbreviation
        this.PatientMyProfile.EmergencyStreetAddress = resp.Result.delivery_line_1
        this.PatientMyProfile.EmergencyZip = resp.Result.components.zipcode
        this.PatientMyProfile.EmergencyStreet = "";
        this.emergencyAddressVerfied = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0010"])
      }
      else {
        this.emergencyManuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP009"])
      }
    });
  }

  EmergencyenableManualEntry() {
    this.EmergencyclearAddress();
    this.emergencyManuallybtn = true;
    
  }

  EmergencyclearAddress() {
    this.PatientMyProfile.EmergencyStreet = "";
    this.PatientMyProfile.EmergencyCity = ""
    this.PatientMyProfile.EmergencyState = ""
    this.PatientMyProfile.EmergencyStreetAddress = ""
    this.PatientMyProfile.EmergencyZip = ""
  }

  EmergencyenterAddressManually() {
    this.emergencyDisableAddressVerification = true;
  }

  allowAccess() { }
}
