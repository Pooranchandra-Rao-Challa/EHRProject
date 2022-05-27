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
 
  displaytitle:any;
  errorBlock:boolean;
  error: boolean = false;
  delete: boolean;

  
  constructor() {
  
   }

  ngOnInit(): void {
  }
  Action: string[] = [
   "1-MEDICARE",
  ];
  Add(event)
  {
    this.error=event;
  }
  show: boolean;
  open() {
    this.show = true;
   

  }
  isValid:boolean;
  add()
  {
    this.isValid=true;
  }
  close()
  {
    this.isValid=false;
  }
  edit(event)
  {
    this.isValid=true;
    this.delete=true;
    this.rowClicked!=event
  }
  values = [
    { id: 1, name: "Andrew", age: "26", sex: "M",name1: "Andrew", age1: "26", sex1: "M" },
    { id: 2, name: "David", age: "28", sex: "M" },
    { id: 3, name: "Steve", age: "30", sex: "M" },
    { id: 4, name: "Tony", age: "21", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 2, name: "David", age: "28", sex: "M" },
    { id: 3, name: "Steve", age: "30", sex: "M" },
    { id: 4, name: "Tony", age: "21", sex: "M" } , { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },{ id: 1, name: "Andrew", age: "26", sex: "M" },{ id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },{ id: 1, name: "Andrew", age: "26", sex: "M" },{ id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    { id: 1, name: "Andrew", age: "26", sex: "M" },
    
  ];
  rowClicked
  changeTableRowColor(idx: any) { 
    // if(this.rowClicked === idx) this.rowClicked = -1;
    this.rowClicked = idx;
  }
}
