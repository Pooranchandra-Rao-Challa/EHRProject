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
const moment = require('moment');


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  user:User;
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
  primlist: PrimaryInsurance ={} as PrimaryInsurance;
  secList: SecondaryInsurance={} as SecondaryInsurance;
  insuraceComplanyPlan: ParticularInsuranceCompanyDetails;
  practiceLocation:PracticeLocation;
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
  secInsuranceID: any;
  splitted: any;
  InsurancDetailslist1: any;
  // insuraceComplanyPlan1: any;
  newsavelist: any = [];
  InsuranceCP: any;
  changedLocationId:string;
  isValid: boolean;
  primaryInsuranceType="Primary";
  secondaryInsuranceType="Secondary"

  constructor(private patientservice: PatientService, private route: ActivatedRoute, private authService: AuthenticationService,private alertmsg: AlertMessage,) {
    this.primlist = {} as PrimaryInsurance;
    this.secList = {} as SecondaryInsurance;
    this.insuraceComplanyPlan = {} as ParticularInsuranceCompanyDetails;
    this.user = authService.userValue;
    this.changedLocationId = this.user.CurrentLocation;
    console.log(this.changedLocationId);
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
    // this.primlist={};
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
  }
  secondaryplus(item) {
    this.plusvalue = item;
    this.rowClicked = -1;
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
      console.log(this.SourceOfPaymentTypologyCodes);
    })
  }
  // insuranceCompanyPlanList display in table
  InsuranceCompanyPlanList() {
    this.patientservice.InsuranceCompanyPlans().subscribe(
      resp => {
        this.insurancePlanList = resp.ListResult;
        this.secondaryInsurancelist = resp.ListResult;
        console.log(this.insurancePlanList);
      })
  }

  // get patient id
  getPatientDetails() {
    // this.route.queryParams.subscribe((params) => {
    //   this.PatientDetails = JSON.parse(params.patient);
    // });
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
        debugger;
        let secondaryData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Secondary')
        )
        this.secList = secondaryData[0];
        this.secList=this.secList == undefined ? {} : this.secList;
        if(this.secList != undefined){
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
        "InsuranceId":  this.primlist.InsuranceCompanyPlanID
      }
      this.patientservice.InsurancDetails(reqparam).subscribe(
        resp => {
          this.InsurancDetailslist = resp.ListResult;
          this.insuraceComplanyPlan = resp.ListResult[0];
        });
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
    }

  }
  getInsuranceDetail(id) {
    debugger;
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

  CreateUpdateInsuraceCompanyPlan()
  {
    let isAdd = this.insuraceComplanyPlan.InsuranceCompanyId == "";
      this.insuraceComplanyPlan.LocationId= this.changedLocationId
    this.patientservice.CreateUpdateInsuranceCompanyPlan(this.insuraceComplanyPlan).subscribe((resp)=>
    {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI001" : "M2CI002"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI001"]);
      }
    this.insurancePlanList();
  });
  }


  deleteInsurancePlan()
  {
      this.patientservice.DeleteInsuranceCampanyplan(this.insuraceComplanyPlan).subscribe((resp)=>
    {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CI003"]);
      }
    });
   
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;
  }

  CreateUpdateInsuranceDetails(item)
  {
    debugger;
    if(item=="primary")
    {
      this.primlist.ProviderId=this.user.ProviderId;
      this.primlist.PatientId=this.PatientDetails.PatientId;
      this.primlist.LocationId= this.changedLocationId;
      this.primlist.InsuranceType=this.primaryInsuranceType;
      let isAdd = this.primlist.InsuranceId == "";
    this.patientservice.CreateUpdateInsuranceDetails(this.primlist).subscribe((resp)=>
    {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI004" : "M2CI005"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI002"]);
      }
    })
  }
  else
  {
    this.secList.ProviderId=this.user.ProviderId;
    this.secList.PatientId=this.PatientDetails.PatientId;
    this.secList.LocationId= this.changedLocationId;
    this.secList.InsuranceType=this.secondaryInsuranceType;
    let isAdd = this.secList.InsuranceId == "";
    this.patientservice.CreateUpdateInsuranceDetails(this.secList).subscribe((resp)=>
    {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M2CI006" : "M2CI007"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CI003"]);
      }
    })
  }
  }
}
