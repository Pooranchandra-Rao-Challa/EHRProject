import { PatientSearchResults, SearchPatient } from './../../../_models/_provider/smart.scheduler.data';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { PatientSearch, PracticeLocation, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { PatientProfile, areaCodes } from 'src/app/_models/_patient/patientprofile';
import { ParticularInsuranceCompanyDetails, InsuranceDto, SecondaryInsurance } from 'src/app/_models/_provider/insurance';
import { DatePipe } from '@angular/common';
import { AreaCode } from 'src/app/_models/_admin/admins'
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { DataExtractorService } from 'mat-table-exporter';
import { I } from '@angular/cdk/keycodes';
import { MatInput } from '@angular/material/input';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
declare var $: any;
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  user: User;
  displaytitle: any;
  error: boolean = false;
  delete: boolean = false;
  data: boolean = true;
  cancel1: boolean = false;
  cancel2: boolean = false;
  viewpidetailsforprimary: boolean = false;
  viewpidetailsforsecondary: boolean = false;
  SourceOfPaymentTypologyCodes: any = [];
  InsurancePlanList: any = [];
  PatientDetails: ProviderPatient = {};
  insuranceList: any = [];
  InsuranceID: any;
  primaryInsurance: InsuranceDto = {} as InsuranceDto;
  secondaryInsurance: InsuranceDto = {} as InsuranceDto;
  insuraceComplanyPlan: ParticularInsuranceCompanyDetails;
  practiceLocation: PracticeLocation;
  secondaryInsurancelist: any;
  secondaryarry: any[];
  plusvalue: any;
  primaryplusicon: any;
  secondaryplusicon: any;
  btnstate: boolean = true;
  rowClicked: any
  arry: any
  selectingInsuranceCompanyName: any;
  selectingInsuranceCompanyPlanId: any
  InsuranceCompanyPlan: string;
  show: boolean;
  InsurancDetailslist: any = [];
  changedLocationId: string;
  isValid: boolean;
  primaryInsuranceType = "Primary";
  secondaryInsuranceType = "Secondary";
  addressVerfied: boolean = false;
  secondaryAdressVerfied = false;
  manuallybtn: boolean = false;
  disableaddressverification: boolean = false;
  secondarymanuallybtn: boolean;
  secondarydisableaddressverification: boolean;
  getInsurancePlanList: any;
  primaryInsDetail: boolean;
  secondaryInsDetail: boolean;
  SourceOfPaymentTypologyCodesFilter: any;
  secondarySptcFilter: any;
  searchText: string;
  @Input() max: any;
  tomorrow = new Date();
  sample: any
  AreaCodes: AreaCode[];
  filteredAreacodes: any
  myControlPrimary = new FormControl();
  minDateToPrimary = new Subject<string>();
  endDateForPrimary: Date;
  minDateToSecondary = new Subject<string>();
  endDateForSecondary: Date;
  hideSubscriber: boolean = false;
  dataRefreshing: boolean = false;

  dateChangeForPrimary(e) {
    this.minDateToPrimary.next(e.value.toString());
  }
  dateChangeForSecondary(e) {
    this.minDateToSecondary.next(e.value.toString());
  }
  constructor(private patientservice: PatientService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private accountservice: Accountservice,
    private utilityService: UtilityService,
    private datePipe: DatePipe) {

    this.insuraceComplanyPlan = {} as ParticularInsuranceCompanyDetails;
    this.user = authService.userValue;
    this.changedLocationId = this.user.CurrentLocation;
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDateToPrimary.subscribe(minDate => {
      this.endDateForPrimary = new Date(minDate);
    })
    this.minDateToSecondary.subscribe(minDate => {
      this.endDateForSecondary = new Date(minDate);
    })
  }

  ngOnInit(): void {
    this.dataRefreshing = true;
    this.getPatientDetails();
    this.getSourceOfPaymentTypologyCodesDD();
    this.InsuranceCompanyPlanList();
    this.getInsuranceList();
    this.loadDefaults();
    this.filteredAreacodes = this.myControlPrimary.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));

    if (this.searchPrimaryInsurancePatient != null)

      fromEvent(this.searchPrimaryInsurancePatient.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2)
        // Time in milliseconds between key events
        , debounceTime(1000)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe(value => this._filterPatients(value, 'primary'));

    if (this.searchSecondaryInsurancePatient != null)

      fromEvent(this.searchSecondaryInsurancePatient.nativeElement, 'keyup').pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        })
        // if character length greater then 2
        , filter(res => res.length > 2)
        // Time in milliseconds between key events
        , debounceTime(1000)
        // If previous query is diffent from current
        , distinctUntilChanged()
        // subscription for response
      ).subscribe(value => this._filterPatients(value, 'secondary'));
  }

  _filterPatients(term, filterfor) {
    this.isPrimaryInsuranceLoading = true;
    this.patientservice
      .PatientSearch({
        ProviderId: this.user.ProviderId,
        ClinicId: this.authService.userValue.ClinicId,
        SearchTerm: term
      })
      .subscribe(resp => {
        this.isPrimaryInsuranceLoading = false;
        if (resp.IsSuccess) {
          this.filteredPatients = of(
            resp.ListResult as PatientSearch[]);
        } else {
          this.filteredPatients = of([]);
          if (/^([a-zA-Z])\w+([\s]([a-zA-Z]*))*/.test(term)) {
            if (filterfor == 'primary')
              this.primaryInsurance.SubscriberName = term;
            else if (filterfor == 'secondary')
              this.secondaryInsurance.SubscriberName = term;
          }
        }
      })
  }

  displayPrimaryInsurancePatient(value: PatientSearch) {
    return value != null ? value.Name : "";

  }
  displaySecondaryInsurancePatient(value: PatientSearch) {
    return value != null ? value.Name : "";

  }
  disableAutoPrimary: boolean = false;
  disableAutoSecondary: boolean = false;
  onPrimaryInsurancePatientSelected($event) {
    Object.assign(this.primaryInsurancePatientSearch, $event.option.value);
    this.primaryInsurance.SubscriberName = this.primaryInsurancePatientSearch.Name
    this.primaryInsurance.DateOfBirth = this.datePipe.transform(this.primaryInsurancePatientSearch.Dob, "yyyy-MM-dd");
    this.primaryInsurance.Gender = this.primaryInsurancePatientSearch.Gender
    this.primaryInsurance.SubscriberId = this.primaryInsurancePatientSearch.PatientId;
    this.primaryInsurance.RelationshipToSubscriber = this.PatientDetails.PatientId === this.primaryInsurancePatientSearch.PatientId ? "Self" : "";
    this.patientservice.PatientProfile({ PatientId: this.primaryInsurancePatientSearch.PatientId })
      .subscribe(resp => {
        this.disableAutoPrimary = false;
        if (resp.IsSuccess) {
          let profile = resp.Result as PatientProfile;
          this.primaryInsurance.StreetAddress = profile.StreetAddress;
          this.primaryInsurance.City = profile.city;
          this.primaryInsurance.State = profile.state;
          this.primaryInsurance.Zip = profile.zip;
          this.disableAutoPrimary = profile.StreetAddress != null && profile.city != null && profile.state != null && profile.zip != null;;
        }
      });

  }

  onSecondaryInsurancePatientSelected($event) {
    Object.assign(this.secondaryInsurancePatientSearch, $event.option.value);
    this.secondaryInsurance.SubscriberName = this.secondaryInsurancePatientSearch.Name
    this.secondaryInsurance.DateOfBirth = this.datePipe.transform(this.secondaryInsurancePatientSearch.Dob, "yyyy-MM-dd");
    this.secondaryInsurance.Gender = this.secondaryInsurancePatientSearch.Gender;
    this.secondaryInsurance.SubscriberId = this.secondaryInsurancePatientSearch.PatientId;
    this.secondaryInsurance.RelationshipToSubscriber = this.PatientDetails.PatientId === this.secondaryInsurancePatientSearch.PatientId ? "Self" : "";
    this.patientservice.PatientProfile({ PatientId: this.primaryInsurancePatientSearch.PatientId })
      .subscribe(resp => {
        this.disableAutoSecondary = false;

        if (resp.IsSuccess) {
          let profile = resp.Result as PatientProfile
          this.primaryInsurance.StreetAddress = profile.StreetAddress;
          this.primaryInsurance.City = profile.city;
          this.primaryInsurance.State = profile.state;
          this.primaryInsurance.Zip = profile.zip;
          this.disableAutoSecondary = profile.StreetAddress != null && profile.city != null && profile.state != null && profile.zip != null;
        }
      });
  }

  isPrimaryInsuranceLoading: boolean = false;
  isSecondaryInsuranceLoading: boolean = false;
  @ViewChild('searchPrimaryInsurancePatient', { static: true })
  searchPrimaryInsurancePatient: ElementRef;
  filteredPatients: Observable<PatientSearch[]>;

  @ViewChild('searchSecondaryInsurancePatient', { static: true })
  searchSecondaryInsurancePatient: ElementRef;

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
    this.insuraceComplanyPlan.Phone = code;
  }

  AddInsuranceCompanyPlan() {
    this.insuraceComplanyPlan = new ParticularInsuranceCompanyDetails;
    this.data = false;
    this.isValid = true;
    this.delete = false;
    this.cancel2 = true;

  }
  cancel() {
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
    this.btnstate = true;
    this.rowClicked = -1;
    this.InsuranceCompanyPlanList();
    this.searchText = "";

  }


  edit(event, idx) {
    // this.arry.push(this.InsurancePlanList[idx]);
    this.isValid = true;
    this.delete = true;
    this.data = false;
    this.cancel2 = true
    this.rowClicked != event
  }

  primaryinsurancedetails() {
    this.isValid = true;
    this.delete = true;
    this.data = false;
    this.cancel1 = true;
    this.getInsuranceDetail(this.insuraceComplanyPlan)
  }

  changeTableRowColor(item, idx, event) {
    // this.arry = [];
    this.rowClicked = idx;
    this.selectingInsuranceCompanyName = item.InsuranceCompanyName;
    this.selectingInsuranceCompanyPlanId = item.InsuranceCompanyId;
    this.btnstate = event;

  }
  resetTheInsurancePlansContentScrollPosition() {
    let aa = document.getElementsByClassName("insurancePlansContent");
    if (aa.length == 1) {
      aa[0].scrollTop = 0;
    }
  }
  primaryplus(item) {
    this.plusvalue = item;
    this.rowClicked = -1;
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
    this.resetTheInsurancePlansContentScrollPosition()
    this.InsuranceCompanyPlanList();
    (this.InsurancePlanList as []).forEach((element:any,index: number,values: any[]) => {
      if(element.InsuranceCompanyId == this.primaryInsurance.InsuranceCompanyPlanID
        || element.InsuranceCompanyId == this.selectingInsuranceCompanyPlanId){
        this.changeTableRowColor(element,index,true);
      }
    });
  }
  secondaryplus(item) {

    this.plusvalue = item;
    this.rowClicked = -1;
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
    this.resetTheInsurancePlansContentScrollPosition();
    this.InsuranceCompanyPlanList();
    (this.InsurancePlanList as []).forEach((element:any,index: number,values: any[]) => {
      if(element.InsuranceCompanyId == this.secondaryInsurance.InsuranceCompanyPlanID
        || element.InsuranceCompanyId == this.selectingInsuranceCompanyPlanId ){
        this.changeTableRowColor(element,index,true);
      }
    });
  }
  Selected() {
    if (this.plusvalue == "primary") {
      this.primaryInsurance.InsuranceCompanyPlan = this.selectingInsuranceCompanyName;
      this.primaryInsurance.InsuranceCompanyPlanID = this.selectingInsuranceCompanyPlanId;
      this.viewpidetailsforprimary = false;
      this.searchText = "";

    }
    else {
      this.secondaryInsurance.InsuranceCompanyPlan = this.selectingInsuranceCompanyName;
      this.secondaryInsurance.InsuranceCompanyPlanID = this.selectingInsuranceCompanyPlanId;
      this.viewpidetailsforsecondary = false;
      this.searchText = "";

    }
  }


  BenefitRenewalDD: any[] = [
    { value: 'Jan', viewValue: 'Jan' },
    { value: 'Feb', viewValue: 'Feb' },
    { value: 'Mar', viewValue: 'Mar' },
    { value: 'Apr', viewValue: 'Apr' },
    { value: 'May', viewValue: 'May' },
    { value: 'Jun', viewValue: 'Jun' },
    { value: 'Jul', viewValue: 'Jul' },
    { value: 'Aug', viewValue: 'Aug' },
    { value: 'Sep', viewValue: 'Sep' },
    { value: 'Oct', viewValue: 'Oct' },
    { value: 'Nov', viewValue: 'Nov' },
    { value: 'Dec', viewValue: 'Dec' },
  ];

  // SourceOfPaymentTypologyCodes dropdown
  getSourceOfPaymentTypologyCodesDD() {
    this.patientservice.SourceOfPaymentTypologyCodes().subscribe(resp => {
      if (resp.IsSuccess) {
        this.SourceOfPaymentTypologyCodes = resp.ListResult;
        this.SourceOfPaymentTypologyCodes = this.SourceOfPaymentTypologyCodes.map((obj) => ({
          Code: obj.Code,
          Description: obj.Description,
          CodeDescription: obj.Code + ' - ' + obj.Description
        }));
        this.SourceOfPaymentTypologyCodesFilter = this.SourceOfPaymentTypologyCodes.slice();
        this.secondarySptcFilter = this.SourceOfPaymentTypologyCodes.slice();
        if (this.primaryInsurance.SourceOfPaymentTypology) {
          let data = this.primaryInsurance.SourceOfPaymentTypology;
          let SourceOfPaymentTypologyCodes = this.SourceOfPaymentTypologyCodes.find(x => x.Code == data);
          this.primaryInsurance.SourceOfPaymentTypology = SourceOfPaymentTypologyCodes.Code;
          this.primaryInsurance.PaymentTypologyDescription = SourceOfPaymentTypologyCodes.Description;
        }
      }
    })
  }

  InsuranceCompanyPlanList() {
    this.patientservice.InsuranceCompanyPlans(this.authService.userValue.ClinicId).subscribe(
      resp => {

        this.InsurancePlanList = resp.ListResult;
        this.getInsurancePlanList = this.InsurancePlanList;
        this.secondaryInsurancelist = resp.ListResult;

      })
  }

  // get patient id
  getPatientDetails() {
    this.PatientDetails = this.authService.viewModel.Patient;
  }

  primaryInsurancePatientSearch: PatientSearch = {};
  secondaryInsurancePatientSearch: PatientSearch = {};
  updateSearchTermInsurance(source: InsuranceDto, destination: PatientSearch) {
    destination.Name = source.SubscriberName;
    destination.Dob = new Date(source.DateOfBirth);
    destination.Gender = source.Gender;
  }
  // get patient details by id
  getInsuranceList() {

    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    this.patientservice.Insurance(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.insuranceList = resp.ListResult;
        let insuraceData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Primary')
        );
        this.primaryInsurance = insuraceData.length > 0 ? insuraceData[0] as InsuranceDto : {};
        this.primaryInsurance.StartDate = this.datePipe.transform(this.primaryInsurance.StartDate, "yyyy-MM-dd");
        this.primaryInsurance.DateOfBirth = this.datePipe.transform(this.primaryInsurance.DateOfBirth, "yyyy-MM-dd");
        this.primaryInsurance.EndDate = this.datePipe.transform(this.primaryInsurance.EndDate, "yyyy-MM-dd");
        this.endDateForPrimary = new Date(this.primaryInsurance.StartDate);

        insuraceData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Secondary')
        )
        this.secondaryInsurance = insuraceData.length > 0 ? insuraceData[0] as SecondaryInsurance : {};
        this.secondaryInsurance = this.secondaryInsurance == undefined ? {} : this.secondaryInsurance;
        if (this.secondaryInsurance != undefined) {
          this.secondaryInsurance.StartDate = this.datePipe.transform(this.secondaryInsurance.StartDate, "yyyy-MM-dd");
          this.secondaryInsurance.DateOfBirth = this.datePipe.transform(this.secondaryInsurance.DateOfBirth, "yyyy-MM-dd");
          this.secondaryInsurance.EndDate = this.datePipe.transform(this.secondaryInsurance.EndDate, "yyyy-MM-dd");
          this.endDateForSecondary = new Date(this.secondaryInsurance.StartDate);

        }
        this.updateSearchTermInsurance(this.primaryInsurance, this.primaryInsurancePatientSearch);
        this.updateSearchTermInsurance(this.secondaryInsurance, this.secondaryInsurancePatientSearch);
        this.dataRefreshing = false;
      } else {
        this.primaryInsurance = {};
        this.secondaryInsurance = {};
        this.dataRefreshing = false;
      }

    });
  }

  updateSelfInsurance(soruce,insuranceType: string) {

    if(soruce.value.toLowerCase() == 'self'){
      this.patientservice.PatientProfile({PatientId: this.PatientDetails.PatientId}).subscribe((resp) =>{
        let patient = resp.Result as PatientProfile
        if (insuranceType == 'primary') {
          this.primaryInsurance.SubscriberName = `${patient.FirstName}${patient.MiddleName != null ? ' ' + patient.MiddleName : ''} ${patient.LastName}`;
          this.primaryInsurance.DateOfBirth = this.datePipe.transform(patient?.Dob, "yyyy-MM-dd");
          this.primaryInsurance.Gender = patient.Gender;
          this.primaryInsurance.SubscriberId = patient.PatientId;
          this.primaryInsurance.StreetAddress = patient.StreetAddress;
          this.primaryInsurance.City = patient.city;
          this.primaryInsurance.State = patient.state;
          this.primaryInsurance.Zip = patient.zip;
        } else if (insuranceType == 'secondary') {
          this.secondaryInsurance.SubscriberName = `${patient.FirstName}${patient.MiddleName != null ? ' ' + patient.MiddleName : ''} ${patient.LastName}`;
          this.secondaryInsurance.DateOfBirth = this.datePipe.transform(patient.Dob, "yyyy-MM-dd");
          this.secondaryInsurance.Gender = patient.Gender;
          this.secondaryInsurance.SubscriberId = patient.PatientId;
          this.secondaryInsurance.StreetAddress = patient.StreetAddress;
          this.secondaryInsurance.City = patient.city;
          this.secondaryInsurance.State = patient.state;
          this.secondaryInsurance.Zip = patient.zip;
        }
      });


    }else{
      if (insuranceType == 'primary') {
        this.primaryInsurance.SubscriberName = null;
        this.primaryInsurance.DateOfBirth = null;
        this.primaryInsurance.Gender = null;
        this.primaryInsurance.SubscriberId = null;
        this.primaryInsurance.StreetAddress =  null;
        this.primaryInsurance.City =  null;
        this.primaryInsurance.State =  null;
        this.primaryInsurance.Zip =  null;
      } else if (insuranceType == 'secondary') {
        this.secondaryInsurance.SubscriberName = null;
        this.secondaryInsurance.DateOfBirth = null;
        this.secondaryInsurance.Gender = null;
        this.secondaryInsurance.SubscriberId = null;
        this.secondaryInsurance.StreetAddress = null;
        this.secondaryInsurance.City = null;
        this.secondaryInsurance.State = null;
        this.secondaryInsurance.Zip = null;
      }

    }

  }
  getInsuranceDetails(item) {
    if (item == 'primary') {
      var reqparam = {
        "InsuranceId": this.primaryInsurance.InsuranceCompanyPlanID
      }
      this.patientservice.InsurancDetails(reqparam).subscribe(
        resp => {
          this.InsurancDetailslist = resp.ListResult;

          this.insuraceComplanyPlan = resp.ListResult[0];
        });
      this.primaryInsDetail = true;
      this.secondaryInsDetail = false;
    }
    else {
      var reqparam = {
        "InsuranceId": this.secondaryInsurance.InsuranceCompanyPlanID
      }
      this.patientservice.InsurancDetails(reqparam).subscribe(
        resp => {
          this.InsurancDetailslist = resp.ListResult;
          this.insuraceComplanyPlan = resp.ListResult[0];
        });
      this.primaryInsDetail = false;
      this.secondaryInsDetail = true;
    }
  }

  getInsuranceDetail(item) {
    this.insuraceComplanyPlan.InsuranceCompanyId = item.InsuranceCompanyId;
    this.insuraceComplanyPlan.PlanType = item.PlanType
    this.insuraceComplanyPlan.InsuranceCompanyName = item.InsuranceCompanyName;
    this.insuraceComplanyPlan.GroupPlan = item.GroupPlan
    this.insuraceComplanyPlan.Employer = item.Employer
    this.insuraceComplanyPlan.Address
    this.insuraceComplanyPlan.StreetAddress = item.StreetAddress;
    this.insuraceComplanyPlan.City = item.City;
    this.insuraceComplanyPlan.State = item.State;
    this.insuraceComplanyPlan.Zip = item.Zip;
    this.insuraceComplanyPlan.Contact = item.Contact
    this.insuraceComplanyPlan.BenfitRenewal = item.BenfitRenewal
    this.insuraceComplanyPlan.GroupNo = item.GroupNo
    this.insuraceComplanyPlan.LocalNo = item.LocalNo
    this.insuraceComplanyPlan.PayerID = item.PayerID
    // this.insuraceComplanyPlan.LocationId;
    if (item.Phone == null) {
      this.insuraceComplanyPlan.PhonePreffix = '';
      this.insuraceComplanyPlan.PhoneSuffix = '';
    }
    else {
      let list = item.Phone.split('+1');
      this.insuraceComplanyPlan.PhonePreffix = list[1].slice(0, 3);
      this.insuraceComplanyPlan.PhoneSuffix = list[1].slice(3, 10);
    }
  }

  CreateUpdateInsuraceCompanyPlan(insuraceComplanyPlan: ParticularInsuranceCompanyDetails) {
    let isAdd = insuraceComplanyPlan?.InsuranceCompanyId == "";
    insuraceComplanyPlan.Phone = '+1' + this.insuraceComplanyPlan.PhonePreffix + this.insuraceComplanyPlan.PhoneSuffix;
    insuraceComplanyPlan.LocationId = this.changedLocationId;
    this.patientservice.CreateUpdateInsuranceCompanyPlan(insuraceComplanyPlan).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI001" : "M2CI002"]);
        this.getInsuranceList();
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI001"]);
      }
    });

  }

  deleteInsurancePlan() {
    this.patientservice.DeleteInsuranceCampanyplan(this.insuraceComplanyPlan).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CI003"]);
      }
    });
    this.InsuranceCompanyPlanList();
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
    this.searchText = '';
  }

  CreateUpdateInsuranceDetails(item) {
    if (item == "primary") {

      let isAdd = this.primaryInsurance.InsuranceId == undefined;

      //this.primaryInsurance.SubscriberName = this.primaryInsurancePatientSearch.Name;
      this.primaryInsurance.ProviderId = this.user.ProviderId;
      this.primaryInsurance.PatientId = this.PatientDetails.PatientId;
      this.primaryInsurance.LocationId = this.changedLocationId;
      this.primaryInsurance.InsuranceType = this.primaryInsuranceType;
      this.primaryInsurance.DateOfBirth = this.datePipe.transform(this.primaryInsurance.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
      this.primaryInsurance.StartDate = this.datePipe.transform(this.primaryInsurance.StartDate, "MM/dd/yyyy hh:mm:ss a");
      this.primaryInsurance.EndDate = this.datePipe.transform(this.primaryInsurance.EndDate, "MM/dd/yyyy hh:mm:ss a");

      this.patientservice.CreateUpdateInsuranceDetails(this.primaryInsurance).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.getInsuranceList();
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI004" : "M2CI005"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI002"]);
        }
      })
      this.manuallybtn = false;
      this.disableaddressverification = false;
      this.addressVerfied = false;
    }
    else {

      let isAdd = this.secondaryInsurance.InsuranceId == undefined;

      this.secondaryInsurance.ProviderId = this.user.ProviderId;
      this.secondaryInsurance.PatientId = this.PatientDetails.PatientId;
      this.secondaryInsurance.LocationId = this.changedLocationId;
      this.secondaryInsurance.InsuranceType = this.secondaryInsuranceType;
      this.secondaryInsurance.DateOfBirth = this.datePipe.transform(this.secondaryInsurance.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
      this.secondaryInsurance.StartDate = this.datePipe.transform(this.secondaryInsurance.StartDate, "MM/dd/yyyy hh:mm:ss a");
      this.secondaryInsurance.EndDate = this.datePipe.transform(this.secondaryInsurance.EndDate, "MM/dd/yyyy hh:mm:ss a");

      this.patientservice.CreateUpdateInsuranceDetails(this.secondaryInsurance).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.getInsuranceList();
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI006" : "M2CI007"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI003"]);
        }
      })
      this.secondarymanuallybtn = false;
      this.secondarydisableaddressverification = false;
      this.secondaryAdressVerfied = false;
    }
  }

  AddressVerification() {
    this.accountservice.VerifyAddress(this.primaryInsurance.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.primaryInsurance.City = resp.Result.components.city_name
        this.primaryInsurance.State = resp.Result.components.state_abbreviation
        this.primaryInsurance.StreetAddress = resp.Result.delivery_line_1
        this.primaryInsurance.Zip = resp.Result.components.zipcode
        this.primaryInsurance.Street = "";
        this.addressVerfied = true;
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CI008"]);

      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI004"])
      }
    });
  }

  enableManualEntry() {
    this.manuallybtn = true;
    this.clearAddress();
  }

  clearAddress() {
    this.primaryInsurance.Street = "";
    this.primaryInsurance.City = ""
    this.primaryInsurance.State = ""
    this.primaryInsurance.StreetAddress = ""
    this.primaryInsurance.Zip = ""
  }

  secondaryclearAddress() {
    this.secondaryInsurance.Street = "";
    this.secondaryInsurance.City = ""
    this.secondaryInsurance.State = ""
    this.secondaryInsurance.StreetAddress = ""
    this.secondaryInsurance.Zip = ""
  }

  enterAddressManually(item) {
    this.disableaddressverification = true;
  }

  secondaryAddressverfied() {
    this.accountservice.VerifyAddress(this.secondaryInsurance.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.secondaryInsurance.City = resp.Result.components.city_name
        this.secondaryInsurance.State = resp.Result.components.state_abbreviation
        this.secondaryInsurance.StreetAddress = resp.Result.delivery_line_1
        this.secondaryInsurance.Zip = resp.Result.components.zipcode
        this.secondaryInsurance.Street = "";
        this.secondaryAdressVerfied = true;
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CI009"]);
      }
      else {
        this.secondarymanuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI005"])
      }
    });
  }

  secondaryenableManualEntry() {
    this.secondarymanuallybtn = true;
    this.secondaryclearAddress();
  }
  secondaryenterAddressManually(item) {
    this.secondarydisableaddressverification = true;
  }

  primaryspt(item) {

    this.primaryInsurance.SourceOfPaymentTypology = item.Code;
    this.primaryInsurance.PaymentTypologyDescription = item.Description;
  }
  secondaryspt(item) {
    this.secondaryInsurance.SourceOfPaymentTypology = item.Code;
    this.secondaryInsurance.PaymentTypologyDescription = item.Description;
  }
  enableSave() {
    return !(
      this.insuraceComplanyPlan.PlanType != null && this.insuraceComplanyPlan.PlanType != ""
      && this.insuraceComplanyPlan.InsuranceCompanyName != null && this.insuraceComplanyPlan.InsuranceCompanyName != ""
    )


  }
  primaryenableSave() {
    return !(this.primaryInsurance.SubscriberName != null && this.primaryInsurance.SubscriberName != ""
      && this.primaryInsurance.DateOfBirth != null && this.primaryInsurance.DateOfBirth != ""
      && this.primaryInsurance.Gender != null && this.primaryInsurance.Gender != ""
      && this.primaryInsurance.StreetAddress != null && this.primaryInsurance.StreetAddress != ""
      && this.primaryInsurance.City != null && this.primaryInsurance.City != ""
      && this.primaryInsurance.State != null && this.primaryInsurance.State != ""
      && this.primaryInsurance.Zip != null && this.primaryInsurance.Zip != ""
      && this.primaryInsurance.InsuranceCompanyPlanID != null && this.primaryInsurance.InsuranceCompanyPlanID != ""
      && this.primaryInsurance.InsuranceCompanyPlan != null && this.primaryInsurance.InsuranceCompanyPlan != ""
      && this.primaryInsurance.RelationshipToSubscriber != null && this.primaryInsurance.RelationshipToSubscriber != ""
      && this.primaryInsurance.SourceOfPaymentTypology != null && this.primaryInsurance.SourceOfPaymentTypology != ""
      && this.primaryInsurance.StartDate != null && this.primaryInsurance.StartDate != ""
    )
  }
  secondaryenableSave() {
    return !(this.secondaryInsurance.SubscriberName != null && this.secondaryInsurance.SubscriberName != ""
      && this.secondaryInsurance.DateOfBirth != null && this.secondaryInsurance.DateOfBirth != ""
      && this.secondaryInsurance.Gender != null && this.secondaryInsurance.Gender != ""
      && this.secondaryInsurance.StreetAddress != null && this.secondaryInsurance.StreetAddress != ""
      && this.secondaryInsurance.City != null && this.secondaryInsurance.City != ""
      && this.secondaryInsurance.State != null && this.secondaryInsurance.State != ""
      && this.secondaryInsurance.Zip != null && this.secondaryInsurance.Zip != ""
      && this.secondaryInsurance.InsuranceCompanyPlanID != null && this.secondaryInsurance.InsuranceCompanyPlanID != ""
      && this.secondaryInsurance.InsuranceCompanyPlan != null && this.secondaryInsurance.InsuranceCompanyPlan != ""
      && this.secondaryInsurance.RelationshipToSubscriber != null && this.secondaryInsurance.RelationshipToSubscriber != ""
      && this.secondaryInsurance.SourceOfPaymentTypology != null && this.secondaryInsurance.SourceOfPaymentTypology != ""
      && this.secondaryInsurance.StartDate != null && this.secondaryInsurance.StartDate != ""
    )
  }
}

