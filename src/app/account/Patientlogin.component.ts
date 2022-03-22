
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-patientlogin',
    templateUrl: './patientlogin.component.html',
    styleUrls: ['./patientlogin.component.scss']
})
export class PatientLoginComponent implements OnInit {
    loginForm: any;
    showspinner: boolean;
    ngOnInit() {
    }
}
