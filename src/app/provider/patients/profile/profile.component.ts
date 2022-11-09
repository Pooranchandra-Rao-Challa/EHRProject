import { BehaviorSubject } from 'rxjs';
import { PatientSearch } from './../../../_models/_account/newPatient';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AbstractControl, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { fromEvent, Observable, of } from 'rxjs';
import { Actions, User } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/ProviderPatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { calcProjectFileAndBasePath } from '@angular/compiler-cli';
import { PatientUpdateService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { ComponentType } from '@angular/cdk/portal';
import { AuthorizedrepresentativeDialogComponent } from 'src/app/dialogs/authorizedrepresentative.dialog/authorizedrepresentative.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { DatePipe } from '@angular/common';
import { DentalChartComponent } from '../dental.chart/dental.chart.component';

export class PatientRelationShip {
  RelationPatientId?: string;
  ProviderId?: string;
  RelationFirstName?: string;
  RelationMiddleName?: string;
  RelationLastName?: string;
  RelationUserId?: string;
  RelationUserName?: string;
  RelationShip?: string;
  PatientId?: string;
  HasAccess?: boolean;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  patient: ProviderPatient;
  PatientDetails: any = [];
  patientMyProfile: PatientProfile = new PatientProfile();
  PracticeProviders: PracticeProviders[];
  myControl: FormControl = new FormControl();
  filteredProviderOptions: Observable<any[]>;
  filterPatientOptions: Observable<PatientSearch[]>;
  ethnicities = [{ name: 'Hispanic or Latino' }, { name: 'Not Hispanic or Latino' }, { name: 'Patient Declined to specify' }];
  isShow: boolean;
  user: User;
  patientsList: ProviderPatient[];
  GetFilterList: any;
  SearchKey = "";
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
  patientRelationList: PatientRelationShip[] = [];
  patientRelationListSubject = new BehaviorSubject<PatientRelationShip[]>([]);
  hoverDATEOFBIRTH: string = 'MM/DD/YYYY';
  hoverDATEOFDEATH: string = 'MM/DD/YYYY';
  addressVerfied: boolean = false;
  manuallybtn: boolean = false;
  disableaddressverification: boolean = false;
  emergencyManuallybtn: boolean = false;
  emergencyAddressVerfied: boolean = false;
  emergencyDisableAddressVerification: boolean = false;
  PhonePattern: any
  @Input() max: any;
  disableupcomingdates = new Date();
  ActionTypes = Actions;
  authorizedRepresentativeDialogComponent = AuthorizedrepresentativeDialogComponent;
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  diabledPatientSearch: boolean = false
  displayMessage: boolean = true;
  noRecords: boolean = false;
  isLoading: boolean = false;
  currentPatient: ProviderPatient;
  selectedPatient: ProviderPatient;
  selectedPatientRelation: PatientRelationShip;
  patientRelationShip: PatientRelationShip;

  constructor(private patientService: PatientService,
    private utilityService: UtilityService,
    private smartSchedulerService: SmartSchedulerService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private accountservice: Accountservice,
    public datepipe: DatePipe,
    private patientUpdateNotifier: PatientUpdateService,
    public overlayService: OverlayService,) {
    this.user = authService.userValue;
    this.currentPatient = this.authService.viewModel.Patient;
    this.selectedPatient = this.authService.viewModel.Patient;
    this.patientMyProfile = {} as PatientProfile;
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
    this.disableupcomingdates.setDate(this.disableupcomingdates.getDate());
  }

  emailPattern = "^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$";

  ngAfterViewInit(): void {
    fromEvent(this.searchpatient.nativeElement, 'keyup').pipe(
      // get value
      map((event: any) => {
        this.filteredProviderOptions = of([]);
        this.noRecords = false;
        if (event.target.value == '') {
          this.displayMessage = true;
        }
        return event.target.value;
      })
      // if character length greater or equals to 1
      , filter(res => res.length >= 1)
      // Time in milliseconds between key events
      , debounceTime(1000)
      // If previous query is diffent from current
      , distinctUntilChanged()
      // subscription for response
    ).subscribe(value => this._filterPatient(value));
  }


  ngOnInit(): void {
    this.getPatientDetails();
    this.getPatientMyProfile();
    this.getProviderList();
    this.getlanguagesInfo();
    this.getPatientRelations();
    this.getCareTeamByPatientId(this.currentPatient.PatientId);
  }

  _filterPatient(term) {
    this.isLoading = true;
    this.patientService
      .PatientSearch({
        ProviderId: this.authService.userValue.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isLoading = false;
        this.displayMessage = false;
        if (resp.IsSuccess) {
          this.filterPatientOptions = of(
            resp.ListResult as PatientSearch[]);
        }
        else {
          this.filterPatientOptions = of([]);
          this.noRecords = true;
        }
      })
  }

  onPatientSelected(selected) {
    let reqParams: any = {
      'RelationFirstName': selected.option.value.FirstName,
      'RelationLastName': selected.option.value.LastName,
      'RelationShip': selected.option.value.RelationShip,
      'PatientId': selected.option.value.PatientId
    }
    this.patientRelationList.push(reqParams);
    this.patientRelationListSubject.next(this.patientRelationList);
  }

  displayWithPatientSearch(value: PatientSearch): string {
    if (!value) return "";
    return value.Name;
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
        this.patientMyProfile = resp.ListResult[0];
        this.patientMyProfile.Gender = this.patientMyProfile.Gender;
      } //else console.log(resp);

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

  getPatientRelations() {
    let reqparam = {
      "PatientId": this.selectedPatient.PatientId
    }
    this.patientService.PatientRelations(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientRelationList = resp.ListResult;
        this.patientRelationListSubject.next(this.patientRelationList);
        this.GetFilterList = resp.ListResult;
      }
    })
  }

  // search patient details
  // SearchDetails() {
  //   this.patientRelationList = this.GetFilterList.filter((invoice) => this.isMatch(invoice));
  //   this.deleteSearch = true;
  // }

  // isMatch(item) {
  //   if (item instanceof Object) {
  //     return Object.keys(item).some((k) => this.isMatch(item[k]));
  //   } else {
  //     return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1
  //   }
  // }

  savePatientRelation() {
    let reqParams = {
      "PatientId": this.selectedPatient.PatientId,
      "PatientRelationShipId": this.selectedPatientRelation.PatientId,
      "RelationShip": this.selectedPatient.RelationShip
    }
    this.patientService.AssignPatientRelationShip(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getPatientRelations();
      }
    });
  }

  removeAccessed(item: PatientRelationShip) {
    let reqParams = {
      "PatientId": item.PatientId,
      "PatientRelationShipId": item.RelationPatientId,
    }
    this.patientService.RemovePatientRelationShipAccess(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getPatientRelations();
      }
    });
  }

  removeSearch() {
    this.SearchKey = " ";
    this.deleteSearch = false;
  }

  removeCareTeam(index) {
    this.CareTeamList.splice(index, 1);
  }

  deleteCareTeam(CareTeamId) {
    let reqparam = {
      "CareTeamId": CareTeamId
    }
    this.patientService.DeleteCareTeamProviderIds(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getCareTeamByPatientId(this.PatientDetails.PatientId);
      }
    })
    // this.CareTeamList.splice(index, 1);
  }

  ageCalculator() {
    if (this.patientMyProfile.DateOfBirth) {
      let timeDiff = Math.abs(Date.now() - new Date(this.patientMyProfile.DateOfBirth).getTime());
      this.patientMyProfile.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25).toString();
    }
  }
  updatePatientInformation() {
    this.ageCalculator();
    this.patientMyProfile.DateOfBirth = this.datepipe.transform(this.patientMyProfile.DateOfBirth, "yyyy-MM-dd");
    this.patientMyProfile.DateOfDeath = this.datepipe.transform(this.patientMyProfile.DateOfDeath, "yyyy-MM-dd")
    this.patientService.UpdatePatientInformation(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP001"])
        this.getPatientMyProfile();
        // this.patient = this.authService.viewModel.Patient;
        this.patientUpdateNotifier.sendData(this.patientMyProfile);
        this.authService.SetViewParam("Patient", this.patientMyProfile);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }

  updateContactInform() {
    this.patientService.UpdateContactInformation(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getPatientMyProfile();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP002"]);
        this.patientUpdateNotifier.sendData(this.patientMyProfile);
        this.authService.SetViewParam("Patient", this.patientMyProfile);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP002"]);
      }
    });
  }

  updateEmergencyContact() {
    this.patientService.UpdateEmergencyContact(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP003"]);
      }
    });
  }

  updateNextOfKin() {
    this.patientService.UpdateNextofkin(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP006"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP006"]);
      }
    });
  }

  updateDemography() {
    this.patientService.UpdateDemographics(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP005"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP005"]);
      }
    });
  }

  updateImmunizationRegistry() {
    this.patientService.UpdateImmunizationRegistry(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP007"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP007"]);
      }
    });
  }

  updateNote() {

    this.patientMyProfile.Notes = this.patientMyProfile.Notes;
    this.patientService.UpdateNotes(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        let success = resp.EndUserMessage;
      }
      //(this.patientMyProfile);


    });
    this.getPatientMyProfile();
  }
  cancel() {
    this.patientMyProfile.Notes = '';
    this.getPatientMyProfile();
  }
  AddressVerification() {
    this.accountservice.VerifyAddress(this.patientMyProfile.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientMyProfile.city = resp.Result.components.city_name
        this.patientMyProfile.state = resp.Result.components.state_abbreviation
        this.patientMyProfile.StreetAddress = resp.Result.delivery_line_1
        this.patientMyProfile.zip = resp.Result.components.zipcode
        this.patientMyProfile.Street = "";
        this.addressVerfied = true;
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP0010"])
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
    this.patientMyProfile.Street = "";
    this.patientMyProfile.city = ""
    this.patientMyProfile.state = ""
    this.patientMyProfile.StreetAddress = ""
    this.patientMyProfile.zip = ""
  }

  enterAddressManually() {
    this.disableaddressverification = true;
  }



  EmergencyAddressVerification() {
    this.accountservice.VerifyAddress(this.patientMyProfile.EmergencyStreet).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientMyProfile.EmergencyCity = resp.Result.components.city_name
        this.patientMyProfile.EmergencyState = resp.Result.components.state_abbreviation
        this.patientMyProfile.EmergencyStreetAddress = resp.Result.delivery_line_1
        this.patientMyProfile.EmergencyZip = resp.Result.components.zipcode
        this.patientMyProfile.EmergencyStreet = "";
        this.emergencyAddressVerfied = true;
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP0010"])
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
    this.patientMyProfile.EmergencyStreet = "";
    this.patientMyProfile.EmergencyCity = ""
    this.patientMyProfile.EmergencyState = ""
    this.patientMyProfile.EmergencyStreetAddress = ""
    this.patientMyProfile.EmergencyZip = ""
  }

  EmergencyenterAddressManually() {
    this.emergencyDisableAddressVerification = true;
  }


  allowAccess(item: PatientRelationShip) {
    this.selectedPatientRelation = item;
  }

  namePattern = /^[a-zA-Z ]*$/;

  enablePatientInfo() {
    // let namePattern = /^[a-zA-Z ]*$/;
    let ssnPattern = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
    let flag = !(this.namePattern.test(this.patientMyProfile.FirstName)
      && this.namePattern.test(this.patientMyProfile.LastName)
      && (this.patientMyProfile.MiddleName == null || this.patientMyProfile.MiddleName == ''
        || this.namePattern.test(this.patientMyProfile.MiddleName))
      && (this.patientMyProfile.SSecuirtyNumber == null || this.patientMyProfile.SSecuirtyNumber == ''
        || ssnPattern.test(this.patientMyProfile.SSecuirtyNumber)));

    return flag;
  }

  email = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;
  phonepattern = /^[0-9]{10}/;
  enableEmergencyContactInfo() {
    let flag = !((this.namePattern.test(this.patientMyProfile.EmergencyFirstName)
      && this.patientMyProfile.EmergencyFirstName != null && this.patientMyProfile.EmergencyFirstName != '')
      && (this.namePattern.test(this.patientMyProfile.EmergencyLastName)
        && this.patientMyProfile.EmergencyLastName != null && this.patientMyProfile.EmergencyLastName != '')
      && (this.patientMyProfile.EmergencyMiddleName == null || this.patientMyProfile.EmergencyMiddleName == ''
        || this.namePattern.test(this.patientMyProfile.EmergencyMiddleName))
      && this.patientMyProfile.RelationshipToPatient != null && this.patientMyProfile.RelationshipToPatient != ''
      && (this.patientMyProfile.Phone == null || this.patientMyProfile.Phone == ""
        || this.phonepattern.test(this.patientMyProfile.Phone)));


    return flag;
  }


  enablePatientContactInfo() {

    let flag = !((this.patientMyProfile.email == null || this.patientMyProfile.email == ""
      || this.email.test(this.patientMyProfile.email))
      && (this.patientMyProfile.PrimaryPhone == null || this.patientMyProfile.PrimaryPhone == ""
        || this.phonepattern.test(this.patientMyProfile.PrimaryPhone))
      && (this.patientMyProfile.MobilePhone == null || this.patientMyProfile.MobilePhone == ""
        || this.phonepattern.test(this.patientMyProfile.MobilePhone))
      && (this.patientMyProfile.WorkPhone == null || this.patientMyProfile.WorkPhone == ""
        || this.phonepattern.test(this.patientMyProfile.WorkPhone)))


    return flag;
  }

  enableNextKinInfo() {
    let flag = !((this.namePattern.test(this.patientMyProfile.NKFirstName)
      && this.patientMyProfile.NKFirstName != null && this.patientMyProfile.NKFirstName != '')
      && (this.namePattern.test(this.patientMyProfile.NkLastName)
        && this.patientMyProfile.NkLastName != null && this.patientMyProfile.NkLastName != '')
      && (this.patientMyProfile.NkMiddleName == null || this.patientMyProfile.NkMiddleName == ''
        || this.namePattern.test(this.patientMyProfile.NkMiddleName))
      && this.patientMyProfile.NkRel != null && this.patientMyProfile.NkRel != ''
      && (this.patientMyProfile.NKMobilePhone == null || this.patientMyProfile.NKMobilePhone == ""
        || this.phonepattern.test(this.patientMyProfile.NKMobilePhone)))
    return flag;
  }


  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {

    let reqdata: any;
    if (action == Actions.view && content === this.authorizedRepresentativeDialogComponent) {
      reqdata = dialogData;
    }

    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {


    });
  }

}

