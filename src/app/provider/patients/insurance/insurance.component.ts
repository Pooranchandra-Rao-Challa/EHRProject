import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { table } from 'console';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PracticeLocation, User } from 'src/app/_models';
import { ParticularInsuranceCompanyDetails, PrimaryInsurance, SecondaryInsurance } from 'src/app/_models/insurance';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { Accountservice } from 'src/app/_services/account.service';
const moment = require('moment');


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  user: User;
  displaytitle: any;
  errorBlock: boolean;
  error: boolean = false;
  delete: boolean = false;
  data: boolean = true;
  cancel1: boolean = false;
  cancel2: boolean = false;
  viewpidetailsforprimary: boolean = true;
  viewpidetailsforsecondary: boolean = true;
  SourceOfPaymentTypologyCodes: any = [];
  insurancePlanList: any = [];
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
  rowClicked
  arry: any[] = [];
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
  disableaddressverification1: boolean = false;
  secondarymanuallybtn: boolean;
  secondarydisableaddressverification: boolean;
  primaryselected: any;
  secondaryselected: any;
  SearchKey = "";
  getinsurancePlanList: any;
  primaryInsDetail: boolean;
  secondaryInsDetail: boolean;


  constructor(private patientservice: PatientService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private accountservice: Accountservice,) {
    this.primlist = {} as PrimaryInsurance;
    this.secList = {} as SecondaryInsurance;
    this.insuraceComplanyPlan = {} as ParticularInsuranceCompanyDetails;
    this.user = authService.userValue;
    this.changedLocationId = this.user.CurrentLocation;

    this.InsuranceCompanyPlanList();
  }

  ngOnInit(): void {
    this.getSourceOfPaymentTypologyCodesDD();
    this.InsuranceCompanyPlanList();
    this.getPatientDetails();
    this.getInsuranceList();
    this.getSourceOfPaymentTypologyCodesDD();
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
    this.rowClicked = -1;
    this.InsuranceCompanyPlanList();
    this.SearchKey = "";

  }


  edit(event, idx) {
    this.arry.push(this.insurancePlanList[idx]);
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
  }

  changeTableRowColor(idx, event) {
    this.arry = [];
    this.rowClicked = idx;
    this.arry.push(this.insurancePlanList[idx]);
    this.btnstate = event;

  }
  primaryplus(item) {

    this.plusvalue = item;
    this.rowClicked = -1;
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
  }
  secondaryplus(item) {
    this.plusvalue = item;
    this.rowClicked = -1;
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
  }
  Selected() {

    if (this.plusvalue == "primary") {
      this.primlist.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyName;
      this.primlist.InsuranceCompanyPlanID = this.arry[0].InsuranceCompanyId;
      this.viewpidetailsforprimary = false;
    }
    else {
      this.secList.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyName
      this.secList.InsuranceCompanyPlanID = this.arry[0].InsuranceCompanyId;
      this.viewpidetailsforsecondary = false;
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
      this.SourceOfPaymentTypologyCodes = resp.ListResult;
    })
  }

  InsuranceCompanyPlanList() {
    this.patientservice.InsuranceCompanyPlans().subscribe(
      resp => {
        this.insurancePlanList = resp.ListResult;
        this.getinsurancePlanList = this.insurancePlanList
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
        this.primlist.StartDate = moment(primarydata[0].StartDate).format('YYYY-MM-DD');
        this.primlist.DateOfBirth = moment(primarydata[0].DateOfBirth).format('YYYY-MM-DD');
        this.primlist.EndDate = moment(primarydata[0].EndDate).format('YYYY-MM-DD');
        let secondaryData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Secondary')
        )
        this.secList = secondaryData[0];
        this.secList = this.secList == undefined ? {} : this.secList;
        if (this.secList != undefined) {
          this.secList.DateOfBirth = moment(secondaryData[0].DateOfBirth).format('YYYY-MM-DD');
          this.secList.StartDate = moment(secondaryData[0].StartDate).format('YYYY-MM-DD');
          this.secList.EndDate = moment(secondaryData[0].EndDate).format('YYYY-MM-DD');
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
        this.primaryInsDetail=true;
        this.secondaryInsDetail=false;
    }
    else {
      var reqparam = {
        "InsuranceId": this.primlist.InsuranceCompanyPlanID
      }
      this.patientservice.InsurancDetails(reqparam).subscribe(
        resp => {
          this.InsurancDetailslist = resp.ListResult;
          this.insuraceComplanyPlan = resp.ListResult[0];
        });
        this.primaryInsDetail=false;
        this.secondaryInsDetail=true;
    }

  }
  getInsuranceDetail(id) {

    var reqparam = {
      "InsuranceId": id
    }
    this.patientservice.InsurancDetails(reqparam).subscribe(
      resp => {
        let InsurancDetailslist = resp.ListResult;
        this.insuraceComplanyPlan = resp.ListResult[0];
      }
    )
  }

  CreateUpdateInsuraceCompanyPlan() {
    let isAdd = this.insuraceComplanyPlan.InsuranceCompanyId == "";
    this.insuraceComplanyPlan.LocationId = this.changedLocationId
    this.patientservice.CreateUpdateInsuranceCompanyPlan(this.insuraceComplanyPlan).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI001" : "M2CI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI001"]);
      }
      this.InsuranceCompanyPlanList();
    });
  }

  deleteInsurancePlan() {
    this.patientservice.DeleteInsuranceCampanyplan(this.insuraceComplanyPlan).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CI003"]);
      }
    });
this.getInsuranceList();
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
  }

  CreateUpdateInsuranceDetails(item) {
    if (item == "primary") {
      this.primlist.ProviderId = this.user.ProviderId;
      this.primlist.PatientId = this.PatientDetails.PatientId;
      this.primlist.LocationId = this.changedLocationId;
      this.primlist.InsuranceType = this.primaryInsuranceType;
      let isAdd = this.primlist.InsuranceId == "";
      this.patientservice.CreateUpdateInsuranceDetails(this.primlist).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI004" : "M2CI005"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI002"]);
        }
      })
      this.getInsuranceList();
      this.manuallybtn = false;
      this.disableaddressverification = false;
      this.addressVerfied = false;
    }
    else {
      this.secList.ProviderId = this.user.ProviderId;
      this.secList.PatientId = this.PatientDetails.PatientId;
      this.secList.LocationId = this.changedLocationId;
      this.secList.InsuranceType = this.secondaryInsuranceType;
      let isAdd = this.secList.InsuranceId == "";
      this.patientservice.CreateUpdateInsuranceDetails(this.secList).subscribe((resp) => {
        if (resp.IsSuccess) {
          this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI006" : "M2CI007"]);
        }
        else {
          this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI003"]);
        }
      })
      this.getInsuranceList();
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
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI002"])
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
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI003"])
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
  onChange(type, value) {
    if (type === 'primary') {
      this.primaryselected = this.SourceOfPaymentTypologyCodes.filter(x => x.Code == value)[0];
      this.primlist.PaymentTypologyCode = this.primaryselected.Code;
      this.primlist.PaymentTypologyDescription = this.primaryselected.Description;
    }
  }
  secondaryonChange(type, value) {
    if (type === 'secondary') {
      this.secondaryselected = this.SourceOfPaymentTypologyCodes.filter(x => x.Code == value)[0];
      this.secList.PaymentTypologyCode = this.secondaryselected.Code;
      this.secList.PaymentTypologyDescription = this.secondaryselected.Description;
    }
  }
  onFilterChange() {
    this.insurancePlanList = this.insurancePlanList.filter((invoice) => this.isMatch(invoice));
  }

  isMatch(item) {
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item == null ? '' : item.toString().indexOf(this.SearchKey) > -1

    }
  }
}

