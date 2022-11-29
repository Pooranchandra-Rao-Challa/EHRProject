import { Router } from '@angular/router';
import { PatientService } from 'src/app/_services/patient.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientRelationInfo } from 'src/app/_models/_provider/patientRelationship';

@Component({
  selector: 'app-patient-relations',
  templateUrl: './patient.relations.component.html',
  styleUrls: ['./patient.relations.component.scss']
})
export class PatientRelationsComponent implements OnInit {
  patientRelationShipInfo: PatientRelationInfo[];

  constructor(private authenticationService: AuthenticationService,
    private patientService: PatientService,
    private router: Router) { }

  ngOnInit() {
    this.getPatientRelations();
  }

  defaultSelectedValue: string;

  getPatientRelations() {
    let reqParams = {
      'PatientId': this.authenticationService.userValue.PatientId
    }
    this.patientService.PatientRelationInfo(reqParams).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.patientRelationShipInfo = resp.ListResult as PatientRelationInfo[];
        let p: PatientRelationInfo = {};
        p.FirstName = this.authenticationService.userValue.FirstName;
        p.LastName = this.authenticationService.userValue.LastName;
        p.PatientId = this.authenticationService.userValue.PatientId;
        p.Role = this.authenticationService.userValue.Role;
        p.UserName = this.authenticationService.userValue.Username;
        p.UserId = this.authenticationService.userValue.UserId;
        p.UrgentMessages = this.authenticationService.userValue.UrgentMessages;
        p.UnreadMessages = this.authenticationService.userValue.UnReadMails;
        this.patientRelationShipInfo.push(p);
        this.defaultSelectedValue = this.authenticationService.userValue.PatientId
      }
      else this.patientRelationShipInfo = [];
    });
  }

  patientRelationInfo(selectedRelation: PatientRelationInfo) {

    if (selectedRelation.PatientId != this.authenticationService.userValue.PatientId) {
      this.authenticationService.UpdatePatientUser(selectedRelation);
    }
  }

}
