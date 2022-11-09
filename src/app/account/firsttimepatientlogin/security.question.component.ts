import { Router } from '@angular/router';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PatientService } from 'src/app/_services/patient.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { SECURE_QUESTIONS } from '../../_models/_patient/patientprofile';
import { FirstTimeSecurityQuestion } from '../../_models/_account/securityquestion';

@Component({
  selector: 'app-security-question',
  templateUrl: './security.question.component.html',
  styleUrls: ['./security.question.component.scss']
})
export class SecurityQuestion implements OnInit {
  securityQuestions: any[] = SECURE_QUESTIONS;
  firstTimeSecurityQuestion: FirstTimeSecurityQuestion = new FirstTimeSecurityQuestion();

  constructor(private authenticationService: AuthenticationService,
    private patientService: PatientService,
    private alertmsg: AlertMessage,
    private router: Router) {}

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout('');
  }

  UpdateSecurityQuestion() {
    this.firstTimeSecurityQuestion.PatientId = this.authenticationService.userValue.PatientId;
    this.patientService.UpdateSecurityQuestion(this.firstTimeSecurityQuestion).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.router.navigate(['/account/reset-password']);
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E3SQ001"]);
      }
    });
  }

  disableSecurityQuestion() {
    return !(this.firstTimeSecurityQuestion.Question && this.firstTimeSecurityQuestion.Answer);
  }

}
