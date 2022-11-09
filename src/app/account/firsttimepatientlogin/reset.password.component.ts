import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { Router } from '@angular/router';
import { PatientService } from './../../_services/patient.service';
import { AuthenticationService } from './../../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FirstTimeSecurityQuestion } from 'src/app/_models/_account/securityquestion';
import { ConfirmedValidator } from 'src/app/_common/confirm-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset.password.component.html',
  styleUrls: ['./reset.password.component.scss']
})
export class ResetPassword implements OnInit {
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  firstTimeSecurityQuestion: FirstTimeSecurityQuestion = new FirstTimeSecurityQuestion();
  pattern = /^(?!.* )(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*_=+-]).{8,15}$/;

  constructor(private authenticationService: AuthenticationService,
    private patientService: PatientService,
    private router: Router,
    private alertmsg: AlertMessage) {}

  ngOnInit() {
  }

  FirstTimeResetPassword() {
    this.firstTimeSecurityQuestion.PatientId = this.authenticationService.userValue.PatientId;
    this.firstTimeSecurityQuestion.ResetToken = this.authenticationService.userValue.ResetToken;
    this.patientService.FirstTimeResetPassword(this.firstTimeSecurityQuestion).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.router.navigate(['patient/dashboard']);
        this.alertmsg.displayMessageDailog(ERROR_CODES["M3RP001"]);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E3RP001"]);
      }
    });
  }

  disableResetPassword() {
    return !(this.pattern.test(this.firstTimeSecurityQuestion.Password) && this.pattern.test(this.firstTimeSecurityQuestion.ConfirmPassword)
    && this.firstTimeSecurityQuestion.ConfirmPassword == this.firstTimeSecurityQuestion.Password);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  confirmedValidator() {
    ConfirmedValidator(this.firstTimeSecurityQuestion.Password, this.firstTimeSecurityQuestion.ConfirmPassword);
  }
}
