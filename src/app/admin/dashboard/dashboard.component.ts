import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
 

  userList:any=[];
  tabledummyData:any=
  [
    {'Name':'','Email':'','Phone':'','Trail/Paid':'','':'','Status':''},

  ]
  constructor() { }

  ngOnInit(): void {
  }

}
