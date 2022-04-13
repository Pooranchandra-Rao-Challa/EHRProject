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

  constructor(private authService: AuthenticationService, private settingsService: SettingsService, private fb: FormBuilder) {
    this.user = authService.userValue;
  }
  ngOnInit(): void {
    this.getLocationsList();
    this.getAppointmentStatus();
    this.getAppointmentType();
    this.getRoomsForLocation();
    this.roomForm = this.fb.group({
      rooms: this.fb.array([]),
    });
    this.statusForm = this.fb.group({
      status: this.fb.array([]),
    });
    this.typeForm = this.fb.group({
      type: this.fb.array([]),
    });
  }
  // Rooms
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
    // this.showSaveBtn = true;
    // this.showInput = true;
    // this.showEditBtn = false;
    this.rooms().push(this.newRoom());
  }

  // removeRoom(roomIndex: number) {
  //   this.rooms().removeAt(roomIndex);
  // }

  // onSubmitBasedOnIndex(roomIndex: number) {
  //   this.showEditBtn = true;
  //   this.showInput = false;
  //   this.showSaveBtn = false;
  //   var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
  // }
  // onSubmitEdit(roomIndex: number) {
  //   this.showSaveBtn = true;
  //   this.showEditBtn = false;
  //   this.showInput = true;
  //   var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
  // }

  // Appointment Statuses
  status(): FormArray {
    return this.statusForm.get("status") as FormArray
  }
  newStatus(): FormGroup {
    return this.fb.group({
      Id: [''],
      Name: [''],
      color: ['']
    })
  }
  addStatus() {
    this.showSaveBtn = true;
    this.showInput = true;
    this.showEditBtn = false;
    this.status().push(this.newStatus());
  }
  removeStatus(statusIndex: number) {
    this.status().removeAt(statusIndex);
  }
  // Appointment Type
  type(): FormArray {
    return this.typeForm.get("type") as FormArray
  }
  newType(): FormGroup {
    return this.fb.group({
      Id: [''],
      AppointmentType: [''],
      Colour: ['']
    })
  }
  addType() {
    this.type().push(this.newType());
  }
  removeType(typeIndex: number) {
    this.type().removeAt(typeIndex);
  }
  // get display Location Details
  getLocationsList() {
    this.settingsService.PracticeLocations(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.LocationAddress = resp.ListResult;
      }
    });
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
        // this.roomForm.controls.rooms['controls'].reset();
        console.log(this.roomsData);
        for (let i = 0; i < this.roomsData.length; i++) {
          this.addRoom();
          this.roomForm.controls.rooms['controls'][i].get('RoomId').patchValue(this.roomsData[i].RoomId);
          this.roomForm.controls.rooms['controls'][i].get('RoomName').patchValue(this.roomsData[i].RoomName);
        }
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
        this.statusForm.controls['status'].value.length = 0;
        for (let i = 0; i < this.appointmentStatusData.length; i++) {
          this.addStatus();
          this.statusForm.controls.status['controls'][i].get('Id').patchValue(this.appointmentStatusData[i].Id);
          this.statusForm.controls.status['controls'][i].get('Name').patchValue(this.appointmentStatusData[i].Name);
          this.color = this.statusForm.controls.status['controls'][i].get('color').patchValue(this.appointmentStatusData[i].Colour);
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
        this.formControls['type'].value.length = 0;
        for (let i = 0; i < this.appointmentTypeData.length; i++) {
          this.addType();
          this.formControls.type['controls'][i].get('Id').patchValue(this.appointmentTypeData[i].Id);
          this.formControls.type['controls'][i].get('AppointmentType').patchValue(this.appointmentTypeData[i].AppointmentType);
          this.formControls.type['controls'][i].get('Colour').patchValue(this.appointmentTypeData[i].Colour);
          // this.color = this.formControls.type['controls'][i].get('Colour').patchValue(this.appointmentTypeData[i].Colour);
        }
      }
    })
  }

  // Add Update Room
  saveRooms(roomIndex: number) {
    var reqparams = {
      'RoomId': this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value == "" ? null : this.roomForm.controls.rooms["controls"][roomIndex].get('RoomId').value,
      'RoomName': this.roomForm.controls.rooms["controls"][roomIndex].get('RoomName').value,
      'LocationId': this.user.CurrentLocation
    };
    this.settingsService.AddUpdateRoom(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.getRoomsForLocation();
      }
    })
  }

  // Add Update Appointment Status
  saveAppointmentStatus(statusIndex: number, color: string) {
    debugger;
    this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
    // this.showEditBtn[statusIndex] = true;
    // this.showInput[statusIndex] = false;
    // this.showSaveBtn[statusIndex] = false;
    var reqparams = {
      ProviderId: this.user.ProviderId,
      StatusId: this.statusForm.controls.status["controls"][statusIndex].get('Id').value == "" ? null : this.statusForm.controls.status["controls"][statusIndex].get('Id').value,
      Editable: true,
      StatusName: this.statusForm.controls.status["controls"][statusIndex].get('Name').value,
      Colour: this.statusForm.controls.status["controls"][statusIndex].get('Colour').value
    };
    this.settingsService.AddUpdateAppointmentStatus(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        this.customizedspinner = true; $('body').addClass('loadactive').scrollTop(0);
        // this.getAppointmentStatus();
      }
      this.customizedspinner = false; $('body').removeClass('loadactive');
    })
  }

  // edit(statusIndex) {
  //   this.showSaveBtn[statusIndex] = true;
  //   this.showEditBtn[statusIndex] = false;
  //   this.showInput[statusIndex] = true;
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
    })
  }

  // Add Update Appointment Type
  saveAppointmentType(typeIndex: number) {
    var reqparams = {
      ProviderId: this.user.ProviderId,
      TypeId: this.typeForm.controls.type["controls"][typeIndex].get('Id').value == "" ? null : this.typeForm.controls.type["controls"][typeIndex].get('Id').value,
      Editable: true,
      TypeName: this.typeForm.controls.type["controls"][typeIndex].get('AppointmentType').value,
      Colour: this.typeForm.controls.type["controls"][typeIndex].get('Colour').value
    }
    this.settingsService.AddUpdateAppointmentType(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        Swal.fire({
          icon: 'success',
          title: resp.EndUserMessage,
          showConfirmButton: true,
          confirmButtonText: 'Close',
          width: '700',
        });
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
      })
    }
  }
}
