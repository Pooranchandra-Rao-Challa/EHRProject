import { Component } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  isPast:boolean=false;
  isUpcoming:boolean=true;
  displayReq = "none";
  constructor() { }

  ngOnInit(): void {
  }
  onUpcoming(){
    this.isUpcoming=true;
    this.isPast=false;
  }
  onPast(){
    this.isUpcoming=false;
    this.isPast=true;
  }

}

