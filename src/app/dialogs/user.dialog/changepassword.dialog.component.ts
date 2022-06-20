import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


export class ChangePassword{
  email?: string;
  password?: string;
  confirmpassword?: string;
  userid?:string;
}
@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './changepassword.dialog.component.html',
  styleUrls: ['./changepassword.dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  data: ChangePassword = new ChangePassword;
  changepasswordform: FormGroup = new FormGroup({});
  constructor(private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private fb: FormBuilder) {
      this.data = reqdata as ChangePassword
      this.changepasswordform = fb.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]]
      }, {
        validator: ConfirmedValidator('password', 'confirm_password')
      })
    }
  ngOnInit(): void {

  }

  get formcontrols(){
    return this.changepasswordform.controls;
  }

  save() {
    this.dialogRef.close();
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
