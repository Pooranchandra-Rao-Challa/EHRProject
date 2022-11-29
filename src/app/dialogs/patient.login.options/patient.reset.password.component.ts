
import { ChangePassword } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from 'src/app/_common/confirm-password';


@Component({
  selector: 'patient-reset-password',
  templateUrl: './patient.reset.password.component.html',
  styleUrls: ['./patient.reset.password.component.scss']
})
export class ResetPatientPasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  secureCred: ChangePassword = {};
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.buildCreatePasswordForm();
    this.secureCred = localStorage.getItem("resetpassword") as ChangePassword;
    localStorage.removeItem("resetpassword");
  }

  buildCreatePasswordForm() {
    this.createPasswordForm = this.fb.group({
      SecurityCode: ['', [Validators.required]],
      NewPassword: ['', [Validators.required]],
      ConfirmNewPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator('NewPassword', 'ConfirmNewPassword')
      });
  }
  get v() { return this.createPasswordForm.controls; }

  UpdatePassword() {
    let formValues = this.createPasswordForm.value;
    this.secureCred.Password = formValues.NewPassword;
    // this.authService.SecurePasswordChangeForProvider(this.secureCred).subscribe(resp => {
    //   this.verifyMail(resp.IsSuccess);
    // })
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

