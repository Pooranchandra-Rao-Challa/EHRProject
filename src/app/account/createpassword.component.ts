import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from '../_models/_account/confirm-password';
import Swal from 'sweetalert2';
import { auto } from '@popperjs/core';

@Component({
  selector: 'app-createpassword',
  templateUrl: './templates/confirmationinstructions.html',
  styleUrls: ['./templates/createpassword.scss']
})
export class CreatePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.buildCreatePasswordForm();
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

  verifyMail(req) {
    if (req == true) {
      Swal.fire({
        title: 'Your email address has been verified. Please sign in below to complete setting up your account.',
        showConfirmButton: true,
        confirmButtonText: 'Close',
        width: '700'

      });
    }
    else {
      Swal.fire({
        title: 'Your email address has not-verified. Please contact to the admin.',
        text: 'Failed',
        width: '700',
      })
    }
  }
}
