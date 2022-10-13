import { PatientNavbarComponent } from './../_navigations/patient.navbar/patient.navbar.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { areaCodes, PatientProfile, PatientProfileSecurityQuestion } from './../_models/_patient/patientprofile';
import { PatientService } from 'src/app/_services/patient.service';
import { Component, OnInit,  } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from '../_models';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';
import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { UtilityService } from '../_services/utiltiy.service';
import { Accountservice } from '../_services/account.service';
import { AreaCode } from '../_models/_admin/Admins';




@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  user: User;
  myControl = new FormControl();
  PatientProfile: PatientProfile = {};
  patientProfileSecurityQuestion: PatientProfileSecurityQuestion = {}
  updateSecurityQuestion: PatientProfileSecurityQuestion = {}
  patietnprofile: any
  filteredOptions: Observable<string[]>;
  filterNumbers: any;
  SourceData: any[];
  questions: any[] = SECURE_QUESTIONS
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
  GenderData: any = [
    { Id: '1', value: 'male' },
    { Id: '2', value: 'female' },
    { Id: '3', value: 'other' },
    { Id: '4', value: 'unknown' }

  ]
  addressVerfied: boolean = false;
  manuallybtn: boolean = false;
  disableaddressverification: boolean = false;
  emergencyAdressVerfied: boolean = false;
  emergencyManuallybtn: boolean = false;
  emergencydisableaddressverification: boolean = false;
  filteredOptionsMobilePhone: any
  filteredOptionPrimaryPhone: any
  filteredOptionWorkPhone: any;
  filteredOptionEmergencyPhone: any
  myControlPrimaryPhone = new FormControl();
  myControlMobilePhone = new FormControl();
  myControlWorkPhone = new FormControl();
  myControlEmergencyPhone = new FormControl();

  AreaCodes: AreaCode[];
  constructor(private patientService: PatientService, private authenticationService: AuthenticationService, private alertmsg: AlertMessage,
    private PatientNavbar: PatientNavbarComponent, private accountservice: Accountservice,
    private utilityService: UtilityService,) {
    this.user = authenticationService.userValue;
    this.filteredOptionsMobilePhone = this.myControlMobilePhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionPrimaryPhone = this.myControlPrimaryPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionWorkPhone = this.myControlWorkPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionEmergencyPhone = this.myControlEmergencyPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
  }

  ngOnInit(): void {
    this.getPatientProfile();
    this.loadDefaults();

  }

  getPatientProfile() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
        if (this.PatientProfile.WorkPhone == null) {
          this.PatientProfile.WorkPhonePreffix = '';
          this.PatientProfile.WorkPhoneSuffix = '';
        }
        else {
          let list = this.PatientProfile.WorkPhone;
          this.PatientProfile.WorkPhonePreffix = list.slice(0, 3);
          this.PatientProfile.WorkPhoneSuffix = list.slice(3, 10);
        }
      }
      if (this.PatientProfile.MobilePhone == null) {
        this.PatientProfile.MobilePhonePreffix = '';
        this.PatientProfile.MobilePhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.MobilePhone;
        this.PatientProfile.MobilePhonePreffix = list.slice(0, 3);
        this.PatientProfile.MobilePhoneSuffix = list.slice(3, 10);
      }
      if (this.PatientProfile.PrimaryPhone == null) {
        this.PatientProfile.PrimaryPhonePreffix = '';
        this.PatientProfile.PrimaryPhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.PrimaryPhone;
        this.PatientProfile.PrimaryPhonePreffix = list.slice(0, 3);
        this.PatientProfile.PrimaryPhoneSuffix = list.slice(3, 10);
      }
      if (this.PatientProfile.Phone == null) {
        this.PatientProfile.EmergencyPhonePreffix = '';
        this.PatientProfile.EmergencyPhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.Phone;
        this.PatientProfile.EmergencyPhonePreffix = list.slice(0, 3);
        this.PatientProfile.EmergencyPhoneSuffix = list.slice(3, 10);
      }

    });
  }
  updatePatientMyProfile() {
    this.patientService.UpdatePatientMyprofile(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientNavbar.getPatientProfile();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP008"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }
  updateContactInform() {
    this.PatientProfile.WorkPhone = this.PatientProfile.WorkPhonePreffix + this.PatientProfile.WorkPhoneSuffix;
    this.PatientProfile.MobilePhone = this.PatientProfile.MobilePhonePreffix + this.PatientProfile.MobilePhoneSuffix;
    this.PatientProfile.PrimaryPhone = this.PatientProfile.PrimaryPhonePreffix + this.PatientProfile.PrimaryPhoneSuffix;
    this.patientService.UpdateContactInformation(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP002"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP002"]);
      }
    });
  }
  updateEmergencyContact() {
    this.PatientProfile.Phone = this.PatientProfile.EmergencyPhonePreffix + this.PatientProfile.EmergencyPhoneSuffix
    this.patientService.UpdateEmergencyContact(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP003"]);
      }
    });
  }
  getpatientsecurityQuestions() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.MyProfileSecurityQuestion(req).subscribe(
      resp => {
        if (resp.IsSuccess) {
          this.patientProfileSecurityQuestion = resp.ListResult[0]
        }
      }
    )
    this.updateSecurityQuestion = new PatientProfileSecurityQuestion();
  }
  ChangeSecurityQuestion(item) {
    this.updateSecurityQuestion.SecurityID = this.patientProfileSecurityQuestion.SecurityID;
    this.updateSecurityQuestion.PateientId = this.patientProfileSecurityQuestion.PateientId;
    this.patientService.UpdatePatientMyProfileSecurityQuestion(this.updateSecurityQuestion).subscribe(

      resp => {
        if (resp.IsSuccess) {
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP009"])
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP008"])
        }
      }

    )
  }
  AddressVerification() {
    this.accountservice.VerifyAddress(this.PatientProfile.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile.city = resp.Result.components.city_name
        this.PatientProfile.state = resp.Result.components.state_abbreviation
        this.PatientProfile.StreetAddress = resp.Result.delivery_line_1
        this.PatientProfile.zip = resp.Result.components.zipcode
        this.PatientProfile.Street = "";
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
    this.manuallybtn = true;
    this.clearAddress();
  }

  clearAddress() {
    this.PatientProfile.Street = "";
    this.PatientProfile.city = ""
    this.PatientProfile.state = ""
    this.PatientProfile.StreetAddress = ""
    this.PatientProfile.zip = ""
  }
  enterAddressManually(item) {
    this.disableaddressverification = true;
  }
  EmergencyclearAddress() {
    this.PatientProfile.EmergencyStreet = "";
    this.PatientProfile.EmergencyCity = ""
    this.PatientProfile.EmergencyState = ""
    this.PatientProfile.EmergencyStreetAddress = ""
    this.PatientProfile.EmergencyZip = ""
  }
  emergencyAddressVerfied() {
    this.accountservice.VerifyAddress(this.PatientProfile.EmergencyStreet).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile.EmergencyCity = resp.Result.components.city_name
        this.PatientProfile.EmergencyState = resp.Result.components.state_abbreviation
        this.PatientProfile.EmergencyStreetAddress = resp.Result.delivery_line_1
        this.PatientProfile.EmergencyZip = resp.Result.components.zipcode
        this.PatientProfile.EmergencyStreet = "";
        this.emergencyAdressVerfied = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0010"])
      }
      else {
        this.emergencyManuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP009"])
      }
    });
  }
  emergencyEnableManualEntry() {
    this.EmergencyclearAddress();
    this.emergencyManuallybtn = true;

  }
  emergencyAddressEnterManually(item) {
    this.emergencydisableaddressverification = true;
  }

  enableSave() {
    return !(
      this.updateSecurityQuestion.Answer != null && this.updateSecurityQuestion.Answer != ""
      && this.updateSecurityQuestion.Question != null && this.updateSecurityQuestion.Question != ""
      && this.updateSecurityQuestion.ConfiramationActive != null
    )
  }
  loadDefaults() {

    this.utilityService.AreaCodes()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.AreaCodes = resp.ListResult as AreaCode[];
        } else {
          this.AreaCodes = [];
        }
      },
        error => {
        });

  }
  private _filterAreaCode(value: string): string[] {
    if (value == "") {
      return ['Please enter 1 or more characters']
    }
    var _areaCodes = this.AreaCodes.filter(option => option.AreaCode?.includes(value));
    if (_areaCodes.length === 0) {
      return ['No Data Found']
    }
    return _areaCodes.map(value => value.AreaCode);
  }

  onSelectedPrimaryPhoneCode(code: string) {
    this.PatientProfile.HomePhone = code;
  }

  onSelectedCellPhoneCode(code: string) {
    this.PatientProfile.MobilePhone = code;
  }
  onSelectedWorkPhone(code: string) {
    this.PatientProfile.WorkPhone = code;
  }
  onSelectedEmergencyPhone(code: string) {
    this.PatientProfile.Phone = code;
  }
}

