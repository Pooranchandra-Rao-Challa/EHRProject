import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from '../_common/confirm-password';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { SecureCreds } from '../_models';

@Component({
  selector: 'app-createpassword',
  templateUrl: './createpassword.component.html',
  styleUrls: ['./createpassword.component.scss']
})
export class CreatePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  secureCred: SecureCreds = {};
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.buildCreatePasswordForm();
    this.secureCred.Token = this.activatedRoute.snapshot.queryParams.token;
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
    this.secureCred.SecurityCode = formValues.SecurityCode;
    this.authService.SecurePasswordChangeForProvider(this.secureCred).subscribe(resp => {
      this.verifyMail(resp.IsSuccess);
    })
  }

  verifyMail(req) {
    if (req == true) {
      Swal.fire({
        title: 'Your email address has been verified and password updated. Please sign in to your account.',
        showConfirmButton: true,
        confirmButtonText: 'Close',
        width: '700'

      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['account/login']);
        }
      });
    }
    else {
      Swal.fire({
        title: 'Your email address has not-verified. Please contact to the admin.',
        text: 'Failed',
        width: '700',
      });
    }
  }
}

