import  Swal  from 'sweetalert2';

import { Component, Inject, OnInit,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmedValidator } from 'src/app/_common/confirm-password';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { ChangePassword, ChangePasswordResult } from 'src/app/_models';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage'


@Component({
  selector: 'app-password-change.dialog',
  templateUrl: './patient.securequestion.dialog.html',
  styleUrls: ['./patient.securequestion.dialog.scss'],
})
export class PatientSecurityQuestionDialogComponent implements OnInit {
  IsValidInputs: boolean = false;
  userInfo: ChangePassword = {};
  secureQuestions = SECURE_QUESTIONS;
  result: ChangePasswordResult = {};
  resultProcessed: boolean = false;
  validUser: boolean = false;
  showmessage: boolean = false;
  resetPassowrdForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<PatientSecurityQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) reqdata,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alterMessage: AlertMessage,) {

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

  disableContinue() {
    return !(this.userInfo.Username != null && this.userInfo.Username != ''
      && this.userInfo.Answer != null && this.userInfo.Answer != ''
      && this.userInfo.SecureQuestion != null && this.userInfo.SecureQuestion != '')
  }
  disableResetPassword() {
    let frmValues = this.resetPassowrdForm.value;
    return this.resetPassowrdForm.invalid
  }

  disableContinueForUsername(){
    return !(this.userInfo.Username != null && this.userInfo.Username != '')
  }
  ResetPassword() {
    this.userInfo.Password = this.resetPassowrdForm.value.Password
    this.userInfo.ConfirmPassword = this.resetPassowrdForm.value.ConfirmPassword
    this.authService.ResetPasswordForPatient(this.userInfo).subscribe((resp)=>{
      if(resp.IsSuccess){
        this.alterMessage.displayMessageDailog(ERROR_CODES["ML001"])
        this.cancel();
      }else{
        this.alterMessage.displayMessageDailog(ERROR_CODES["EL016"])
        this.cancel();
      }
    })
  }
  continue() {
    this.showmessage = this.userInfo.QAnswer != this.userInfo.Answer;
    if(this.userInfo.QAnswer == this.userInfo.Answer){
      this.resultProcessed = true;
      this.result.Valid = true;
      this.result.HasQuestion = true;
    }
  }
  goback(){
    this.validUser = false;
    this.showmessage = false;
    this.userInfo.Answer = "";
  }
  continueForSecurityQuestion(){
    this.authService.PatientSecurityQuestion(this.userInfo).subscribe((resp) => {
      if (resp.IsSuccess) {
        this.userInfo = resp.Result as ChangePassword;
        this.validUser = true;
      }else{
        this.resultProcessed = true;
        this.result.HasQuestion = false;
        this.result.Valid = false
      }
    })


  }
  cancel() { this.dialogRef.close(); }
}
