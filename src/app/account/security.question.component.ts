import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-security-question',
  templateUrl: './security.question.component.html',
  styleUrls: ['./security.question.component.scss']
})
export class SecurityQuestion implements OnInit {

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout('');
  }
}
