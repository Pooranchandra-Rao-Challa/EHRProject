import { Actions } from 'src/app/_models';
import { LocationSelectService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { Component, OnInit, NgModule, TemplateRef } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { SettingsService } from '../../_services/settings.service';
import { User } from '../../_models';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentStatus, AppointmentType, GeneralSchedule, NewUser, RoomsSlot } from '../../_models/_provider/_settings/settings';
import { IdService } from '../../_helpers/_id.service';
import { AlertMessage, ERROR_CODES } from './../../_alerts/alertMessage';
import { UserDialogComponent } from 'src/app/dialogs/user.dialog/user.dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from 'src/app/overlay.service';
declare var $: any;

@Component({
  selector: 'schedule-settings',
  templateUrl: './schedule.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class ScheduleComponent implements OnInit {
  user: User;
  ClinicLocations: any;
  roomForm: FormGroup;
  statusForm: FormGroup;
  typeForm: FormGroup;
  appointmentStatusData: AppointmentStatus[];
  appointmentTypeData: AppointmentType[];
  roomsData: RoomsSlot[];
  customizedspinner: boolean;
  roomsOnEdit: number[] = [];
  statusOnEdit: number[] = [];
  typeOnEdit: number[] = [];
  Actions = Actions;
  generalSchedule: GeneralSchedule = {} as GeneralSchedule;
  userDialogComponent = UserDialogComponent;

  constructor(private authService: AuthenticationService,
    private settingsService: SettingsService,
    private fb: FormBuilder,
    public overlayService: OverlayService,
    private idService: IdService,
    private locationChanged: LocationSelectService,
    private alertmsg: AlertMessage) {
    this.user = authService.userValue;

  }
  ngOnInit(): void {
    this.getGeneralSchedule();
    this.getLocationsList();
    this.getAppointmentStatus();
    this.getAppointmentType();
    this.getRoomsForLocation();
    this.buildRoomsForm();
    this.buildStatusForm();
    this.buildTypeForm();
    this.locationChanged.getData().subscribe(location => {
      this.getRoomsForLocation();
    })
  }

  // get display Location Details
  getLocationsList() {
    this.ClinicLocations = [];

    this.settingsService.PracticeLocations(this.user.ProviderId, this.user.ClinicId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ClinicLocations = resp.ListResult;
      }
    });
  }

  // Rooms
  buildRoomsForm() {
    this.roomForm = this.fb.group({
      rooms: this.fb.array([]),
    });
  }
  rooms(): FormArray {
    return this.roomForm.get("rooms") as FormArray
  }
  newRoom(): FormGroup {
    return this.fb.group({
      RoomId: [''],
      RoomName: ['']
    })
  }
  addRoom() {
    let room = this.newRoom();
    let newroomId = this.idService.decrementIds('room');
    room.controls["RoomId"].setValue(newroomId)
    this.pushRoom(room);
    this.roomsOnEdit.push(this.rooms().length);
  }
  pushRoom(room: FormGroup) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.rooms().push(room);
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 1000);
  }
  clearRooms() {
    this.rooms().clear();
  }
  clearSaveIndex(roomIndex: number) {
    let findIndex = this.roomsOnEdit.findIndex(roomindex => roomIndex)
    findIndex !== -1 && this.roomsOnEdit.splice(findIndex, 1)
    //if(!isNaN(addIndex))
  }
  isNewRoom(roomIndex: number) {
    let id = this.rooms().controls[roomIndex].get('RoomId').value
    if (isNaN(Number(id))) {
      return false || this.roomsOnEdit.findIndex(roomindex => roomindex === roomIndex) > -1;
    } return true;
  }
  onEditRooms(roomIndex: number) {
    this.roomsOnEdit.push(roomIndex);
  }

  // Appointment Statuses
  buildStatusForm() {
    this.statusForm = this.fb.group({
      status: this.fb.array([]),
    });
  }
  status(): FormArray {
    return this.statusForm.get("status") as FormArray
  }
  newStatus(appointmentStatus: AppointmentStatus = {}): FormGroup {
    return this.fb.group({
      Id: [appointmentStatus.Id],
      Name: [appointmentStatus.Name],
      Colour: [appointmentStatus.Colour],
      Editable: [appointmentStatus.Editable]
    })
  }
  addStatus() {
    let status = this.newStatus();
    let newstatusId = this.idService.decrementIds('appointmentStatus');
    status.controls["Id"].setValue(newstatusId)
    this.pushStatus(status);
    this.statusOnEdit.push(this.status().length);
  }
  pushStatus(appointmentstatus: FormGroup) {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.status().push(appointmentstatus);
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 1000);
  }
  clearStatus() {
    this.status().clear();
  }
  clearSaveStatusIndex(statusIndex: number) {
    let findIndex = this.statusOnEdit.findIndex(statusindex => statusIndex)
    findIndex !== -1 && this.statusOnEdit.splice(findIndex, 1)
  }
  isNewStatus(statusIndex: number) {
    let id = this.status().controls[statusIndex].get('Id').value
    if (isNaN(Number(id))) {
      return false || this.statusOnEdit.findIndex(statusindex => statusindex === statusIndex) > -1;
    } return true;
  }
  onEditStatus(statusIndex: number) {
    this.statusOnEdit.push(statusIndex);
  }

  // Appointment Type
  buildTypeForm() {
    this.typeForm = this.fb.group({
      type: this.fb.array([]),
    });
  }
  type(): FormArray {
    return this.typeForm.get("type") as FormArray
  }
  newType(appointmentType: AppointmentType = new AppointmentType()): FormGroup {
    return this.fb.group({
      Id: appointmentType.Id,
      AppointmentType: appointmentType.AppointmentType,
      Colour: appointmentType.Colour,
      Editable: appointmentType.Editable,
      AppointmenttypeStatus: false
    })
  }
  addType() {
    let appType = this.newType();
    let newtypeId = this.idService.decrementIds('appointmentType');
    appType.controls["Id"].setValue(newtypeId)
    this.pushType(appType);
    this.typeOnEdit.push(this.type().length);
  }
  pushType(appointmenttype: FormGroup) {
    //this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.type().push(appointmenttype);
    // setTimeout(() => {
    //   this.customizedspinner = false;
    //   $('body').removeClass('loadactive')
    // }, 1000);
  }
  clearType() {
    this.type().clear();
  }
  clearSaveTypeIndex(typeIndex: number) {
    let findIndex = this.typeOnEdit.findIndex(typeindex => typeIndex)
    findIndex !== -1 && this.typeOnEdit.splice(findIndex, 1)
  }
  isTypeEditable(rowIndex: number) {
    let ctlValue = this.typeForm.controls.type["controls"][rowIndex].value;
    let id = ctlValue.Id;
    let editable = this.typeOnEdit.indexOf(rowIndex) >-1 && ctlValue.Editable

    let flag =  Number(id) < 0 ? true : editable;
    return flag;
  }
  onEditType(typeIndex: number) {
    this.typeOnEdit.push(typeIndex);
  }

  // get rooms data for location
  getRoomsForLocation() {
    var reqparams = {
      'LocationId': this.user.CurrentLocation
    };
    this.roomsData = null;
    this.settingsService.RoomsForLocation(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.roomsData = resp.ListResult;
        this.clearRooms();
        this.roomsData.forEach((roomdata, indexx) => {
          let room = this.newRoom();
          room.controls["RoomId"].setValue(roomdata.RoomId);
          room.controls["RoomName"].setValue(roomdata.RoomName);
          this.pushRoom(room);
        })
      }
      else if (resp.IsSuccess == false) {
        this.roomsData = resp.ListResult;
        this.clearRooms();
      }
    })
  }

  // get appointment statuses data
  getAppointmentStatus() {
    var req = {
      'ProviderId': this.user.ProviderId
    };
    this.appointmentStatusData = [];
    this.settingsService.AppointmentStatuses(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.appointmentStatusData = resp.ListResult;
        this.clearStatus();
        this.appointmentStatusData.forEach((appointmentStatus) => {
          this.pushStatus(this.newStatus(appointmentStatus));
        })
      }
      else if (resp.IsSuccess == false) {

        this.clearStatus();
      }
    });
  }

  // get appointment type data
  getAppointmentType() {
    let reqparams = {
      'ProviderId': this.user.ProviderId
    };
    this.appointmentTypeData = [];
    this.settingsService.AppointmentTypes(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.appointmentTypeData = resp.ListResult;
        this.clearType();
        this.appointmentTypeData.forEach((appointmentType) => {
          this.pushType(this.newType(appointmentType));
        })
      }
      else if (resp.IsSuccess == false) {
        this.clearType();
      }
    })
  }

  // Add Update Room
  saveRooms(roomIndex: number) {
    let reqparams = {
      'RoomId': this.rooms().controls[roomIndex].get('RoomId').value == "" ? null : this.rooms().controls[roomIndex].get('RoomId').value,
      'RoomName': this.rooms().controls[roomIndex].get('RoomName').value,
      'LocationId': this.user.CurrentLocation
    };
    if (!isNaN(Number(reqparams.RoomId))) reqparams.RoomId = null;
    this.settingsService.AddUpdateRoom(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.clearSaveIndex(roomIndex);
        this.getRoomsForLocation();
        this.alertmsg.displayMessageDailog(ERROR_CODES[!reqparams.RoomId ? "M2JSR001" : "M2JSR002"]);
      }
      else {
        this.getRoomsForLocation();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JSR001"]);
      }
    })
  }

  // Add Update Appointment Status
  saveAppointmentStatus(statusIndex: number) {
    let reqparams = {
      ProviderId: this.user.ProviderId,
      StatusId: this.status().controls[statusIndex].get('Id').value == "" ? null : this.status().controls[statusIndex].get('Id').value,
      Editable: true,
      StatusName: this.status().controls[statusIndex].get('Name').value,
      Colour: this.status().controls[statusIndex].get('Colour').value
    };
    if (!isNaN(Number(reqparams.StatusId))) reqparams.StatusId = null;
    this.settingsService.AddUpdateAppointmentStatus(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.clearSaveStatusIndex(statusIndex);
        this.getAppointmentStatus();
        this.alertmsg.displayMessageDailog(ERROR_CODES[!reqparams.StatusId ? "M2JSAS001" : "M2JSAS002"]);
      }
      else {
        this.getAppointmentStatus();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JSAS001"]);
      }
    })
  }

  // Add Update Appointment Type
  saveAppointmentType(typeIndex: number) {
    let ctlType = this.typeForm.controls.type["controls"][typeIndex];


    let ctlvalue = ctlType.value;
    console.log(ctlvalue);

    let reqparams: any;
    if (!isNaN(Number(ctlvalue.Id)) && Number(ctlvalue.Id) < 0)
      ctlvalue['TypeId'] = null;
    else
      ctlvalue['TypeId'] = ctlvalue.Id;


    reqparams = {
      ProviderId: this.user.ProviderId,
      TypeId: ctlvalue.TypeId,
      Editable: true,
      TypeName: ctlvalue.AppointmentType,
      Colour: ctlvalue.Colour
    }
    console.log(reqparams);
    //if (!isNaN(Number(reqparams.TypeId))) reqparams.TypeId = null;
    this.settingsService.AddUpdateAppointmentType(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.clearSaveTypeIndex(typeIndex);
        this.getAppointmentType();
        this.alertmsg.displayMessageDailog(ERROR_CODES[!reqparams.TypeId ? "M2JSAT001" : "M2JSAT002"]);
      }
      else {
        this.getAppointmentType();
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2JSAT001"]);
      }
    })
  }

  // Remove Room
  removeRoom(roomIndex: number) {
    let roomId = this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value;
    if (roomId < 0) {
      this.rooms().removeAt(roomIndex);
    }
    else {
      this.settingsService.DropRoom(roomId).subscribe(resp => {
        if (resp.IsSuccess) {
          this.alertmsg.displayErrorDailog(ERROR_CODES["M2JSR003"]);
          this.getRoomsForLocation();
        }
        else {
          this.getRoomsForLocation();
        }
      });
    }
  }

  // Remove Appointment Status
  removeAppointmentStatus(statusIndex: number) {
    let statusId = this.statusForm.controls.status["controls"][statusIndex].get('Id').value;
    if (statusId < 0) {
      this.status().removeAt(statusIndex);
    }
    else {
      this.settingsService.DropAppointmentStatus(statusId).subscribe(resp => {
        if (resp.IsSuccess) {
          this.getAppointmentStatus();
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2JSAS003"]);
        }
        else {
          this.getAppointmentStatus();
        }
      })
    }
  }

  // Remove Appointment Type
  removeAppointmentType(typeIndex: number) {
    let typeId = this.typeForm.controls.type["controls"][typeIndex].get('Id').value;
    if (typeId < 0) {
      this.type().removeAt(typeIndex);
    }
    else {
      this.settingsService.DropAppointmentType(typeId).subscribe(resp => {
        if (resp.IsSuccess) {
          this.getAppointmentType();
          this.alertmsg.displayMessageDailog(ERROR_CODES["M2JSAT003"]);
        }
        else {
          this.getAppointmentType();
        }
      })
    }
  }

  // get General Schedule details
  getGeneralSchedule() {
    let reqparams = {
      clinicId: this.user.ClinicId
    };
    this.settingsService.Generalschedule(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        if (resp.ListResult.length == 1)
          this.generalSchedule = resp.ListResult[0];
      }

    })
  }

  updateScheduleGeneral() {
    let reqparams = {
      ClinicId: this.user.ClinicId,
      FromDate: this.generalSchedule.CalendarFrom,
      ToDate: this.generalSchedule.CalendarTo,
      outsidehours: this.generalSchedule.OutSidePracticeHour,
      concurrentapps: this.generalSchedule.ConcurrentApps,
      reschedulepatient: this.generalSchedule.PatientRescedule
    }


    this.settingsService.UpdateReschedule(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.alertmsg.displayMessageDailog(resp.EndUserMessage);
        this.getGeneralSchedule();
      }
      else {
        this.alertmsg.displayMessageDailog(resp.EndUserMessage);
        this.getGeneralSchedule();
      }
    })
  }


  GetUserInfoData() {
    var reqparams = {
      UserId: this.user.UserId,
      LoginProviderId: this.user.ProviderId,
      ClinicId: this.user.ClinicId
    }
    this.settingsService.UserInfoWithPracticeLocations(reqparams).subscribe(resp => {
      let UserInfo = resp.Result as NewUser;
      UserInfo.LocationInfo = JSON.parse(resp.Result.LocationInfo);
      this.openComponentDialog(this.userDialogComponent, UserInfo, Actions.view)
    });
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
    });
  }
}
