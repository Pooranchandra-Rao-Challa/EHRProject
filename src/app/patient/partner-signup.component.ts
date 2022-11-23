import { PartnerSignup } from './../_models/_patient/partnerSignup';
import { Component, OnInit } from '@angular/core';
import { Accountservice } from '../_services/account.service';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';

@Component({
  selector: 'app-partner-signup',
  templateUrl: './partner-signup.component.html',
  styleUrls: ['./partner-signup.component.scss']
})
export class PartnerSignupComponent implements OnInit {
  partnerSignup?: PartnerSignup = {};
  phone_number = '';
  email = '';
  PhonePattern: any
  phonepattern = /^[0-9]{10}/;
  patnerSignupEmail = /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/;

  constructor(private accountservice: Accountservice, private alertmsg: AlertMessage) {
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }

  ngOnInit(): void {
  }

  CreatePartnerSignup(partnerSignup) {
    let isAdd = this.partnerSignup.C_id == null;
    this.accountservice.CreatePartnerSignup(partnerSignup).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES[isAdd ? "M3PS001" : "E3PS001"]);
        this.resetForm();

      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E3PS001"]);
      }
      this.partnerSignup = {} as PartnerSignup;
    })
  }

  resetForm() {
    // this.partnerSignup = {} as PartnerSignup;
    this.partnerSignup = new PartnerSignup
  }

  // getRequiredErrorMessage(field) {
  //   return this.company_address.get(field).hasError('required') ? 'You must enter a value' : '';
  // }
  enablesave() {
    return !((this.partnerSignup.first_name != null && this.partnerSignup.first_name != '')
      && (this.partnerSignup.last_name != null && this.partnerSignup.last_name != '')
      && (this.phonepattern.test(this.partnerSignup.phone_number))
      && (this.patnerSignupEmail.test(this.partnerSignup.email)));
  }

}
