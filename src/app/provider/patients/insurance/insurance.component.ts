import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { PracticeLocation, User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { areaCodes } from 'src/app/_models/_patient/patientprofile';
import { ParticularInsuranceCompanyDetails, PrimaryInsurance, SecondaryInsurance } from 'src/app/_models/_provider/insurance';
import { DatePipe } from '@angular/common';
import { AreaCode } from 'src/app/_models/_admin/Admins';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { DataExtractorService } from 'mat-table-exporter';
import { I } from '@angular/cdk/keycodes';
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
  viewpidetailsforprimary: boolean = true;
  viewpidetailsforsecondary: boolean = true;
  SourceOfPaymentTypologyCodes: any = [];
  InsurancePlanList: any = [];
  PatientDetails: any = [];
  insuranceList: any = [];
  InsuranceID: any;
  primlist: PrimaryInsurance = {} as PrimaryInsurance;
  secList: SecondaryInsurance = {} as SecondaryInsurance;
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
  sample : any
  AreaCodes: AreaCode[];
  filteredAreacodes: any
  myControlPrimary = new FormControl();
  minDateToPrimary = new Subject<string>();
  endDateForPrimary: Date;
  minDateToSecondary = new Subject<string>();
  endDateForSecondary: Date;

  dateChangeForPrimary(e) {
    this.minDateToPrimary.next(e.value.toString());
  }
  dateChangeForSecondary(e)
  {
    this.minDateToSecondary.next(e.value.toString());
  }
  constructor(private patientservice: PatientService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private accountservice: Accountservice, private utilityService: UtilityService, private datePipe: DatePipe) {
    this.primlist = {} as PrimaryInsurance;
    this.secList = {} as SecondaryInsurance;
    this.insuraceComplanyPlan = {} as ParticularInsuranceCompanyDetails;
    this.user = authService.userValue;
    this.changedLocationId = this.user.CurrentLocation;
    this.InsuranceCompanyPlanList();
    this.tomorrow.setDate(this.tomorrow.getDate());
    this.minDateToPrimary.subscribe(minDate => {
      this.endDateForPrimary = new Date(minDate);
    })
    this.minDateToSecondary.subscribe(minDate=>
      {
        this.endDateForSecondary = new Date(minDate);
      })
  }

  ngOnInit(): void {

    this.getPatientDetails();
    this.getSourceOfPaymentTypologyCodesDD();
    this.InsuranceCompanyPlanList();
    this.getInsuranceList();
    this.loadDefaults();
    this.filteredAreacodes = this.myControlPrimary.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    //   $('#modal-primary-Insurance').on('shown', function () {
    //     $(".divScroll").scrollTop(0);
    // });
    //   var scrollPos = 0;
    // $('.modal')
    // .on('show.bs.modal', function (){
    // scrollPos = $('.divScroll').scrollTop();
    // $('body').css({
    // overflow: 'hidden',
    // position: '',
    // top : -scrollPos
    // });
    // })
    // .on('hide.bs.modal', function (){
    // $('body').css({
    // overflow: '',
    // position: '',
    // top: ''
    // }).scrollTop(scrollPos);
    // });
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
  resetTheInsurancePlansContentScrollPosition(){
    let aa = document.getElementsByClassName("insurancePlansContent");
    if(aa.length == 1){
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
  }
  Selected() {
    if (this.plusvalue == "primary") {
      this.primlist.InsuranceCompanyPlan = this.selectingInsuranceCompanyName;
      this.primlist.InsuranceCompanyPlanID = this.selectingInsuranceCompanyPlanId;
      this.viewpidetailsforprimary = false;
      this.searchText = "";

    }
    else {
      this.secList.InsuranceCompanyPlan = this.selectingInsuranceCompanyName;
      this.secList.InsuranceCompanyPlanID = this.selectingInsuranceCompanyPlanId;
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
        if (this.primlist.SourceOfPaymentTypology! = "") {
          let data = this.primlist.SourceOfPaymentTypology;
          let SourceOfPaymentTypologyCodes = this.SourceOfPaymentTypologyCodes.find(x => x.Code == data);
          this.primlist.SourceOfPaymentTypology = SourceOfPaymentTypologyCodes.Code;
          this.primlist.PaymentTypologyDescription = SourceOfPaymentTypologyCodes.Description;
        }
      }
    })
  }

  InsuranceCompanyPlanList() {
    this.patientservice.InsuranceCompanyPlans().subscribe(
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

  // get patient details by id
  getInsuranceList() {

    var reqparam = {
      "PatientId": this.PatientDetails.PatientId
    }
    this.patientservice.Insurance(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.insuranceList = resp.ListResult;
        let primarydata = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Primary')
        );
        this.primlist = primarydata[0];
        this.primlist.StartDate = this.datePipe.transform(this.primlist.StartDate, "yyyy-MM-dd");
        this.primlist.DateOfBirth = this.datePipe.transform(this.primlist.DateOfBirth, "yyyy-MM-dd");
        this.primlist.EndDate = this.datePipe.transform(this.primlist.EndDate, "yyyy-MM-dd");
        this.endDateForPrimary = new Date(this.primlist.StartDate);
        let secondaryData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Secondary')
        )
        this.secList = secondaryData[0];
        this.secList = this.secList == undefined ? {} : this.secList;
        if (this.secList != undefined) {
          this.secList.StartDate = this.datePipe.transform(this.secList.StartDate, "yyyy-MM-dd");
          this.secList.DateOfBirth = this.datePipe.transform(this.secList.DateOfBirth, "yyyy-MM-dd");
          this.secList.EndDate = this.datePipe.transform(this.secList.EndDate, "yyyy-MM-dd");
          this.endDateForSecondary = new Date(this.secList.StartDate);

        }
      }
    });
  }

  getInsuranceDetails(item) {
    if (item == 'primary') {
      var reqparam = {
        "InsuranceId": this.primlist.InsuranceCompanyPlanID
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
        "InsuranceId": this.secList.InsuranceCompanyPlanID
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

  // getInsuranceDetail(item) {
  //   var reqparam = {
  //     "InsuranceId": item.InsuranceCompanyId
  //   }
  //   if (item.Phone == null) {
  //     this.insuraceComplanyPlan.PhonePreffix = '';
  //     this.insuraceComplanyPlan.PhoneSuffix = '';
  //   }
  //   else {
  //     let list = item.primary_phone.split('+1');
  //     this.insuraceComplanyPlan.PhonePreffix = list[1].slice(0, 3);
  //     this.insuraceComplanyPlan.PhoneSuffix = list[1].slice(3, 10);
  //   }
  //   this.patientservice.InsurancDetails(reqparam).subscribe(
  //     resp => {
  //       let InsurancDetailslist = resp.ListResult;
  //       this.insuraceComplanyPlan = resp.ListResult[0];
  //     }
  //   )
  // }
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

      let isAdd = this.primlist.InsuranceId == undefined;

      this.primlist.ProviderId = this.user.ProviderId;
      this.primlist.PatientId = this.PatientDetails.PatientId;
      this.primlist.LocationId = this.changedLocationId;
      this.primlist.InsuranceType = this.primaryInsuranceType;
      this.primlist.DateOfBirth = this.datePipe.transform(this.primlist.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
      this.primlist.StartDate = this.datePipe.transform(this.primlist.StartDate, "MM/dd/yyyy hh:mm:ss a");
      this.primlist.EndDate = this.datePipe.transform(this.primlist.EndDate, "MM/dd/yyyy hh:mm:ss a");

      this.patientservice.CreateUpdateInsuranceDetails(this.primlist).subscribe((resp) => {
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

      let isAdd = this.secList.InsuranceId == undefined;

      this.secList.ProviderId = this.user.ProviderId;
      this.secList.PatientId = this.PatientDetails.PatientId;
      this.secList.LocationId = this.changedLocationId;
      this.secList.InsuranceType = this.secondaryInsuranceType;
      this.secList.DateOfBirth = this.datePipe.transform(this.secList.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
      this.secList.StartDate = this.datePipe.transform(this.secList.StartDate, "MM/dd/yyyy hh:mm:ss a");
      this.secList.EndDate = this.datePipe.transform(this.secList.EndDate, "MM/dd/yyyy hh:mm:ss a");

      this.patientservice.CreateUpdateInsuranceDetails(this.secList).subscribe((resp) => {
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
    this.accountservice.VerifyAddress(this.primlist.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.primlist.City = resp.Result.components.city_name
        this.primlist.State = resp.Result.components.state_abbreviation
        this.primlist.StreetAddress = resp.Result.delivery_line_1
        this.primlist.Zip = resp.Result.components.zipcode
        this.primlist.Street = "";
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
    this.primlist.Street = "";
    this.primlist.City = ""
    this.primlist.State = ""
    this.primlist.StreetAddress = ""
    this.primlist.Zip = ""
  }

  secondaryclearAddress() {
    this.secList.Street = "";
    this.secList.City = ""
    this.secList.State = ""
    this.secList.StreetAddress = ""
    this.secList.Zip = ""
  }

  enterAddressManually(item) {
    this.disableaddressverification = true;
  }

  secondaryAddressverfied() {
    this.accountservice.VerifyAddress(this.secList.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.secList.City = resp.Result.components.city_name
        this.secList.State = resp.Result.components.state_abbreviation
        this.secList.StreetAddress = resp.Result.delivery_line_1
        this.secList.Zip = resp.Result.components.zipcode
        this.secList.Street = "";
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

    this.primlist.SourceOfPaymentTypology = item.Code;
    this.primlist.PaymentTypologyDescription = item.Description;
  }
  secondaryspt(item) {
    this.secList.SourceOfPaymentTypology = item.Code;
    this.secList.PaymentTypologyDescription = item.Description;
  }
  enableSave() {
    return !(
      this.insuraceComplanyPlan.PlanType != null && this.insuraceComplanyPlan.PlanType != ""
      && this.insuraceComplanyPlan.InsuranceCompanyName != null && this.insuraceComplanyPlan.InsuranceCompanyName != ""
    )


  }
  primaryenableSave() {
    return !(this.primlist.SubscriberNane != null && this.primlist.SubscriberNane != ""
      && this.primlist.DateOfBirth != null && this.primlist.DateOfBirth != ""
      && this.primlist.Gender != null && this.primlist.Gender != ""
      && this.primlist.StreetAddress != null && this.primlist.StreetAddress != ""
      && this.primlist.City != null && this.primlist.City != ""
      && this.primlist.State != null && this.primlist.State != ""
      && this.primlist.Zip != null && this.primlist.Zip != ""
      && this.primlist.InsuranceCompanyPlanID != null && this.primlist.InsuranceCompanyPlanID != ""
      && this.primlist.InsuranceCompanyPlan != null && this.primlist.InsuranceCompanyPlan != ""
      && this.primlist.RelationshipToSubscriber != null && this.primlist.RelationshipToSubscriber != ""
      && this.primlist.SourceOfPaymentTypology != null && this.primlist.SourceOfPaymentTypology != ""
      && this.primlist.StartDate != null && this.primlist.StartDate != ""
    )
  }
  secondaryenableSave() {
    return !(this.secList.SubscriberNane != null && this.secList.SubscriberNane != ""
      && this.secList.DateOfBirth != null && this.secList.DateOfBirth != ""
      && this.secList.Gender != null && this.secList.Gender != ""
      && this.secList.StreetAddress != null && this.secList.StreetAddress != ""
      && this.secList.City != null && this.secList.City != ""
      && this.secList.State != null && this.secList.State != ""
      && this.secList.Zip != null && this.secList.Zip != ""
      && this.secList.InsuranceCompanyPlanID != null && this.secList.InsuranceCompanyPlanID != ""
      && this.secList.InsuranceCompanyPlan != null && this.secList.InsuranceCompanyPlan != ""
      && this.secList.RelationshipToSubscriber != null && this.secList.RelationshipToSubscriber != ""
      && this.secList.SourceOfPaymentTypology != null && this.secList.SourceOfPaymentTypology != ""
      && this.secList.StartDate != null && this.secList.StartDate != ""
    )
  }
}

