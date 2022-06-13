import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { table } from 'console';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ParticularInsuranceDetails, PrimaryInsurance, SecondaryInsurance } from 'src/app/_models/insurance';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';
const moment = require('moment');


@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

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
  primlist: PrimaryInsurance;
  secList: SecondaryInsurance;
  inslist: ParticularInsuranceDetails;
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

  constructor(private patientservice: PatientService, private route: ActivatedRoute, private authService: AuthenticationService) {
    this.primlist = {} as PrimaryInsurance;
    this.secList = {} as SecondaryInsurance;
    this.inslist = {} as ParticularInsuranceDetails;
  }

  ngOnInit(): void {
    this.getSourceOfPaymentTypologyCodesDD();
    this.InsuranceCompanyPlanList();
    this.getPatientDetails();
    this.getInsuranceList();
    this.getSourceOfPaymentTypologyCodesDD();
  }


  open() {
    this.show = true;
  }
  isValid: boolean;
  AddInsuranceCompanyPlan() {
    // this.primlist={};
    this.inslist = new ParticularInsuranceDetails;
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
  insurancereset() {
    this.inslist = new ParticularInsuranceDetails;
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
  }
  secondaryplus(item) {
    this.plusvalue = item;
  }
  Selected() {

    if (this.plusvalue == "primary") {
      this.primlist.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyName;
      this.InsuranceID = this.arry[0].InsuranceID;
      this.viewpidetailsforprimary = false;
    }
    else {
      this.secList.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyName
      this.InsuranceID = this.arry[0].InsuranceID;
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
  // insuranceCompanyPlanList display in table
  InsuranceCompanyPlanList() {
    this.patientservice.InsuranceCompanyPlans().subscribe(
      resp => {
        this.insurancePlanList = resp.ListResult;
        this.secondaryInsurancelist = resp.ListResult;
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

        let secondaryData = this.insuranceList.filter(x =>
          (x.InsuranceType === 'Secondary')
        )
        this.secList = secondaryData[0];
      }
    });
  }


  getInsuranceDetails() {
    var reqparam = {
      "InsuranceId": this.InsuranceID
    }

    this.patientservice.InsurancDetails(reqparam).subscribe(
      resp => {
        this.InsurancDetailslist = resp.ListResult;
        this.inslist = resp.ListResult[0];
      }
    )
  }
  getInsuranceDetail(id) {
    var reqparam = {
      "InsuranceId": id
    }
    this.patientservice.InsurancDetails(reqparam).subscribe(
      resp => {
        let InsurancDetailslist = resp.ListResult;
        this.inslist = resp.ListResult[0];
      }
    )
  }

}
