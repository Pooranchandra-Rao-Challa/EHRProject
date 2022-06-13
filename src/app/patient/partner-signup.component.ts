import { PartnerSignup } from './../_models/_patient/partnerSignup';
import { Component, OnInit } from '@angular/core';
import { Accountservice } from '../_services/account.service';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';
import { FormControl, Validators } from '@angular/forms';




@Component({
  selector: 'app-partner-signup',
  templateUrl: './partner-signup.component.html',
  styleUrls: ['./partner-signup.component.scss']
})
export class PartnerSignupComponent implements OnInit {

  partnerSignup: PartnerSignup = {} as PartnerSignup;
  phone_number = '';
  email='';


  constructor(private accountservice :Accountservice,private alertmsg: AlertMessage) {

    }

  ngOnInit(): void {
  }
  // handleClear(){
  //   this.first_name = ' ';

  // }


  CreatePartnerSignup(partnerSignup) {
    debugger;
    let isAdd = this.partnerSignup.C_id == null;
    this.accountservice.PostPartnerSignup(partnerSignup).subscribe((resp) => {
      debugger;
      if (resp.IsSuccess) {
        debugger;
        this.alertmsg.displaysubmitted(ERROR_CODES[isAdd ? "M3PS001" : "E3PS001"]);
        this.resetForm();
        // this.clear();
      }
      else {
         this.alertmsg.displayErrorDailog(ERROR_CODES["E3PS001"]);
      }
    })
  }
  resetForm(){
    this.partnerSignup={} as PartnerSignup;
  }

  // getRequiredErrorMessage(field) {
  //   return this.company_address.get(field).hasError('required') ? 'You must enter a value' : '';
  // }

}
