import { PatientNavbarComponent } from './../_navigations/patient.navbar/patient.navbar.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { areaCodes, PatientProfile, PatientProfileSecurityQuestion } from './../_models/_patient/patientprofile';
import { PatientService } from 'src/app/_services/patient.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { User } from '../_models';
import { ActivatedRoute } from '@angular/router';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';
import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { UtilityService } from '../_services/utiltiy.service';
import { Accountservice } from '../_services/account.service';



@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  user: User;
  myControl = new FormControl();
  PatientProfile: PatientProfile = {};
  patientProfileSecurityQuestion:PatientProfileSecurityQuestion ={}
  updateSecurityQuestion:PatientProfileSecurityQuestion = {}
  patietnprofile: any
  // options: string[] = ['501', '502', '401', '402', '601', '603'];
  filteredOptions: Observable<string[]>;
  // filteredProcedures: Observable<MedicalCode[]>;

  filterNumbers: any;
  SourceData: any[];
  searchCellPhoneData:any[];
  searchHomePhoneData:any[];
  searchWorkPhoneData:any[];
  searchPhoneData:any[];
  @ViewChild('searchCellPhone', { static: true }) searchCellPhone: ElementRef;
  @ViewChild('searchHomePhone', { static: true }) searchHomePhone: ElementRef;
  @ViewChild('searchWorkPhone', { static: true }) searchWorkPhone: ElementRef;
  @ViewChild('searchPhone', { static: true }) searchPhone: ElementRef;

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
GenderData:any=[
  { Id: '1', value: 'male' },
  { Id: '2', value: 'female' },
  { Id: '3', value: 'other' },

]
addressVerfied:boolean = false;
manuallybtn:boolean = false;
disableaddressverification:boolean =false;
emergencyAdressVerfied:boolean = false;
emergencyManuallybtn:boolean = false;
emergencydisableaddressverification:boolean = false;
  constructor(private patientService: PatientService,private authenticationService: AuthenticationService,private alertmsg: AlertMessage,
    private PatientNavbar:PatientNavbarComponent, private accountservice: Accountservice,
    private utilityService: UtilityService,) {
    this.user = authenticationService.userValue;
    this.searchCellPhoneData=[];
    this.searchHomePhoneData=[];
    this.searchWorkPhoneData=[];
    this.searchPhoneData=[];
  }

  ngOnInit(): void {
    this.getPatientProfile();
    this._filterAreaCodes();
    this.events();

  }

  getPatientProfile(reqparam?) {

    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
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
    this.patientService.UpdateEmergencyContact(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP003"]);
      }
    });
  }


  // private _filter(value: string): string[] {
  //   if (value == "") {
  //     return ['Please enter 1 or more characters']
  //   }
  //   const filterValue = value.toLowerCase();
  //   var searchData = this.options.filter(option => option.toLowerCase().includes(filterValue));
  //   if (searchData.length === 0) {
  //     return ['No Data Found']
  //   }
  //   return searchData;
  // }

events(){
  fromEvent(this.searchCellPhone.nativeElement, 'keyup').pipe(
    map((event: any) => {
      return event.target.value;
    })
    , filter(res => res.length < 4)
    , debounceTime(50)
    , distinctUntilChanged()
  ).subscribe(value =>
    this.searchCellPhoneData=this.filterData(value));


    fromEvent(this.searchHomePhone.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res =>res.length < 4)
      , debounceTime(50)
      , distinctUntilChanged()
    ).subscribe(value =>{
      this.searchHomePhoneData=this.filterData(value);
    }
      );


      fromEvent(this.searchWorkPhone.nativeElement, 'keyup').pipe(
        map((event: any) => {
          return event.target.value;
        })
        , filter(res => res.length > 1 && res.length < 8)
        , debounceTime(500)
        , distinctUntilChanged()
      ).subscribe(value =>
        this.searchWorkPhoneData=this.filterData(value));

        fromEvent(this.searchPhone.nativeElement, 'keyup').pipe(
          map((event: any) => {
            return event.target.value;
          })
          , filter(res => res.length > 1 && res.length < 8)
          , debounceTime(500)
          , distinctUntilChanged()
        ).subscribe(value =>
          this.searchPhoneData=this.filterData(value));
}
  displayWith(value: areaCodes): string {
    if (!value) return "";
    return value.areaCode;
  }

  _filterAreaCodes() {
    this.utilityService.AreaCodes()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.SourceData=resp.ListResult;
        } else {
          this.filterNumbers=of([]);
          this.SourceData = [];
        }
      },
      error=>{
      })
  }
  //filter city on search text
  filterData(searchText: string) {
    if(searchText==''){
      return [];
    }
    var searchData = this.SourceData.filter(x => (((x.areaCode).toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)));
    return searchData
  }
getpatientsecurityQuestions()
{
  var req={
    "PatientId": this.user.PatientId,
  }
  this.patientService.MyProfileSecurityQuestion(req).subscribe(
    resp=>
    {
    if(resp.IsSuccess)
    {
      this.patientProfileSecurityQuestion = resp.ListResult[0]
    }
  }
  )
this.updateSecurityQuestion = new PatientProfileSecurityQuestion();
}
ChangeSecurityQuestion(item)
{
  this.updateSecurityQuestion.SecurityID = this.patientProfileSecurityQuestion.SecurityID;
  this.updateSecurityQuestion.PateientId = this.patientProfileSecurityQuestion.PateientId;
  this.patientService.UpdatePatientMyProfileSecurityQuestion(this.updateSecurityQuestion).subscribe(

      resp=>{
        if(resp.IsSuccess)
        {
           this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP009"])
        }
        else
        {
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
    && this.updateSecurityQuestion.ConfiramationActive !=null
   )


}
}

