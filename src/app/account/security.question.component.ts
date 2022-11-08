import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { SECURE_QUESTIONS } from '../_models/_patient/patientprofile';

@Component({
  selector: 'app-security-question',
  templateUrl: './security.question.component.html',
  styleUrls: ['./security.question.component.scss']
})
export class SecurityQuestion implements OnInit {
  securityQuestions: any[] = SECURE_QUESTIONS

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout('');
  }
}
