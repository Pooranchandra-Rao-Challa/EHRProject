
import { PatientNavbarComponent } from './../_navigations/patient.navbar/patient.navbar.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientProfile, PatientProfileSecurityQuestion } from './../_models/_patient/patientprofile';
import { PatientService } from 'src/app/_services/patient.service';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { User } from '../_models';
import { AlertMessage, ERROR_CODES } from '../_alerts/alertMessage';
import { SECURE_QUESTIONS } from 'src/app/_models/_patient/patientprofile';
import { UtilityService } from '../_services/utiltiy.service';
import { Accountservice } from '../_services/account.service';
import { AreaCode } from    '../_models/_admin/admins';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Attachment } from '../_models/_provider/LabandImage';
import { FileUploadService } from '../_services/file.upload.service';
import { PhotoFileProperties } from 'src/app/_models/_account/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  user: User;
  myControl = new FormControl();
  PatientProfile: PatientProfile = {};
  patientProfileSecurityQuestion: PatientProfileSecurityQuestion = {}
  updateSecurityQuestion: PatientProfileSecurityQuestion = {}
  patietnprofile: any
  filteredOptions: Observable<string[]>;
  filterNumbers: any;
  SourceData: any[];
  questions: any[] = SECURE_QUESTIONS;
  relationship: any = [
    { Id: '1', value: 'Parent-Mother' },
    { Id: '2', value: 'Parent-Father' },
    { Id: '3', value: 'Sibling-Sister' },
    { Id: '4', value: 'Sibling-Brother' },
    { Id: '5', value: 'Child-Daughter' },
    { Id: '6', value: 'Child-Son' },
    { Id: '8', value: 'Grandparent-Grandmother' },
    { Id: '9', value: 'Grandparent-Grandfather' },
    { Id: '10', value: 'Great Grandparent' },
    { Id: '11', value: 'Uncle' },
    { Id: '12', value: 'Aunt' },
    { Id: '13', value: 'Cousin' },
    { Id: '14', value: 'Other' },
    { Id: '15', value: 'UnKnown' },
  ]
  GenderData: any = [
    { Id: '1', value: 'male' },
    { Id: '2', value: 'female' },
    { Id: '3', value: 'other' },
    { Id: '4', value: 'unknown' }

  ]
  addressVerfied: boolean = false;
  manuallybtn: boolean = false;
  disableaddressverification: boolean = false;
  emergencyAdressVerfied: boolean = false;
  emergencyManuallybtn: boolean = false;
  emergencydisableaddressverification: boolean = false;
  filteredOptionsMobilePhone: any
  filteredOptionPrimaryPhone: any
  filteredOptionWorkPhone: any;
  filteredOptionEmergencyPhone: any
  myControlPrimaryPhone = new FormControl();
  myControlMobilePhone = new FormControl();
  myControlWorkPhone = new FormControl();
  myControlEmergencyPhone = new FormControl();
  @ViewChild("fileUpload", { static: true })
  fileUpload: ElementRef; files = [];
  Imagedata: string;
  @Output() PhotoValidatorEvent = new EventEmitter<PhotoFileProperties>();
  fileTypes = ".jpg,.gif,.png"
  AreaCodes: AreaCode[];
  SecurityAnswer: string;
  disableupcomingdates = new Date();

  constructor(private patientService: PatientService,
    private authenticationService: AuthenticationService,
    private alertmsg: AlertMessage,
    public datepipe: DatePipe,
    private PatientNavbar: PatientNavbarComponent,
    private accountservice: Accountservice,
    private uploadService: FileUploadService,
    private utilityService: UtilityService,) {
    this.user = authenticationService.userValue;
  }

  ngOnInit(): void {
    this.getPatientProfile();
    this.loadDefaults();
    this.PhotoValidatorEvent.subscribe((p: PhotoFileProperties) => {
      if (this.fileTypes.indexOf(p.FileExtension) > 0 && p.Size < 1024 * 1024
        && p.Width <= 300 && p.Height <= 300) {
        this.uploadFile(p.File);
      } else {
        this.alertmsg.displayMessageDailog(p.Message);
      }
    });
    this.filteredOptionsMobilePhone = this.myControlMobilePhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionPrimaryPhone = this.myControlPrimaryPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionWorkPhone = this.myControlWorkPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
    this.filteredOptionEmergencyPhone = this.myControlEmergencyPhone.valueChanges.pipe(startWith(''), map(value => this._filterAreaCode(value)));
  }

  getPatientProfile() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.PatientMyProfileByPatientId(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile = resp.ListResult[0];
        if (this.PatientProfile.WorkPhone == null) {
          this.PatientProfile.WorkPhonePreffix = '';
          this.PatientProfile.WorkPhoneSuffix = '';
        }
        else {
          let list = this.PatientProfile.WorkPhone;
          this.PatientProfile.WorkPhonePreffix = list.slice(0, 3);
          this.PatientProfile.WorkPhoneSuffix = list.slice(3, 10);
        }
      }
      if (this.PatientProfile.MobilePhone == null) {
        this.PatientProfile.MobilePhonePreffix = '';
        this.PatientProfile.MobilePhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.MobilePhone;
        this.PatientProfile.MobilePhonePreffix = list.slice(0, 3);
        this.PatientProfile.MobilePhoneSuffix = list.slice(3, 10);
      }
      if (this.PatientProfile.PrimaryPhone == null) {
        this.PatientProfile.PrimaryPhonePreffix = '';
        this.PatientProfile.PrimaryPhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.PrimaryPhone;
        this.PatientProfile.PrimaryPhonePreffix = list.slice(0, 3);
        this.PatientProfile.PrimaryPhoneSuffix = list.slice(3, 10);
      }
      if (this.PatientProfile.Phone == null) {
        this.PatientProfile.EmergencyPhonePreffix = '';
        this.PatientProfile.EmergencyPhoneSuffix = '';
      }
      else {
        let list = this.PatientProfile.Phone;
        this.PatientProfile.EmergencyPhonePreffix = list.slice(0, 3);
        this.PatientProfile.EmergencyPhoneSuffix = list.slice(3, 10);
      }
      this.updatePhoto();
    });
  }

  updatePatientMyProfile() {
    this.PatientProfile.strDateOfBirth = this.datepipe.transform(this.PatientProfile.DateOfBirth, "MM/dd/yyyy hh:mm:ss a");
    this.patientService.UpdatePatientMyprofile(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientNavbar.getPatientProfile();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP008"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP001"]);
      }
    });
  }

  updateContactInform() {
    this.PatientProfile.WorkPhone = this.PatientProfile.WorkPhonePreffix + this.PatientProfile.WorkPhoneSuffix;
    this.PatientProfile.MobilePhone = this.PatientProfile.MobilePhonePreffix + this.PatientProfile.MobilePhoneSuffix;
    this.PatientProfile.PrimaryPhone = this.PatientProfile.PrimaryPhonePreffix + this.PatientProfile.PrimaryPhoneSuffix;
    this.patientService.UpdateContactInformation(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP002"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP002"]);
      }
    });
  }

  updateEmergencyContact() {
    this.PatientProfile.Phone = this.PatientProfile.EmergencyPhonePreffix + this.PatientProfile.EmergencyPhoneSuffix
    this.patientService.UpdateEmergencyContact(this.PatientProfile).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP003"])
      }
      else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP003"]);
      }
    });
  }

  getpatientsecurityQuestions() {
    var req = {
      "PatientId": this.user.PatientId,
    }
    this.patientService.MyProfileSecurityQuestion(req).subscribe(
      resp => {
        if (resp.IsSuccess) {
          this.patientProfileSecurityQuestion = resp.ListResult[0]
        }
      }
    )
    this.updateSecurityQuestion = new PatientProfileSecurityQuestion();
  }

  ChangeSecurityQuestion() {
    this.updateSecurityQuestion.SecurityID = this.patientProfileSecurityQuestion.SecurityID;
    this.updateSecurityQuestion.PateientId = this.patientProfileSecurityQuestion.PateientId;
    if (this.SecurityAnswer == this.patientProfileSecurityQuestion.Answer) {
      this.patientService.UpdatePatientMyProfileSecurityQuestion(this.updateSecurityQuestion).subscribe(
        resp => {
          if (resp.IsSuccess) {
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2CP009"]);
          }
          else {
            this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP008"]);
          }
        });
    }
    else {
      this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP0011"]);
    }
  }

  AddressVerification() {
    this.accountservice.VerifyAddress(this.PatientProfile.Street).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile.city = resp.Result.components.city_name
        this.PatientProfile.state = resp.Result.components.state_abbreviation
        this.PatientProfile.StreetAddress = resp.Result.delivery_line_1
        this.PatientProfile.zip = resp.Result.components.zipcode
        this.PatientProfile.Street = "";
        this.addressVerfied = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0010"])
      }
      else {
        this.manuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP009"])
      }
    });
  }

  enableManualEntry() {
    this.manuallybtn = true;
    this.clearAddress();
  }

  clearAddress() {
    this.PatientProfile.Street = "";
    this.PatientProfile.city = ""
    this.PatientProfile.state = ""
    this.PatientProfile.StreetAddress = ""
    this.PatientProfile.zip = ""
  }

  enterAddressManually(item) {
    this.disableaddressverification = true;
  }

  EmergencyclearAddress() {
    this.PatientProfile.EmergencyStreet = "";
    this.PatientProfile.EmergencyCity = ""
    this.PatientProfile.EmergencyState = ""
    this.PatientProfile.EmergencyStreetAddress = ""
    this.PatientProfile.EmergencyZip = ""
  }

  emergencyAddressVerfied() {
    this.accountservice.VerifyAddress(this.PatientProfile.EmergencyStreet).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PatientProfile.EmergencyCity = resp.Result.components.city_name
        this.PatientProfile.EmergencyState = resp.Result.components.state_abbreviation
        this.PatientProfile.EmergencyStreetAddress = resp.Result.delivery_line_1
        this.PatientProfile.EmergencyZip = resp.Result.components.zipcode
        this.PatientProfile.EmergencyStreet = "";
        this.emergencyAdressVerfied = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["M2CP0010"])
      }
      else {
        this.emergencyManuallybtn = true;
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2CP009"])
      }
    });
  }

  emergencyEnableManualEntry() {
    this.EmergencyclearAddress();
    this.emergencyManuallybtn = true;
  }

  emergencyAddressEnterManually(item) {
    this.emergencydisableaddressverification = true;
  }

  enableSave() {
    return !(
      this.updateSecurityQuestion.Answer
      && this.updateSecurityQuestion.Question
      && this.updateSecurityQuestion.ConfiramationActive
    )
  }

  updatePhoto() {
    if (this.PatientProfile.ProfileImage != null) {
      let a: Attachment = {
        FileName: "",
        AttachmentId: "",
        FullFileName: this.PatientProfile.ProfileImage,
        EntityId: "",
        EntityName: ""
      }
      this.patientService.PhotoToBase64String(a).subscribe(resp => {
        if (resp.IsSuccess) {
          this.Imagedata = resp.Result;
        }
      });
    }
  }

  loadDefaults() {
    this.utilityService.AreaCodes()
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.AreaCodes = resp.ListResult as AreaCode[];
        } else {
          this.AreaCodes = [];
        }
      },
        error => {
        });

  }

  private _filterAreaCode(value: string): string[] {
    if (value == "") {
      return ['Please enter 1 or more numbers']
    }
    var _areaCodes = this.AreaCodes?.filter(option => option.AreaCode?.includes(value));
    if (_areaCodes?.length === 0) {
      return ['No Data Found']
    }
    return _areaCodes?.map(value => value.AreaCode);
  }

  onSelectedPrimaryPhoneCode(code: string) {
    this.PatientProfile.HomePhone = code;
  }

  onSelectedCellPhoneCode(code: string) {
    this.PatientProfile.MobilePhone = code;
  }

  onSelectedWorkPhone(code: string) {
    this.PatientProfile.WorkPhone = code;
  }

  onSelectedEmergencyPhone(code: string) {
    this.PatientProfile.Phone = code;
  }

  public onChange($event): any {
    if (this.fileUpload.nativeElement.files.length == 1) {
      let file = this.fileUpload.nativeElement.files[0];
      this.ValidateFileThenUpload(file, this.PhotoValidatorEvent);
      this.fileUpload.nativeElement.value = '';
    }
  }

  ValidateFileThenUpload(file: any, emitProperties: EventEmitter<PhotoFileProperties>) {
    let fileName = file.name;
    let fileExtension = fileName.replace(/^.*\./, '');
    let fileReader: FileReader = new FileReader();
    var message: string = ''
    fileReader.onload = function (e) {
      let img = new Image();
      img.src = e.target.result + "";
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        message =
          'File can\'t be uploaded. May be File Size, Width or Height in pixels is not matching with specified image properies.' +
          '\nName: ' + file.name +
          '\nSize: ' + Math.round(file.size) + ' bytes' +
          '\nWidth: ' + width +
          '\nHeight: ' + height;
        var photoProperties: PhotoFileProperties = {
          Width: width,
          Height: height,
          FileName: fileName,
          FileExtension: fileExtension,
          Size: file.size,
          File: file,
          Message: message
        };
        emitProperties.emit(photoProperties);
      }
    };
    fileReader.readAsDataURL(file);
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.set('photos', file, file.name);
    file.inProgress = true; //<span class="kc">
    this.uploadService.UploadFile(formData, "Photos", this.user.UserId).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          let uploadInfo = event.body as Attachment;
          this.PatientProfile.ProfileImage = uploadInfo.FullFileName;
          if (this.PatientProfile.PatientId != null && this.PatientProfile.PatientId != "") {
            this.patientService.UpdatePatientPhoto(this.PatientProfile).subscribe(resp => {
              if (resp.IsSuccess) {
                this.updatePhoto();
              }
            })
          }
        }
      });
  }

  resetSecurityQuestion() {
    this.SecurityAnswer = '';
    this.updateSecurityQuestion = new PatientProfileSecurityQuestion();
  }
}

