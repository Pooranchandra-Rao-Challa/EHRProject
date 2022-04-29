import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from '../_models';
import { Accountservice } from '../_services/account.service';
import { CustomKeyboardEvent } from 'ngx-mask';



declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  nameTitle: { titleId: number; titleName: string; }[];
  credentials: { credId: number; credName: string; }[];
  speciality: { specId: number; specName: string; }[];
  showpersonalInfoReq: boolean = true;
  showcontactInfoReq: boolean = false;
  showaccountInfoReq: boolean = false;
  Registration: FormGroup;
  PersonalInfo: FormGroup;
  ContactInfomation: FormGroup;
  AccountInfomation: FormGroup;
  users: User;
  displayDialog: boolean;
  displayAddress = "none";
  ValidAddressForUse: any;
  displaymsg: any;
  errorDisplay: boolean;
  PersonalDetials: any;
  ContactDetails: any;
  AccountDetails: any;
  DisPersonInfoForm: boolean = false;
  DisContactnfoForm: boolean;
  DisAccountInfoForm: boolean = false;
  getResponse: any = {};
  DisableStepbtn: boolean = false;
  DisableStep1Btn: boolean;
  DisableStep2Btn: boolean;
  DisableStep3Btn: boolean;
  UseThisValue: any;
  ValidAddressToUse: boolean;
  displayVerifybtn: boolean;
  Checked1: boolean;
  Checked2: boolean;
  Checked3: boolean;
  Checked4: boolean;
  Checked5: boolean;
  Checked6: boolean;
  UnChecked6: boolean;
  unChecked: boolean;
  Checked7: boolean;
  UnChecked7: boolean;
  Checked8: boolean;
  UnChecked8: boolean;
  UnChecked9: boolean;
  Checked9: boolean;
  Checked10: boolean;
  Checked11: boolean;
  Checked12: boolean;
  UnChecked12: boolean;
  UserEmail: any;
  PrimaryPhoneValue: string;
  PhonePattern: any;

  constructor(private fb: FormBuilder, private accountservice: Accountservice,) {
    this.users = JSON.parse(localStorage.getItem("user"));
    console.log(this.users);
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }

  ngOnInit(): void {
    this.buildPersonalForm();
    this.buildContInfoForm();
    this.buildAcctInfoForm();
    this.dropdownMenusList();



    $(document).ready(function () {
      // Step1
      $("button.next-step1").click(function () {
        document.getElementById('contactinfo-tab').classList.remove('disabled');
        document.getElementById('contactinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step2
      $("button.next-step2").click(function () {
        document.getElementById('additionalinfo-tab').classList.remove('disabled');
        document.getElementById('additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      $("button.prev-step2").click(function () {
        document.getElementById('personalInfo-tab').classList.remove('disabled');
        document.getElementById('personalInfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step3
      $("button.next-step3").click(function () {
        document.getElementById('signup-additionalinfo-tab').classList.remove('disabled');
        document.getElementById('signup-additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      $("button.prev-step3").click(function () {
        document.getElementById('contactinfo-tab').classList.remove('disabled');
        document.getElementById('contactinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });
      // Step4
      $("button.prev-step4").click(function () {
        document.getElementById('additionalinfo-tab').classList.remove('disabled');
        document.getElementById('additionalinfo-tab').click();
        $(".item:not(.active)").addClass("disabled");
      });

      $('.category-buttons .item').on('shown.bs.tab', function (event) {
        $(event.relatedTarget).addClass('done');
      });
    });
  }


  buildPersonalForm() {
    this.PersonalInfo = this.fb.group({
      Title: [],
      FirstName: ['', Validators.required],
      MiddleName: [''],
      LastName: ['', Validators.required],
      PracticeId: ['new provider'],
      PracticeName: ['', Validators.required],
      Degree: ['', Validators.required,],
      Speciality: ['', Validators.required],
      NPI: ['', Validators.required],

    })
    this.PersonalInfo.get('Title').setValue('Dr')
  }

  buildContInfoForm() {
    this.ContactInfomation = this.fb.group({
      PracticeAddress: ['', Validators.required],
      SuiteNumber: [''],
      PrimaryPhone: ['', Validators.required],
      MobilePhone: [''],
    })
  }
  buildAcctInfoForm() {
    this.AccountInfomation = this.fb.group({
      Email: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$')]],
      AltEmail: ['', Validators.pattern('^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$')],
      EncryptedPassword: ['', [Validators.required, Validators.minLength(5)]],
      ConfirmPassword: ['', Validators.required]
    }, { validators: this.MatchPassword })

  }

  MatchPassword(AC: AbstractControl) {
    let password = AC.get('EncryptedPassword').value;
    if (AC.get('ConfirmPassword').touched || AC.get('ConfirmPassword').dirty) {
      let verifyPassword = AC.get('ConfirmPassword').value;

      if (password != verifyPassword) {
        AC.get('ConfirmPassword').setErrors({ MatchPassword: true })
      } else {
        return null
      }
    }
  }

  dropdownMenusList() {
    this.nameTitle = [
      { titleId: 1, titleName: 'Dr' },
      { titleId: 2, titleName: 'Mr' },
      { titleId: 3, titleName: 'Ms' },
      { titleId: 4, titleName: 'Mrs' },
    ];
    this.credentials = [
      { credId: 1, credName: 'DDS' },
      { credId: 2, credName: 'DMD' },
      { credId: 3, credName: 'MD' },
      { credId: 4, credName: 'DO' },
      { credId: 5, credName: 'RDH' },
      { credId: 6, credName: 'N/A Degree' },
    ];
    this.speciality = [
      { specId: 1, specName: 'Dentistry' },
      { specId: 2, specName: 'Endodontics' },
      { specId: 3, specName: 'Oral and maxillofacial Pathology' },
      { specId: 4, specName: 'Oral and Maxillofacial Radiology' },
      { specId: 5, specName: 'Oral and Maxillofacial Surgery' },
      { specId: 6, specName: 'Orthodontics and Dentofacial Orthopedics' },
      { specId: 7, specName: 'Pediatric Dentistry' },
      { specId: 8, specName: 'Periodontics' },
      { specId: 9, specName: 'Prosthodontics' },
      { specId: 10, specName: 'N/A speciality' },
    ];
  }

  personalInfoReq() {
    this.showpersonalInfoReq = false;
    this.showcontactInfoReq = true;
  }

  contactInfoReq(event) {
    if (event == 'prev') {
      this.showpersonalInfoReq = true;
      this.showcontactInfoReq = false;
    }
    else {
      this.showcontactInfoReq = false;
      this.showaccountInfoReq = true;
    }
  }

  accountInfoReq(event) {
    if (event == 'prev') {
      this.showcontactInfoReq = true;
      this.showaccountInfoReq = false;
    }
  }


  AddressVerification() {
    this.ContactInfomation.value;
    var practiceAddress = this.ContactInfomation.value.PracticeAddress || "";
    if (practiceAddress != null) {
      this.accountservice.VerifyAddress(practiceAddress).subscribe(resp => {
        if (resp.IsSuccess) {
          this.displayDialog = false;
          this.openPopupAddress();
          this.ValidAddressForUse = resp.Result["delivery_line_1"]+", "+resp.Result["last_line"]
          this.displaymsg = resp.EndUserMessage;
        }
        else {
          this.displayDialog = true;
          this.errorDisplay = false;
          this.openPopupAddress();
          this.displaymsg = resp.EndUserMessage;
        }
      });

    }

  }
  UseValidAddress() {
    //this.ValidAddressToUse = false;
    //this.displayVerifybtn = false;
  }
  UseValidatedAddress() {
    this.closePopupAddress();
    //this.ValidAddressToUse = false;
    //this.displayVerifybtn = true;
    this.ContactInfomation.get('PracticeAddress').setValue(this.ValidAddressForUse);
    //this.ContactInfomation.value.PracticeAddress = this.ValidAddressForUse;
    //this.displayAddress = "none";
  }
  openPopupAddress() {
    this.displayAddress = "block";
  }
  closePopupAddress() {
    this.displayAddress = "none";
  }

  GetPersonalInfo() {
    this.PersonalDetials = this.PersonalInfo.value;

  }
  GetContactInfo() {
    this.ContactDetails = this.ContactInfomation.value;
    console.log(this.ContactDetails);
  }
  GetAccountInfo() {

    this.AccountDetails = this.AccountInfomation.value;

  }

  SaveRegitration() {

    let reqparams = {
      Title: this.PersonalDetials.Title,
      FirstName: this.PersonalDetials.FirstName,
      MiddleName: this.PersonalDetials.MiddleName,
      LastName: this.PersonalDetials.LastName,
      PracticeName: this.PersonalDetials.PracticeName,
      Degree: this.PersonalDetials.Degree,
      Speciality: this.PersonalDetials.Speciality,
      NPI: this.PersonalDetials.NPI,
      PracticeAddress: this.ContactDetails.PracticeAddress,
      SuiteNumber: 'new suit',
      PrimaryPhone: this.ContactDetails.PrimaryPhone,
      MobilePhone: this.ContactDetails.MobilePhone,
      Email: this.AccountDetails.Email,
      AltEmail: this.AccountDetails.AltEmail,
      Password: this.AccountDetails.EncryptedPassword,
    }

    this.accountservice.RegisterNewProvider(reqparams).subscribe(registrationlist => {
      this.getResponse = registrationlist
      console.log(this.getResponse);
      if (this.getResponse.IsSuccess) {
        this.UserEmail = this.AccountDetails.Email
        this.alertWithSuccess();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: this.getResponse.EndUserMessage,
          width: '700',
        })
      }
    })
  }

  checkfield1() {
    let Firstname = this.PersonalInfo.value.FirstName;
    if (Firstname != "") {
      this.Checked1 = true;
      this.unChecked = false;
    }
  }
  checkfield2() {
    let MiddleName = this.PersonalInfo.value.MiddleName;
    if (MiddleName != "") {
      this.Checked2 = true;
      this.unChecked = false;
    }
  }
  checkfield3() {

    let LastName = this.PersonalInfo.value.LastName;
    if (LastName != "") {
      this.Checked3 = true;
      this.unChecked = false;
    }
  }
  checkfield4() {
    let PracticeName = this.PersonalInfo.value.PracticeName;
    if (PracticeName != "") {
      this.Checked4 = true;
      this.unChecked = false;
    }
  }
  checkfield5() {
    let NPI = this.PersonalInfo.value.NPI;
    if (NPI != "") {
      this.Checked5 = true;
      this.unChecked = false;
    }
  }
  unchekedfiled() {
    this.Checked1 = false;
    this.Checked2 = false;
    this.Checked3 = false;
    this.Checked4 = false;
    this.Checked5 = false;
    this.unChecked = false;
    this.Checked10 = false;
    this.Checked11 = false;
    //this.Checked12=true;
  }
  checkfield6() {
    let address = this.ContactInfomation.value.PracticeAddress;
    if (address == "") {
      this.Checked6 = false;
      this.UnChecked6 = false;
    }
    else {
      this.Checked6 = true;
      this.UnChecked6 = true;
    }
  }
  unchekedfiled6() {
    let address = this.ContactInfomation.value.PracticeAddress;
    if (address == "") {
      this.Checked6 = false;
      this.UnChecked6 = false;
    }
    if (address != "") {
      this.Checked6 = false;
      //this.Checked6=false;
    }
    // else {
    //   this.Checked6 = false;
    //   this.UnChecked6 = false;
    // }

  }
  checkField7() {
    if (this.AccountInfomation.value.Email == "") {
      this.UnChecked7 = true;
      this.Checked7 = false
    }
    if (this.AccountInfomation.controls['Email'].invalid) {
      this.Checked7 = false;
      this.UnChecked7 = true;
    }
    else {
      this.Checked7 = true;
    }
  }
  UncheckField7() {
    this.UnChecked7 = false;
    this.Checked7 = false;

  }
  checkField8() {
    if (this.AccountInfomation.value.EncryptedPassword == "") {
      this.UnChecked8 = true;
      this.Checked8 = false
    }
    if (this.AccountInfomation.controls['EncryptedPassword'].invalid) {
      this.UnChecked8 = true;
      this.Checked8 = false
    }
    else {
      this.Checked8 = true;
      this.UnChecked8 = false;
    }

  }
  UncheckField8() {
    this.UnChecked8 = false;
    this.Checked8 = false;
  }
  checkField9() {

    if (this.AccountInfomation.value.ConfirmPassword == "") {
      this.Checked9 = false;
      this.UnChecked9 = true;

    }
    if (this.AccountInfomation.controls['ConfirmPassword'].invalid) {
      this.Checked9 = false;
      this.UnChecked9 = true;
    }
    else {
      this.Checked9 = true;
      this.UnChecked9 = false;
    }
  }
  UncheckField9() {
    this.UnChecked9 = false;
    this.Checked9 = false;
  }
  checkfield10() {
    let PrimaryPhone = this.ContactInfomation.value.PrimaryPhone;
    if (PrimaryPhone == "") {
      this.Checked10 = false;

    }
    if (PrimaryPhone != "") {
      this.Checked10 = true;
    }
    $.event.propagate();
  }
  unchekedfiled10() {
    this.Checked10 = false
    $.event.propagate();
  }

  checkfield11() {
    let MobilePhone = this.ContactInfomation.value.MobilePhone;
    if (MobilePhone == "") {
      this.Checked11 = false;
    }
    if (MobilePhone != "") {
      this.Checked11 = true
    }
  }
  checkfield12() {
    if (this.AccountInfomation.value.AltEmail == "") {
      this.Checked12 = true
    }
    if (this.AccountInfomation.controls['AltEmail'].invalid) {
      this.Checked12 = false
      this.UnChecked12 = true;
    }
    else {
      this.Checked12 = true;
      this.UnChecked12 = false;
    }
  }
  unchekedfiled12() {
    if (this.AccountInfomation.value.AltEmail == "") {

      this.Checked12 = false
    }
    if (this.AccountInfomation.controls['AltEmail'].invalid) {
      this.Checked12 = false;
      this.UnChecked12 = false;
    }
  }

  EnterAddress(event) {
    debugger;
    if (event != "") {
      this.Checked6 = false
      this.UnChecked6 = true;
    }
  }
  EnterPassword(event) {
    let ConfirmPassword = this.AccountInfomation.value.ConfirmPassword;
    if (event == ConfirmPassword) {
      this.Checked9 = true;
      this.UnChecked9 = false;
    }
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ' + this.UserEmail,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '700',
    });
  }
}


