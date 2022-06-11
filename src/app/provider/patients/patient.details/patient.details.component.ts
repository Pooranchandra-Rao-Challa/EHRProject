import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ViewModel } from "src/app/_models"
@Component({
  selector: 'app-patient.details',
  templateUrl: './patient.details.component.html',
  styleUrls: ['./patient.details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patient: any;
  viewModel: ViewModel;
  constructor(private authService: AuthenticationService) {
    this.viewModel = authService.viewModel;
    this.patient = this.authService.viewModel.Patient;
  }

  ngOnInit(): void {

  }

  UpdatePatientView(patientView: string){
    this.authService.SetViewParam("PatientView",patientView);
    this.viewModel = this.authService.viewModel;
  }
}
