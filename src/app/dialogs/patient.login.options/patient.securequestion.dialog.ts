
import { Component, ElementRef, Inject, OnInit, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmedValidator } from 'src/app/_common/confirm-password';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { ChangePassword,ChangePasswordResult } from 'src/app/_models';

@Component({
  selector: 'app-password-change.dialog',
  templateUrl: './patient.securequestion.dialog.html',
  styleUrls: ['./patient.securequestion.dialog.scss'],
})
export class PatientPasswordChangeRequestDialogComponent implements OnInit {
  IsValidInputs: boolean = false;
  userInfo: ChangePassword = {};
  secureQuestions = SECURE_QUESTIONS;
  result: ChangePasswordResult={};
  resultProcessed:boolean = false;
  resetPassowrdForm: FormGroup;
  constructor(private dialogRef: MatDialogRef<PatientPasswordChangeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private fb: FormBuilder,
    private authService: AuthenticationService,){
      this.result.Valid
    }
  ngOnInit(): void {
    this.buildCreatePasswordForm();
  }

    buildCreatePasswordForm() {
      this.resetPassowrdForm = this.fb.group({
        Password: ['', [Validators.required]],
        ConfirmPassword: ['', [Validators.required]],
      },
        {
          validator: ConfirmedValidator('Password', 'ConfirmPassword')
        });
    }
    get v() { return this.resetPassowrdForm.controls; }

    disableContinue(){
      return !(this.userInfo.Username != null && this.userInfo.Username != ''
            && this.userInfo.Answer != null && this.userInfo.Answer != ''
            && this.userInfo.SecureQuestion != null && this.userInfo.SecureQuestion != '')
    }
    disableResetPassword(){
      //console.log( this.resetPassowrdForm.invalid);

      let frmValues = this.resetPassowrdForm.value;
      return this.resetPassowrdForm.invalid
    }
    ResetPassword(){

    }
    continue(){
      this.resultProcessed = true;
      this.authService.ValidatePatientChangePasswordInputs(this.userInfo).subscribe((resp)=>{
        if(resp.IsSuccess){
          this.result = resp.Result as ChangePasswordResult;
          console.log(this.result);

        }
      })

    }
    cancel(){  this.dialogRef.close();}
}
