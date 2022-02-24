import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  providerType = "block";
  patientType = "none";
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/reports/categoryreports']);
  }
  providerBtn() {
    this.providerType = "block";
    this.patientType = "none";
  }
  patientBtn() {
    this.patientType = "block";
    this.providerType = "none";
  }
}
