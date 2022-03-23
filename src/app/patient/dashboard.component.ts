import { Component } from '@angular/core';

@Component({
  selector: 'app-patientdashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isHealth:boolean=false;
  isAccees:boolean=false;
  displayReq = "none";
  displayNew = "none";
  constructor() { }

  ngOnInit(): void {
  }

  onhealth(){
    this.isAccees=false;
    this.isHealth=true;
  }
  onAcess(){
    this.isHealth=false;
    this.isAccees=true;

  }
 
}
