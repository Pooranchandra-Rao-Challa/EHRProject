import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { User } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-providermessagetopractice.dialog',
  templateUrl: './providermessagetopractice.dialog.component.html',
  styleUrls: ['./providermessagetopractice.dialog.component.scss']
})
export class ProvidermessagetopracticeDialogComponent implements OnInit {
  user: User;
  constructor(private ref: EHROverlayRef,private authService: AuthenticationService, private authenticationService: AuthenticationService) { 
    this.user = authenticationService.userValue; }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
}
