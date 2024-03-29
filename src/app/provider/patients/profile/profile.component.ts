import { DrFirstPatient, PatientPortalUser } from 'src/app/_models';
import { BehaviorSubject } from 'rxjs';
import { PatientSearch } from './../../../_models/_account/newPatient';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from 'src/app/_services/patient.service';
import { PatientProfile } from 'src/app/_models/_patient/patientprofile';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { fromEvent, Observable, of } from 'rxjs';
import { Actions, User } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { PatientUpdateService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { ComponentType } from '@angular/cdk/portal';
import { AuthorizedrepresentativeDialogComponent } from 'src/app/dialogs/authorizedrepresentative.dialog/authorizedrepresentative.dialog.component';
import { ResetPatientPasswordComponent } from 'src/app/dialogs/patient.dialog/reset.password';
import { OverlayService } from 'src/app/overlay.service';
import { DatePipe } from '@angular/common';
import { DrFirstValidFields, USAPhoneFormat } from 'src/app/_services/drfirst.service';
import { GlobalConstants } from 'src/app/_models/_provider/chart'
import Swal from 'sweetalert2';

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
  PatientDetails: ProviderPatient = {};
  patientMyProfile: PatientProfile = new PatientProfile();
  PracticeProviders: PracticeProviders[];
  myControl: FormControl = new FormControl();
  filteredProviderOptions: Observable<any[]>;
  filterPatientOptions: Observable<PatientSearch[]>;
  ethnicities = [{ name: 'Hispanic or Latino' }, { name: 'Not Hispanic or Latino' }, { name: 'Patient Declined to specify' }];
  isShow: boolean;
  user: User;
  patientsList: ProviderPatient[];
  SearchKey = "";
  deleteSearch: boolean;
  validDrFirstField: DrFirstValidFields = new DrFirstValidFields();
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
  ];
  States = GlobalConstants.States;
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
  resetPatientPassword = ResetPatientPasswordComponent;
  @ViewChild('searchpatient', { static: true }) searchpatient: ElementRef;
  diabledPatientSearch: boolean = false
  displayMessage: boolean = true;
  noRecords: boolean = false;
  isLoading: boolean = false;
  //currentPatient: ProviderPatient;
  selectedPatient: ProviderPatient;
  selectedPatientRelation: PatientRelationShip;
  patientRelationShip: PatientRelationShip;
  dataRefreshing: boolean = false;

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
    //this.currentPatient = this.authService.viewModel.Patient;
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

    this.dataRefreshing = true;
    this.getPatientDetails();
    this.getPatientMyProfile();
    this.getProviderList();
    this.getlanguagesInfo();
    this.getPatientRelations();
    this.getCareTeamByPatientId(this.selectedPatient.PatientId);

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
    this.searchRelationPatient = ''
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
    this.patientService.PatientMyProfileByPatientId(reqparam).subscribe(
      {
        error: (error) => {
          this.dataRefreshing = false;
        },
        next: resp => {
          if (resp.IsSuccess) {

            this.patientMyProfile = resp.ListResult[0];
            this.dataRefreshing = false;
            if (this.updatedProfile) {
              this.updatedProfile = false;
              this.patientUpdateNotifier.sendData(this.patientMyProfile);
              this.PatientDetails.Dob = this.patientMyProfile.DateOfBirth;
              this.PatientDetails.FirstName = this.patientMyProfile.FirstName;
              this.PatientDetails.LastName = this.patientMyProfile.LastName;
              this.PatientDetails.MiddleName = this.patientMyProfile.MiddleName;
              this.PatientDetails.Gender = this.patientMyProfile.Gender;
              this.PatientDetails.IsUpdatedProfileInfo = this.patientMyProfile.IsUpdatedProfileInfo;
              this.authService.SetViewParam("Patient", this.PatientDetails);
              if(this.IsDataUpdated){
                this.syncPatientProfileToIprecribe();
              }
            }


          }
        },
        complete() {
          this.dataRefreshing = false;
        },

      }


    );
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

  careTeamSelectedMember: string = ''
  searchRelationPatient: string = ''
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
        this.careTeamSelectedMember = ''
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
      } else {
        this.CareTeamList = [];
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

      } else {
        this.patientRelationList = []
        this.patientRelationListSubject.next(this.patientRelationList);
      }
    })
  }
  savePatientRelation() {
    let reqParams = {
      "PatientId": this.selectedPatient.PatientId,
      "PatientRelationShipId": this.selectedPatientRelation.PatientId,
      "RelationShip": this.selectedPatient.RelationShip
    }
    this.patientService.AssignPatientRelationShip(reqParams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2PPR001"]);
        this.getPatientRelations();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2PPR002"]);
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
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2PPR001"]);
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
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0013"]);
      } else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP0012"]);
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
  updatedProfile: boolean = false;
  updatePatientInformation() {
    this.ageCalculator();
    this.patientMyProfile.strDateOfBirth = this.datepipe.transform(this.patientMyProfile.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
    this.patientMyProfile.strDateOfDeath = this.datepipe.transform(this.patientMyProfile.DateOfDeath, "MM/dd/yyyy hh:mm:ss a");


    this.patientService.UpdatePatientInformation(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP001"]);
        this.updatedProfile = true;
        this.getPatientMyProfile();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }

  updateContactInform() {
    this.patientService.UpdateContactInformation(this.patientMyProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.updatedProfile = true;
        this.getPatientMyProfile();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP002"]);
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

  resetPassword() {
    let ppu: PatientPortalUser = { PatientHasNoEmail: true };
    ppu.Username = this.patientMyProfile.username;
    ppu.PatientName = this.patientMyProfile.FirstName + ' ' + this.patientMyProfile.LastName;
    ppu.LocationName = this.authService.userValue.BusinessName;
    ppu.PatientId = this.patientMyProfile.PatientId;
    this.patientService.ResetPatientPassword(ppu).subscribe((resp) => {
      this.openComponentDialog(this.resetPatientPassword, resp.Result as PatientPortalUser)
    })
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.authorizedRepresentativeDialogComponent) {
      reqdata = dialogData;
    } else if (content === this.resetPatientPassword) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
    });
  }

  syncPatientProfileToIprecribe() {
    let patientId = this.PatientDetails.PatientId;
    let providerId = this.authService.userValue.ProviderId;
    this.utilityService.DrfirstPatient(providerId, patientId).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.patientMyProfile.IsUpdatedProfileInfo = false;
        this.PatientDetails.IsUpdatedProfileInfo = this.patientMyProfile.IsUpdatedProfileInfo;
        this.authService.SetViewParam("Patient", this.PatientDetails);
        let drfirstPatient = resp.Result as DrFirstPatient;
        if (this.openErrorDialog(this.validateDrfirstPatientSyncInfo(drfirstPatient)))

          this.utilityService.SendDrfirstPatient(drfirstPatient)
            .subscribe(resp => {
              if (resp.IsSuccess) {
                let patientName = `${drfirstPatient.FirstName} ${drfirstPatient.LastName}`
                let message = ERROR_CODES["M2PE001"];
                message = message.replace("PATIENT_NAME", patientName)
                this.alertmsg.displayMessageDailog(message);
                this.cancel();
              }
              else {
                this.alertmsg.displayMessageDailog(ERROR_CODES["E2PE001"]);
              }
            });
      }
    })
  }

  openErrorDialog(messages: string[]): boolean {
    if (messages.length == 0) return true;
    let m: string[] = []
    messages.forEach((message) => m.push('<li>' + message + '</li>'))
    Swal.fire({
      title: "Dr First Patient data Validation Message(s)",
      html: '<ul>' + m.join("") + '</ul>',
      padding: '1px !important',
      customClass: {
        container: 'drfirst-container',
        title: 'drfirst-title',
        cancelButton: 'drfirst-cancel-botton',
        htmlContainer: 'drfirst-message',
        actions: 'drfirst-actions'
      },
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      backdrop: true,
      showConfirmButton: false,
    });
  }
  validateDrfirstPatientSyncInfo(data: DrFirstPatient): string[] {
    data.MobilePhone = USAPhoneFormat(data.MobilePhone);
    let messages: string[] = [];
    let address = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'VI', 'WA', 'WV', 'WI', 'WY']

    if (!data.FirstName && this.validDrFirstField.FirstName.required) {
      messages.push("First Name can not be blank")
    } else if (data.FirstName.length > this.validDrFirstField.FirstName.length) {
      messages.push(`First Name is too long (it should be maximum ${this.validDrFirstField.FirstName.length}) characters`)
    }

    if (!data.LastName && this.validDrFirstField.LastName.required) {
      messages.push("Last Name can not be blank")
    } else if (data.LastName.length > this.validDrFirstField.LastName.length) {
      messages.push(`Last Name is too long (it should be maximum ${this.validDrFirstField.LastName.length}) characters`)
    }

    if (data.PatientAddress && data.PatientAddress.length > this.validDrFirstField.Address1.length) {
      messages.push(`Address is too long (it should be maximum ${this.validDrFirstField.Address1.length}) characters`)
    }

    if (!data.City && this.validDrFirstField.City.required) {
      messages.push("City can not be blank")
    }
    else if (data.City && data.City.length > this.validDrFirstField.City.length) {
      messages.push(`City is too long  (it should be maximum ${this.validDrFirstField.City.length}) characters`)
    }

    if (!data.State && this.validDrFirstField.State.required) {
      messages.push("State can not be blank")
    }
    else if (data.State && address.indexOf(data.State) == -1) {
      messages.push(`State must be a valid US State`)
    }

    if (!data.Zip && this.validDrFirstField.Zip.required) {
      messages.push("Zip code can not be blank")
    } else if (data.Zip && this.validDrFirstField.Zip.size.indexOf(data.Zip.length) == -1) {
      messages.push("Zip code should be 5 or 10 characters long")
    }

    if (!data.DOB && this.validDrFirstField.DOB.required) {
      messages.push("Date of birth can not be blank")
    } else if (data.DOB > new Date()) {
      messages.push("Date of birth should be less than or equal to todays date");
    }

    if (!data.MobilePhone && !data.HomePhone && this.validDrFirstField.MobilePhone.required) {
      messages.push("Primary phone can not be blank")
    } else if (data.MobilePhone && !data.HomePhone && data.MobilePhone.length > this.validDrFirstField.MobilePhone.length) {
      messages.push("Primary phone is not valid us number")
    } else if (!data.MobilePhone && data.HomePhone && USAPhoneFormat(data.HomePhone).length > this.validDrFirstField.MobilePhone.length) {
      messages.push("Primary phone is not valid us number")
    }


    return messages;
  }

  get IsDataUpdated() {
    return this.PatientDetails.IsUpdatedProfileInfo && this.PatientDetails.DrFirstPatientId;
  }
  // Access Permissions

  get CanViewAdvancedDirectives(): boolean {
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "AdvancedDirectivePolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }
  get CanUpdateProfile(): boolean {
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "ProfilePolicy" && fn.MethodName == "update")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

}

