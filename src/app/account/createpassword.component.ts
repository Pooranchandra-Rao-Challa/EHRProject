import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmedValidator } from '../_models/confirm-password';

@Component({
  selector: 'app-createpassword',
  templateUrl: './templates/createpassword.html',
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
      SecurityCode: ['', Validators.required],
      NewPassword: ['', Validators.required],
      ConfirmNewPassword: ['', Validators.required],
    },
      {
        validator: ConfirmedValidator('NewPassword', 'ConfirmNewPassword')
      });
  }
  get v() { return this.createPasswordForm.controls; }
}
