import { Component, OnInit } from '@angular/core';
import { PlatformLocation} from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Accountservice } from '../_services/account.service';
import { ViewModel, Registration } from '../_models/registration';


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
  PersonalInfo: FormGroup;
  ContactInfomation: FormGroup;
  AccountInfomation: FormGroup;
  displayDialog: boolean;
  displayAddress = "none";
  ValidAddressForUse: any;
  displaymsg: any;
  PersonalDetials: any;
  ContactDetails: any;
  AccountDetails: any;
  UseThisValue: any;
  ValidAddressToUse: boolean;
  displayVerifybtn: boolean;
  PhonePattern: any;
  viewModel: ViewModel = {} as ViewModel;
  registration: Registration = {} as Registration;
  url: string;

  constructor(private fb: FormBuilder, private accountservice: Accountservice,
    private plaformLocation: PlatformLocation) {

    this.url =plaformLocation.href.replace(plaformLocation.pathname,'/');
    //console.log(plaformLocation.href.replace(plaformLocation.pathname,'/'));
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
    this.buildAccountInfoForm();
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
      PrimaryPhone: ['', Validators.required],
      MobilePhone: [''],
    })
  }
  buildAccountInfoForm() {
    this.AccountInfomation = this.fb.group({
      Email: ['', [Validators.required, Validators.email, Validators.pattern('^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$')]],
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


  AddressVerification() {
    this.ContactInfomation.value;
    var practiceAddress = this.ContactInfomation.value.PracticeAddress || "";
    if (practiceAddress != null) {
      this.accountservice.VerifyAddress(practiceAddress).subscribe(resp => {
        if (resp.IsSuccess) {
          this.displayDialog = false;
          this.openPopupAddress();
          this.ValidAddressForUse = resp.Result["delivery_line_1"] + ", " + resp.Result["last_line"]
          this.displaymsg = resp.EndUserMessage;
        }
        else {
          this.displayDialog = true;
          this.openPopupAddress();
          this.displaymsg = resp.EndUserMessage;
        }
      });

    }

  }

  UseValidatedAddress() {
    this.closePopupAddress();
    this.ContactInfomation.get('PracticeAddress').setValue(this.ValidAddressForUse);
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
      URL: this.url
    }

    this.accountservice.RegisterNewProvider(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertWithSuccess();
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: resp.EndUserMessage,
          width: '700',
        })
      }
    })
  }

  validateConfirmPassword() {
    return (this.AccountInfomation.value.EncryptedPassword ===
      this.AccountInfomation.value.ConfirmPassword) && !this.AccountInfomation.controls['EncryptedPassword'].invalid;
  }

  alertWithSuccess() {
    Swal.fire({
      icon: 'success',
      title: 'Thank you for registering for an EHR1 Account! An email with instructions for how to complete  setup of your account has been sent to ' + this.AccountDetails.Email,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      width: '700',
    });
  }
}


