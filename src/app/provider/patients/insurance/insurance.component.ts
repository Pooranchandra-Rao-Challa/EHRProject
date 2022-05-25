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
}
