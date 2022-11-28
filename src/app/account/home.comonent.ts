import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { AlertMessage, ERROR_CODES} from 'src/app/_alerts/alertMessage'
import { PatientService } from '../_services/patient.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  providerType = "block";
  patientType = "none";
  providerFooterVersion:any[]
  constructor(private router: Router,
    private activatedRoute:ActivatedRoute,
    private alertMessage: AlertMessage,private patientservice:PatientService) {


    }

  ngOnInit() {
    let message1 = localStorage.getItem("message")
    localStorage.removeItem("message");
    if(message1 != null && message1 !=''){
      this.alertMessage.displayErrorDailog(message1);
    }
    this.activatedRoute.queryParams.subscribe(params => {
      const message = params['message'];
      if(message != null && message !=''){
        this.alertMessage.displayErrorDailog(message);
      }
    });
    this.GetAdminSettingVersion();
  }
  providerBtn() {
    this.providerType = "block";
    this.patientType = "none";
  }
  patientBtn() {
    this.patientType = "block";
    this.providerType = "none";
  }
  GetAdminSettingVersion()
  {
   this.patientservice.ChangeFooterVersion().subscribe(resp=>
  {
    if(resp.IsSuccess)
    {
      this.providerFooterVersion = resp.ListResult;
    }
  })
  }
}
