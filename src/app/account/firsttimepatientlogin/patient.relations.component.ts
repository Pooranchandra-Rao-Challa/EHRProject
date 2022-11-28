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
    private router: Router) {}

  ngOnInit() {
    this.getPatientRelations();
  }

  defaultSelectedValue: string;

  getPatientRelations() {
    let reqParams = {
      'PatientId': this.authenticationService.userValue.PatientId
    }
    this.patientService.PatientRelationInfo(reqParams).subscribe((resp) => {
      if(resp.IsSuccess) {
        this.patientRelationShipInfo = resp.Result;
        this.defaultSelectedValue = this.patientRelationShipInfo[0].PatientId;
      }
      else this.patientRelationShipInfo = [];
    });
  }

  showNextBtn: boolean = false;

  patientRelationInfo(selectedRelation: PatientRelationInfo){
    this.authenticationService.UpdatePatientUser(selectedRelation);
    this.showNextBtn = true;
    // this.router.navigate(['patient/dashboard']);
  }

}
