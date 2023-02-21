import { throwError } from 'rxjs';

import { User } from './../../../_models/_account/user';
import { PatientService } from './../../../_services/patient.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientNotificationSettingType } from 'src/app/_models/_provider/messages';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-notification.settings',
  templateUrl: './notification.settings.component.html',
  styleUrls: ['./notification.settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit, AfterViewInit {
  PhonePattern: {};
  hasNotification: false;
  user: User;
  patinetNotificationTypes: PatientNotificationSettingType[] = [];
  SMSNotificatonType: PatientNotificationSettingType = {};
  EmailNotificatonType: PatientNotificationSettingType = {};
  VoiceNotificatonType: PatientNotificationSettingType = {};
  durationSMSMaxValue: number = 30;
  smsMaxValue: number = 30;
  smsMinValue: number = 1;
  emailMaxValue: number = 30;
  emailMinValue: number = 1;
  voiceMaxValue: number = 30;
  voiceMinValue: number = 1;
  disableSMS: boolean = false;
  disableEmail: boolean = false;
  disableVoice: boolean = false;
  smsButtonText: string = "Add SMS"
  emailButtonText: string = "Add Email"
  voiceButtonText: string = "Add Voice"
  url: string;
  smsForm = this.formBuilder.group({
    NoOfDays: ['', [Validators.required, Validators.min(this.smsMinValue), Validators.max(this.smsMaxValue)]],
    Duration: ['', [Validators.required]],
    PhoneNumber: ['', [Validators.required, Validators.pattern("^((\\+1-?)|0)?[0-9]{10}$")]],
    ConfirmPhoneNumber: ['', [Validators.required, Validators.pattern("^((\\+1-?)|0)?[0-9]{10}$")]],
    NotifyThrough: ['']
  }, {
    validators: this.ConfirmedValidator('PhoneNumber', 'ConfirmPhoneNumber')
  });
  emailForm = this.formBuilder.group({
    NoOfDays: ['', [Validators.required, Validators.min(this.emailMinValue), Validators.max(this.emailMaxValue)]],
    Duration: ['', [Validators.required]],
    Email: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+[\.]{1}[A-Za-z]{2,4}$")]],
    ConfirmEmail: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$")]],
    NotifyThrough: ['']
  }, {
    validators: this.ConfirmedValidator('Email', 'ConfirmEmail')
  });
  automatedVoiceForm = this.formBuilder.group({
    NoOfDays: ['', [Validators.required, Validators.min(this.voiceMinValue), Validators.max(this.voiceMaxValue)]],
    Duration: ['', [Validators.required]],
    PhoneNumber: ['', [Validators.required, Validators.pattern("^((\\+1-?)|0)?[0-9]{10}$")]],
    ConfirmPhoneNumber: ['', [Validators.required, Validators.pattern("^((\\+1-?)|0)?[0-9]{10}$")]],
    NotifyThrough: ['']
  }, {
    validators: this.ConfirmedValidator('PhoneNumber', 'ConfirmPhoneNumber')
  });
  constructor(private patientService: PatientService,
    private authService: AuthenticationService,
    private alertmsg: AlertMessage,
    private plaformLocation: PlatformLocation,
    private formBuilder: FormBuilder,) {
    this.url = `${plaformLocation.protocol}//${plaformLocation.hostname}:${plaformLocation.port}/`;
    this.PhonePattern = {
      0: {
        pattern: new RegExp('\\d'),
        symbol: 'X',
      },
    };
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    console.log(charCode);

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  ngOnInit(): void {

    this.user = this.authService.userValue;
    let patientId = this.user.PatientId ? this.user.PatientId :
      this.authService.viewModel.Patient.PatientId;
    this.initNotifications();
    this.patientService.HasNotifications(patientId).subscribe(resp => {
      this.hasNotification = resp.Result;
    })

  }

  initNotifications() {
    let patientId = this.user.PatientId ? this.user.PatientId :
      this.authService.viewModel.Patient.PatientId;
    this.patientService.PatientNotificationSettingTypes(patientId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patinetNotificationTypes = resp.ListResult as PatientNotificationSettingType[]
        console.log(this.patinetNotificationTypes);
        console.log(this.smsButtonText);
        console.log(this.disableSMS);

        var value = this.patinetNotificationTypes.filter(fn => fn.NotificationType == "text_sms");
        if (value && value.length > 0) this.SMSNotificatonType = value[0];
        else this.SMSNotificatonType = {}
        if (this.SMSNotificatonType.NotificationTypeId != null && this.SMSNotificatonType.IsVerified)
          this.smsButtonText = "Update SMS";
        value = this.patinetNotificationTypes.filter(fn => fn.NotificationType == "email");
        if (value && value.length > 0) this.EmailNotificatonType = value[0];
        else this.EmailNotificatonType = {}
        if (this.EmailNotificatonType.NotificationTypeId != null && this.EmailNotificatonType.IsVerified)
          this.emailButtonText = "Update Email";
        value = this.patinetNotificationTypes.filter(fn => fn.NotificationType == "automated_voice");
        if (value && value.length > 0) this.VoiceNotificatonType = value[0];
        else this.VoiceNotificatonType = {}
        if (this.VoiceNotificatonType.NotificationTypeId != null && this.VoiceNotificatonType.IsVerified)
          this.voiceButtonText = "Update Voice";
      }else{
        this.SMSNotificatonType = {}
        this.EmailNotificatonType = {}
        this.VoiceNotificatonType = {}
      }
      this.setDefaults(this.SMSNotificatonType, 'text_sms');
      this.setDefaults(this.EmailNotificatonType, 'email');
      this.setDefaults(this.VoiceNotificatonType, 'automated_voice');
      this.setFormValues(this.smsForm, this.SMSNotificatonType);
      this.setFormValues(this.emailForm, this.EmailNotificatonType);
      this.setFormValues(this.automatedVoiceForm, this.VoiceNotificatonType);

    })
  }
  ngAfterViewInit() {

    this.smsForm.markAsUntouched();
  }
  selectChanged(event, notificationtype) {
    switch (notificationtype) {
      case 'text_sms':
        if (event.value == 'months') {
          this.smsMaxValue = 12;
        }
        else this.smsMaxValue = 30;
        break;
      case 'email':
        if (event.value == 'months') {
          this.emailMaxValue = 12;
        }
        else this.emailMaxValue = 30;
        break;
      case 'automated_voice':
        if (event.value == 'months') {
          this.voiceMaxValue = 12;
        }
        else this.voiceMaxValue = 30;
        break;
    }
  }
  setDefaults(data: PatientNotificationSettingType, notificationType: string) {
    if (data.NoOfDays == null) data.NoOfDays = 1;
    if (data.Duration == null) data.Duration = "days";
    data.NotificationType = notificationType;
  }

  setFormValues(form: FormGroup, data: PatientNotificationSettingType) {
    if (data.NotificationType != 'email')
      form.setValue({
        NoOfDays: data.NoOfDays,
        Duration: data.Duration,
        PhoneNumber: data.PhoneNumber ?? "",
        ConfirmPhoneNumber: data.PhoneNumber ?? "",
        NotifyThrough: data.NotifyThroMessage ?? false
      })
    else
      form.setValue({
        NoOfDays: data.NoOfDays,
        Duration: data.Duration,
        Email: data.Email ?? "",
        ConfirmEmail: data.Email ?? "",
        NotifyThrough: data.NotifyThroEmail ?? false
      })
  }


  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }



  get Status(): string {
    return this.hasNotification ? "Enabled" : "Disabled"
  }

  get StatusButtonText(): string {
    return this.hasNotification ? "Disable Notifications" : "Enable Notifications"
  }

  EnableDisableNotifications() {
    this.patientService.EnableDistableNotification(this.user.PatientId ? this.user.PatientId :
      this.authService.viewModel.Patient.PatientId).subscribe((resp) => {
        this.hasNotification = resp.Result;
      })
  }


  get HasEmail(): boolean {
    return this.authService.viewModel.Patient.Email != null && this.authService.viewModel.Patient.Email != 'No Email';
  }

  get HasCellNumber(): boolean {
    return this.authService.viewModel.Patient.MobilePhone != null;
  }
  get HasHomeNumber(): boolean {
    return this.authService.viewModel.Patient.PrimaryPhone != null;
  }

  UseHomeNumber() {
    let val = this.automatedVoiceForm.value;
    val.PhoneNumber = this.authService.viewModel.Patient.PrimaryPhone;
    val.ConfirmPhoneNumber = this.authService.viewModel.Patient.PrimaryPhone;
    this.automatedVoiceForm.setValue(val);
  }


  UseCellNumber(isSms: boolean) {
    if (isSms) {
      let val = this.smsForm.value;
      val.PhoneNumber = this.authService.viewModel.Patient.MobilePhone;
      val.ConfirmPhoneNumber = this.authService.viewModel.Patient.MobilePhone;
      this.smsForm.setValue(val);
    } else {
      let val = this.automatedVoiceForm.value;
      val.PhoneNumber = this.authService.viewModel.Patient.MobilePhone;
      val.ConfirmPhoneNumber = this.authService.viewModel.Patient.MobilePhone;
      this.automatedVoiceForm.setValue(val);
    }
  }

  UseEmail() {
    let val = this.emailForm.value;
    console.log(this.authService.viewModel.Patient);
    if (this.authService.viewModel.Patient.Email != 'No Email') {
      val.Email = this.authService.viewModel.Patient.Email;
      val.ConfirmEmail = this.authService.viewModel.Patient.Email;
      this.emailForm.setValue(val);
    }
  }

  ResetEmailButtonText = (oldtext: string) => {
    this.disableEmail = false;
    this.emailButtonText = oldtext;
  }

  ResetSMSButtonText = (oldtext: string) => {
    this.disableSMS = false;
    this.smsButtonText = oldtext;
  }

  ResetVoiceButtonText = (oldtext: string) => {
    this.disableVoice = false;
    this.voiceButtonText = oldtext;
  }
  SaveEmail() {
    let oldtext = this.emailButtonText;
    if (!this.emailForm.invalid) {
      this.disableEmail = true;
      this.emailButtonText = "Saving..."
      // call the data update service.
      var formValues = this.emailForm.value;
      this.EmailNotificatonType.Email = formValues.Email
      this.EmailNotificatonType.ConfirmEmail = formValues.ConfirmEmail
      this.EmailNotificatonType.Duration = formValues.Duration;
      this.EmailNotificatonType.NoOfDays = formValues.NoOfDays;
      this.EmailNotificatonType.NotifyThroEmail = formValues.NotifyThrough;
      this.EmailNotificatonType.PatientId = this.user.PatientId ? this.user.PatientId :
        this.authService.viewModel.Patient.PatientId;
      this.EmailNotificatonType.URL = this.url;
      console.log(this.EmailNotificatonType);
      this.UpdateNofication(this.EmailNotificatonType, "M2CN002", "E2CN002", this.ResetEmailButtonText, oldtext);

    }
  }

  SaveSms() {
    let oldtext = this.smsButtonText;
    if (!this.smsForm.invalid) {
      // call the data update service.
      this.disableSMS = true;
      this.smsButtonText = "Saving ...";
      var formValues = this.smsForm.value;
      this.SMSNotificatonType.PhoneNumber = formValues.PhoneNumber
      this.SMSNotificatonType.ConfirmPhoneNumber = formValues.ConfirmPhoneNumber
      this.SMSNotificatonType.Duration = formValues.Duration;
      this.SMSNotificatonType.NoOfDays = formValues.NoOfDays;
      this.SMSNotificatonType.NotifyThroMessage = formValues.NotifyThrough;
      this.SMSNotificatonType.PatientId = this.user.PatientId ? this.user.PatientId :
        this.authService.viewModel.Patient.PatientId;
      this.SMSNotificatonType.URL = this.url;
      console.log(this.SMSNotificatonType);
      this.UpdateNofication(this.SMSNotificatonType, "M2CN001", "E2CN001", this.ResetSMSButtonText, oldtext);
    }
  }

  SaveVoice() {
    let oldtext = this.smsButtonText;
    if (!this.automatedVoiceForm.invalid) {
      // call the data update service.
      this.disableVoice = true;
      this.voiceButtonText = "Saving ...";
      var formValues = this.automatedVoiceForm.value;
      this.VoiceNotificatonType.PhoneNumber = formValues.PhoneNumber
      this.VoiceNotificatonType.ConfirmPhoneNumber = formValues.ConfirmPhoneNumber
      this.VoiceNotificatonType.Duration = formValues.Duration;
      this.VoiceNotificatonType.NoOfDays = formValues.NoOfDays;
      this.VoiceNotificatonType.NotifyThroMessage = formValues.NotifyThrough;
      this.VoiceNotificatonType.PatientId = this.user.PatientId ? this.user.PatientId :
        this.authService.viewModel.Patient.PatientId;
      this.VoiceNotificatonType.URL = this.url;
      console.log(this.VoiceNotificatonType);
      this.UpdateNofication(this.VoiceNotificatonType, "M2CN003", "E2CN003", this.ResetVoiceButtonText, oldtext);
    }
  }

  UpdateNofication(data: PatientNotificationSettingType, successMessage: string, errorMessage: string,
    callback, oldtext: string) {
    return this.patientService.AddNotification(data).subscribe(
      (resp) => {
        if (resp.IsSuccess) {
          // show message.
          this.initNotifications();
          this.alertmsg.displayMessageDailog(ERROR_CODES[successMessage]);
          callback(oldtext)
          return true;
        } else {
          // error message.
          callback(oldtext)
          this.alertmsg.displayErrorDailog(ERROR_CODES[errorMessage]);

        }
      }
    )
  }
  clearSmsNotificationText: string = "Clear SMS Notification"
  clearEmailNotificationText: string = "Clear Email Notification"
  clearVoiceNotificationText: string = "Clear Voice Notification"
  isClearing(notificationType: string): boolean {
    switch (notificationType) {
      case 'text_sms':
        return this.clearSmsNotificationText == 'Clearing Notification'
        break;
      case 'email':
        return this.clearEmailNotificationText == 'Clearing Notification'
        break;
      case 'automated_voice':
        return this.clearVoiceNotificationText == 'Clearing Notification'
        break;
    }
  }
  ClearNotification(notificationType: string) {
    let patientId = this.user.PatientId ? this.user.PatientId :
      this.authService.viewModel.Patient.PatientId;
    var data = {
      PatientId: patientId,
      Url: this.url,
      NotificationTypeId: ''
    };
    let oldText = '';
    switch (notificationType) {
      case 'text_sms':
        oldText = this.clearSmsNotificationText;
        data.NotificationTypeId = this.SMSNotificatonType.NotificationTypeId
        this.clearSmsNotificationText = 'Clearing Notification'
        break;
      case 'email':
        oldText = this.clearEmailNotificationText;
        data.NotificationTypeId = this.EmailNotificatonType.NotificationTypeId
        this.clearEmailNotificationText = 'Clearing Notification'
        break;
      case 'automated_voice':
        oldText = this.clearVoiceNotificationText;
        data.NotificationTypeId = this.VoiceNotificatonType.NotificationTypeId
        this.clearVoiceNotificationText = 'Clearing Notification'
        break;
    }


    this.patientService.ClearNotification(data).subscribe(resp => {
      console.log(resp);

      switch (notificationType) {
        case 'text_sms':
          this.clearSmsNotificationText = oldText;
          break;
        case 'email':
          this.clearEmailNotificationText = oldText;
          break;
        case 'automated_voice':
          this.clearVoiceNotificationText = oldText;
      }
      if (resp.IsSuccess) {
        this.initNotifications();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CN005"]);
      } else {
        // show error message
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CN005"]);
      }
    })
  }

  resendSmsNotificationText: string = "Resend SMS Notification"
  resendEmailNotificationText: string = "Resend Email Notification"
  resendVoiceNotificationText: string = "Resend Voice Notification"
  isResending(notificationType: string): boolean {
    switch (notificationType) {
      case 'text_sms':
        return this.resendSmsNotificationText == 'Resending Notification'
        break;
      case 'email':
        return this.resendEmailNotificationText == 'Resending Notification'
        break;
      case 'automated_voice':
        return this.resendVoiceNotificationText == 'Resending Notification'
        break;
    }
  }
  ResendVerficationCode(notificationType: string) {
    let patientId = this.user.PatientId ? this.user.PatientId :
      this.authService.viewModel.Patient.PatientId;
    var data = {
      PatientId: patientId,
      Url: this.url,
      NotificationTypeId: ''
    };

    let oldText = '';
    switch (notificationType) {
      case 'text_sms':
        oldText = this.resendSmsNotificationText;
        data.NotificationTypeId = this.SMSNotificatonType.NotificationTypeId
        this.resendSmsNotificationText = 'Resending Notification'
        break;
      case 'email':
        oldText = this.resendEmailNotificationText;
        data.NotificationTypeId = this.EmailNotificatonType.NotificationTypeId
        this.resendEmailNotificationText = 'Resending Notification'
        break;
      case 'automated_voice':
        oldText = this.resendVoiceNotificationText;
        data.NotificationTypeId = this.VoiceNotificatonType.NotificationTypeId
        this.resendVoiceNotificationText = 'Resending Notification'
        break;
    }


    this.patientService.ResendVerficationCode(data).subscribe(resp => {
      switch (notificationType) {
        case 'text_sms':
          this.resendSmsNotificationText = oldText;
          break;
        case 'email':
          this.resendEmailNotificationText = oldText;
          break;
        case 'automated_voice':
          this.resendVoiceNotificationText = oldText;
      }
      if (resp.IsSuccess) {
        // show success message.
        this.initNotifications();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CN004"]);
      } else {
        // show error message
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CN004"]);
      }
    })
  }

  async VerifySmsPhoneNumber() {

    const { value: securitycode } = await Swal.fire({
      title: 'Message Phone Verification',
      text: 'Enter the verfication code sent to this phone number to enable appointment notification messages.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      padding: '1px !important',
      customClass: {
        title: 'notification-modal-header login-header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        cancelButton: 'login-cancel-button login-cancel-button1',
        confirmButton: 'login-confirm-button login-confirm-button1'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Go Back',
      confirmButtonText: 'Verify it !',
      backdrop: true,
      inputPlaceholder: 'Enter your verification code',


    });
    if (securitycode) {
      this.patientService.ValidateNotificationType(
        { NotificationTypeId: this.SMSNotificatonType.NotificationTypeId, SecurityCode: securitycode }).subscribe((resp) => {
          if (resp.IsSuccess) {
            this.initNotifications();
            this.disableSMS = false;
          }
        })
    }

  }

  async VerifyVoicePhoneNumber() {

    const { value: securitycode } = await Swal.fire({
      title: 'Voice Message Phone Verification',
      text: 'Enter the verfication code sent to this phone number to enable appointment notification messages.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      padding: '1px !important',
      customClass: {
        title: 'notification-modal-header login-header-font',
        //container:'pop-contrainer',
        input: 'swal-input',
        cancelButton: 'login-cancel-button login-cancel-button1',
        confirmButton: 'login-confirm-button login-confirm-button1'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Go Back',
      confirmButtonText: 'Verify it !',
      backdrop: true,
      inputPlaceholder: 'Enter your email address',


    });
    if (securitycode) {
      this.patientService.ValidateNotificationType(
        { NotificationTypeId: this.VoiceNotificatonType.NotificationTypeId, SecurityCode: securitycode }).subscribe((resp) => {
          if (resp.IsSuccess) {
            this.initNotifications();
            this.disableVoice = false;
          }
        })
    }

  }

  async VerifyEmail() {
    const { value: securitycode } = await Swal.fire({
      title: 'Email Verification',
      text: 'Enter the verification code sent to this email to enable appointment notification mails.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      padding: '1px !important',
      customClass: {
        title: 'notification-modal-header login-header-font',
        //container:'pop-message',
        input: 'swal-input',
        cancelButton: 'login-cancel-button login-cancel-button1',
        confirmButton: 'login-confirm-button login-confirm-button1'
      },
      reverseButtons: true,
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Go Back',
      confirmButtonText: 'Verify it !',
      backdrop: true,
      inputPlaceholder: 'Enter your verification code',


    });
    if (securitycode) {
      this.patientService.ValidateNotificationType(
        {
          NotificationTypeId: this.EmailNotificatonType.NotificationTypeId,
          SecurityCode: securitycode
        }).subscribe((resp) => {
          if (resp.IsSuccess) {
            this.initNotifications();
            this.disableEmail = false;
          }
        })
    }
  }

}
