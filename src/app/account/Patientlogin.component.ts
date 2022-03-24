
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    selector: 'app-patientlogin',
    templateUrl: './patientlogin.component.html',
    styleUrls: ['./patientlogin.component.scss']
})
export class PatientLoginComponent implements OnInit {
    loginForm: any;
    showspinner: boolean;
    message: string = '';
    authfailedmessage; string = '';

    constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) { }
    ngOnInit() {
        this.buildForm();
    }
    buildForm() {
        this.loginForm = this.fb.group({
            EmailId: [''],
            Password: ['']
        });
    }
    OnLoginSubmit() {
        this.showspinner = true;
        this.message = 'Please wait while verifying your Email Id and Password';

        if (this.loginForm.Invalid) {
            return
        };
        var data = this.loginForm.value;
        var creds = {
            "EmailId": data.EmailId,
            "Password": data.Password,
        };

        this.authenticationService.patientLoginWithFormCredentials(creds).subscribe(resp => {
            

            if (!resp.IsSuccess) {
                this.showspinner = false;
                this.message = '';
                this.authfailedmessage = "Enter valid Email Id and Password";
            }
        });

    }
}