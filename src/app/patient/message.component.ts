import { Component } from '@angular/core';
import { OverlayService } from '../overlay.service';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../dialogs/newmessage.dialog/newmessage.dialog.component';
import { Messages } from '../_models/_patient/messages';
import { PatientService } from '../_services/patient.service';
import { User } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  displayReq = "none";
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse = null;
  messages:Messages;
  basedoncondition:boolean=false;
  user: User;

  constructor(private authenticationService: AuthenticationService,private overlayService :OverlayService,private patientservice:PatientService) {
    this.user = authenticationService.userValue;
   }

  ngOnInit(): void {
    this.getmessages();
  }
  openComponentDialogmessage(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.MessageDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }
  getmessages()
  {
        var req={
          "PatientId": this.user.PatientId,
        }
        this.patientservice.GetPatientMessages(req).subscribe(res=>{
          this.messages=res.ListResult == null ? [] : res.ListResult;
          console.log(this.messages);
        })

  }
  getmessage(item)
  {
    //debugger;
        var req={
          // "PatientId": "5836dafef2e48f36ba90a996",
          "PatientId": this.user.PatientId,
        }
        this.patientservice.GetPatientMessages(req).subscribe(res=>{
          this.messages=res.ListResult == null ? [] : res.ListResult;
          console.log(this.messages);
        })
        this.basedoncondition=true;
  }
}
