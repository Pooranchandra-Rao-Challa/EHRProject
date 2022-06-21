
import { Component,  Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ChangePassword } from 'src/app/_models';



@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './changepassword.dialog.component.html',
  styleUrls: ['./changepassword.dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  data: ChangePassword;
  changepasswordform: FormGroup = new FormGroup({});
  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private fb: FormBuilder) {
      this.data = reqdata as ChangePassword
      console.log(this.data);

      this.changepasswordform = fb.group({
        password: ['', [Validators.required,Validators.minLength(8),
          Validators.maxLength(20)]],
        confirm_password: ['', [Validators.required,Validators.minLength(8),
          Validators.maxLength(20)]]
      }, {
        validator: ConfirmedValidator('password', 'confirm_password')
      })
    }

  get formcontrols(){
    return this.changepasswordform.controls;
  }

  updatePassword() {
    this.dialogRef.close(this.data);
  }

  close() {
    this.dialogRef.close();
  }
}

export function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}
