import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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

  constructor() {

  }

  ngOnInit(): void {
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
  }
  cancel() {
    this.data = true;
    this.isValid = false;

  }
  edit(event) {
    this.isValid = true;
    this.delete = true;
    this.data = false;
    this.rowClicked != event
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
    debugger;
    this.arry=[];
    // if(this.rowClicked === idx) this.rowClicked = -1;
    this.rowClicked = idx;
    this.arry.push(this.values[idx]);
    console.log(this.arry);
    this.btnstate = event;
   
  }
  Selected() {
debugger;
    this.InsuranceCompanyPlan = this.arry[0].InsuranceCompanyPlan;
  }
  TriggerRuleDD: any[] = [
    { value: 'ONE', viewValue: 'ONE' },
    { value: 'ONE of each category', viewValue: 'ONE of each category' },
    { value: 'Two or More', viewValue: 'Two or More' },
    { value: 'All', viewValue: 'All' },
  ];

}
