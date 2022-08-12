import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router,ActivatedRoute } from '@angular/router';
import { AlertMessage} from 'src/app/_alerts/alertMessage'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  providerType = "block";
  patientType = "none";
  constructor(private router: Router,
    private activatedRoute:ActivatedRoute,
    private alertMessage: AlertMessage) {


    }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const message = params['message'];
      if(message != null && message !=''){
        this.alertMessage.displayErrorDailog(message);
      }
    });
  }
  providerBtn() {
    this.providerType = "block";
    this.patientType = "none";
  }
  patientBtn() {
    this.patientType = "block";
    this.providerType = "none";
  }
}
