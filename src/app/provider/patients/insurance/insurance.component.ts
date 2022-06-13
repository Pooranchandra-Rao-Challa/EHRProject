import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PatientService } from 'src/app/_services/patient.service';

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
  viewpidetails: boolean = true;
  SourceOfPaymentTypologyCodes: any = [];
  insurancePlanList: any=[];

  constructor(private patientservice:PatientService) {

  }

  ngOnInit(): void {
     this.getSourceOfPaymentTypologyCodesDD();
     this.insuranceCompanyPlanList();
  }
  Action: string[] = [
    "1-MEDICARE",
  ];
  arry: any[] = [];
  InsuranceCompanyPlan: string;
  show: boolean;
  open() {
    this.show = true;
  }
  isValid: boolean;
  AddInsuranceCompanyPlan() {
    this.data = false;
    this.isValid = true;
    this.delete = false;
    this.cancel2 = true;
  }
  cancel() {
    //debugger;
    this.data = true;
    this.isValid = false;
    this.cancel2 = false;
    this.cancel1 = false;

  }
  edit(event) {
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

  values = [
    { id: 1, InsuranceCompanyPlan: "Andrew", age: "26", sex: "M", name1: "Andrew", age1: "26", sex1: "M" },
    { id: 2, InsuranceCompanyPlan: "David", age: "28", sex: "M" },
    { id: 3, InsuranceCompanyPlan: "Steve", age: "30", sex: "M" },
    { id: 4, InsuranceCompanyPlan: "Tony", age: "21", sex: "M" },

  ];

  btnstate: boolean = true;
  rowClicked
  changeTableRowColor(idx, event) {
    //debugger;
    this.arry = [];
    // if(this.rowClicked === idx) this.rowClicked = -1;
    this.rowClicked = idx;
    this.arry.push(this.values[idx]);
    console.log(this.arry);
    this.btnstate = event;

  }
  Selected() {
    //debugger;
    this.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyPlan;
    this.viewpidetails = false;
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

  getSourceOfPaymentTypologyCodesDD() {
    //debugger;
    this.patientservice.SourceOfPaymentTypologyCodes().subscribe(resp=>{
     this.SourceOfPaymentTypologyCodes =resp.ListResult;
    })

    console.log(this.SourceOfPaymentTypologyCodes)
  }

insuranceCompanyPlanList()
{
  this.patientservice.InsuranceCompanyPlans().subscribe(
    resp=>{
      this.insurancePlanList=resp.ListResult;
      console.log(this.insurancePlanList)
  })
}

}
