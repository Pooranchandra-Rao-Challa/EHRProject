import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { SettingsService } from '../_services/settings.service';
import { UtilityService } from '../_services/utiltiy.service';
import { User, UserLocations } from '../_models';
import { UUID } from 'angular2-uuid'
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocationSelectService } from '../_navigations/provider.layout/location.service';
import Swal from 'sweetalert2';
import * as ts from 'typescript';
declare var $: any;

@Component({
  selector: 'schedule-settings',
  templateUrl: './schedule.component.html',
  styleUrls: ['./settings.component.scss']
})
export class ScheduleComponent implements OnInit {
  user: User;
  LocationAddress: any;
  roomForm: FormGroup;
  statusForm: FormGroup;
  typeForm: FormGroup;
  showEditBtn: boolean = false;
  showSaveBtn: boolean = false;
  showInput: boolean = true;
  typecolor: any;
  Colour: any;
  appointmentStatusData: any;
  appointmentTypeData: any;
  roomsData: any;
  arrayColors: any[] = [];
  customizedspinner: boolean;
  color: any;
  Editable: any;
  buttonValue: string;
  displayappointmentTime: boolean = false;

  constructor(private authService: AuthenticationService, private settingsService: SettingsService, private fb: FormBuilder) {
    this.user = authService.userValue;
  }
  ngOnInit(): void {
    // this.currentAppointmentStatusId = null;
    this.getLocationsList();
    this.getAppointmentStatus();
    this.getAppointmentType();
    this.getRoomsForLocation();
    this.buildRoomsForm();
    this.buildStatusForm();
    this.buildTypeForm();
  }

  // get display Location Details
  getLocationsList() {
    this.settingsService.PracticeLocations(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.LocationAddress = resp.ListResult;
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
      RoomName: [''],
      status: [false]
    })
  }
  addRoom() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.rooms().push(this.newRoom());
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 1000);
  }

  // toggleSaveEditBtn(roomIndex: number) {
  //   debugger;
  //   const controlArray = this.roomForm.get('rooms') as FormArray;
  //   if (controlArray.controls[roomIndex].status === 'DISABLED') {
  //     controlArray.controls[roomIndex].enable();
  //   }
  //   else {
  //     controlArray.controls[roomIndex].disable();
  //     this.saveRooms(roomIndex);
  //   }
  // }

  // formArrayRooms(roomIndex) {
  //   debugger;
  //   const controlArray = this.roomForm.get('rooms') as FormArray;
  //   if (controlArray.controls[roomIndex].value.RoomId == "") {
  //     return controlArray.controls[roomIndex].disabled;
  //   }
  //   else {
  //     return controlArray.controls[roomIndex].enable;
  //   }
  // }

  // Appointment Statuses
  buildStatusForm() {
    this.statusForm = this.fb.group({
      status: this.fb.array([]),
    });
  }
  status(): FormArray {
    return this.statusForm.get("status") as FormArray
  }
  newStatus(): FormGroup {
    return this.fb.group({
      Id: [''],
      Name: [''],
      color: [''],
      Editable: ['true'],
      Appointmentstatus: [false]
    })
  }
  addStatus() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.status().push(this.newStatus());
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 1000);
  }

  // negativeIndexing(statusIndex) {
  //   this.statusForm.controls.status["controls"][statusIndex].get('Id').value
  // }

  // Appointment Type
  buildTypeForm() {
    this.typeForm = this.fb.group({
      type: this.fb.array([]),
    });
  }
  type(): FormArray {
    return this.typeForm.get("type") as FormArray
  }
  newType(): FormGroup {
    return this.fb.group({
      Id: [''],
      AppointmentType: [''],
      Colour: [''],
      Editable: ['true'],
      AppointmenttypeStatus: [false]
    })
  }
  addType() {
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    this.type().push(this.newType());
    setTimeout(() => {
      this.customizedspinner = false;
      $('body').removeClass('loadactive')
    }, 1000);
  }

  get roomformControls() {
    return this.roomForm.controls;
  }

  // get rooms data for location
  getRoomsForLocation() {
    var reqparams = {
      'LocationId': this.user.CurrentLocation
    };
    this.settingsService.RoomsForLocation(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.roomsData = resp.ListResult;
        this.roomForm.setControl('rooms', this.fb.array([]));
        for (let i = 0; i < this.roomsData.length; i++) {
          this.addRoom();
          this.roomForm.controls.rooms['controls'][i].get('RoomId').patchValue(this.roomsData[i].RoomId);
          this.roomForm.controls.rooms['controls'][i].get('RoomName').patchValue(this.roomsData[i].RoomName);
        }
      }
      else if (resp.IsSuccess == false) {
        this.roomsData = resp.ListResult;
        this.roomForm.setControl('rooms', this.fb.array([]));
      }
    })
  }

  // get appointment statuses data
  getAppointmentStatus() {
    var req = {
      'ProviderId': this.user.ProviderId
    };
    this.settingsService.AppointmentStatuses(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.appointmentStatusData = resp.ListResult;
        console.log(this.appointmentStatusData);

        this.statusForm.setControl('status', this.fb.array([]));
        for (let i = 0; i < this.appointmentStatusData.length; i++) {
          this.addStatus();
          this.statusForm.controls.status['controls'][i].get('Id').patchValue(this.appointmentStatusData[i].Id);
          this.statusForm.controls.status['controls'][i].get('Name').patchValue(this.appointmentStatusData[i].Name);
          this.color = this.statusForm.controls.status['controls'][i].get('color').patchValue(this.appointmentStatusData[i].Colour);
          this.statusForm.controls.status['controls'][i].get('Editable').patchValue(this.appointmentStatusData[i].Editable);
        }
      }
    });
  }

  get formControls() {
    return this.typeForm.controls;
  }

  // get appointment type data
  getAppointmentType() {
    var reqparams = {
      'ProviderId': this.user.ProviderId
    };
    this.settingsService.AppointmentTypes(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.appointmentTypeData = resp.ListResult;
        console.log(this.appointmentTypeData);
        this.typeForm.setControl('type', this.fb.array([]));
        for (let i = 0; i < this.appointmentTypeData.length; i++) {
          this.addType();
          this.formControls.type['controls'][i].get('Id').patchValue(this.appointmentTypeData[i].Id);
          this.formControls.type['controls'][i].get('AppointmentType').patchValue(this.appointmentTypeData[i].AppointmentType);
          this.formControls.type['controls'][i].get('Colour').patchValue(this.appointmentTypeData[i].Colour);
          // this.color = this.formControls.type['controls'][i].get('Colour').patchValue(this.appointmentTypeData[i].Colour);
          this.formControls.type['controls'][i].get('Editable').patchValue(this.appointmentTypeData[i].Editable);
        }
      }
    })
  }

  // Add Update Room
  saveRooms(roomIndex: number) {
    ((this.roomForm.get("rooms") as FormArray).at(roomIndex).get("status").setValue(false));
    var reqparams = {
      'RoomId': this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value == "" ? null : this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value,
      'RoomName': this.roomForm.controls.rooms["controls"][roomIndex].get('RoomName').value,
      'LocationId': this.user.CurrentLocation
    };
    this.settingsService.AddUpdateRoom(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getRoomsForLocation();
      }
      else {
        this.getRoomsForLocation();
      }
    })
  }
  onEditRooms(roomIndex: number) {
    debugger;
    ((this.roomForm.get("rooms") as FormArray).at(roomIndex).get("status").setValue(true));
  }

  // Add Update Appointment Status
  saveAppointmentStatus(statusIndex: number) {
    ((this.statusForm.get("status") as FormArray).at(statusIndex).get("Appointmentstatus").setValue(false));
    var reqparams = {
      ProviderId: this.user.ProviderId,
      StatusId: this.statusForm.controls.status["controls"][statusIndex].get('Id').value == "" ? null : this.statusForm.controls.status["controls"][statusIndex].get('Id').value,
      Editable: true,
      StatusName: this.statusForm.controls.status["controls"][statusIndex].get('Name').value,
      Colour: this.statusForm.controls.status["controls"][statusIndex].get('color').value
    };
    this.settingsService.AddUpdateAppointmentStatus(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getAppointmentStatus();
      }
      else {
        this.getAppointmentStatus();
      }
    })
  }

  onEditStatus(statusIndex: number) {
    debugger;
    ((this.statusForm.get("status") as FormArray).at(statusIndex).get("Appointmentstatus").setValue(true));
  }

  // currentAppointmentStatusId: string;
  // editAppointmentStatus(statusIndex: number) {
  //   this.currentAppointmentStatusId = this.statusForm.controls.status["controls"][statusIndex].get('Id').value;
  // }
  // edit() {
  //   this.showSaveBtn = true;
  //   this.showEditBtn = false;
  //   this.showInput = true;
  // }

  removeRoom(roomIndex: number) {
    let roomId = this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value;
    if (roomId == "") {
      this.rooms().removeAt(roomIndex);
    }
    this.settingsService.DropRoom(roomId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getRoomsForLocation();
      }
    })
  }

  removeAppointmentStatus(statusIndex: number) {
    let statusId = this.statusForm.controls.status["controls"][statusIndex].get('Id').value;
    if (statusId == "") {
      this.status().removeAt(statusIndex);
    }
    this.settingsService.DropAppointmentStatus(statusId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getAppointmentStatus();
      }
      else {
        this.getAppointmentStatus();
      }
    })
  }

  // Add Update Appointment Type
  saveAppointmentType(typeIndex: number) {
    ((this.typeForm.get("type") as FormArray).at(typeIndex).get("AppointmenttypeStatus").setValue(false));
    var reqparams = {
      ProviderId: this.user.ProviderId,
      TypeId: this.typeForm.controls.type["controls"][typeIndex].get('Id').value == "" ? null : this.typeForm.controls.type["controls"][typeIndex].get('Id').value,
      Editable: true,
      TypeName: this.typeForm.controls.type["controls"][typeIndex].get('AppointmentType').value,
      Colour: this.typeForm.controls.type["controls"][typeIndex].get('Colour').value
    }
    this.settingsService.AddUpdateAppointmentType(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getAppointmentType();
      }
      else {
        this.getAppointmentType();
      }
    })
  }

  onEditType(typeIndex: number) {
    debugger;
    ((this.typeForm.get("type") as FormArray).at(typeIndex).get("AppointmenttypeStatus").setValue(true));
  }

  removeAppointmentType(typeIndex: number) {
    let typeId = this.typeForm.controls.type["controls"][typeIndex].get('Id').value;
    if (typeId == "") {
      this.type().removeAt(typeIndex);
    }
    else {
      this.settingsService.DropAppointmentType(typeId).subscribe(resp => {
        if (resp.IsSuccess) {
          this.getAppointmentType();
        }
        else {
          this.getAppointmentType();
        }
      })
    }
  }

  appointmentTime(checked) {
    debugger;
    if (checked == true) {
      this.displayappointmentTime = true;
    }
    else {
      this.displayappointmentTime = false;
    }
  }
}
