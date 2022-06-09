import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
@Component({
  selector: 'app-patient.details',
  templateUrl: './patient.details.component.html',
  styleUrls: ['./patient.details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patient: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patient = JSON.parse(params["patient"]);
      sessionStorage.setItem('PatientId', this.patient.PatientId);
    });
  }
}
