import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from '../_common/confirm-password';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createpassword',
  templateUrl: './change.password.component.html',
  styleUrls: ['./createpassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  token: string;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  disableClick: boolean = false;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.buildCreatePasswordForm();
    this.token = this.activatedRoute.snapshot.queryParams.token;
  }

  buildCreatePasswordForm() {
    this.createPasswordForm = this.fb.group({
      Password: ['', [Validators.required]],
      ConfirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator('Password', 'ConfirmPassword')
      });
  }
  get v() { return this.createPasswordForm.controls; }

  UpdatePassword() {
    this.disableClick = true;
    let formValues = this.createPasswordForm.value;
    formValues.PasswordToken = this.token;
    this.authService.UpdatePasswordOnRequest(formValues).subscribe(resp => {
      this.verifyMail(resp.IsSuccess);
    })
  }

  verifyMail(req) {
    if (req == true) {
      Swal.fire({
        title: 'Password is updated successfully',
        confirmButtonText: 'Close',
        width: '700',
        customClass: {
          cancelButton: 'login-cancel-button'
        },
        background: '#f9f9f9',
        showCancelButton: true,
        cancelButtonText: 'Close',
        backdrop: true,
        showConfirmButton: false,
      }).then((result) => {
        if (result.isDismissed) {
          this.router.navigate(['account/login']);
        }
      });
    }
    else {
      Swal.fire({
        title: 'Password is not updated',
        width: '700',
        customClass: {
          cancelButton: 'login-cancel-button'
        },
        background: '#f9f9f9',
        showCancelButton: true,
        cancelButtonText: 'Close',
        backdrop: true,
        showConfirmButton: false,
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

