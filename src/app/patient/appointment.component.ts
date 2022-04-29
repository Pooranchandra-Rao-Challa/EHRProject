import { Component } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  isPast:boolean=false;
  isUpcoming:boolean=true;
  displayReq = "none";
  PatientDialogComponent = PatientappointmentDialogComponent;
  DialogResponse = null;
  
  constructor(private overlayService :OverlayService) { }

  ngOnInit(): void {
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.PatientDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
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

