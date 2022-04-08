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
  color: any;
  typecolor: any;
  appointmentStatusData: any;

  constructor(private authService: AuthenticationService, private settingsService: SettingsService, private fb: FormBuilder) {
    this.user = authService.userValue;
  }
  ngOnInit(): void {
    this.getAppointmentStatus();
    this.getLocationsList();
    this.roomForm = this.fb.group({
      rooms: this.fb.array([]),
    })
    this.statusForm = this.fb.group({
      status: this.fb.array([]),
    })
    this.typeForm = this.fb.group({
      type: this.fb.array([]),
    })
  }
  // Rooms
  rooms(): FormArray {
    return this.roomForm.get("rooms") as FormArray
  }

  newRoom(): FormGroup {
    return this.fb.group({
      roomOP: ['']
    })
  }

  addRoom() {
    this.showSaveBtn = true;
    this.showInput = true;
    this.showEditBtn = false;
    this.rooms().push(this.newRoom());
  }

  removeRoom(roomIndex: number) {
    this.rooms().removeAt(roomIndex);
  }

  onSubmitBasedOnIndex(roomIndex: number) {
    this.showEditBtn = true;
    this.showInput = false;
    this.showSaveBtn = false;
    var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
    console.log(testing);
  }
  onSubmitEdit(roomIndex: number) {
    this.showSaveBtn = true;
    this.showEditBtn = false;
    this.showInput = true;
    var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
    console.log(testing);
  }
  // Appointment Statuses
  status(): FormArray {
    return this.statusForm.get("status") as FormArray
  }
  newStatus(): FormGroup {
    return this.fb.group({
      Name: [''],
      Colour: ['']
    })
  }
  addStatus() {
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
      appointmentType: [''],
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
    this.settingsService.PractiveLocations(this.user.ProviderId).subscribe(resp => {
      if (resp.IsSuccess) {
        this.LocationAddress = resp.ListResult;
      }
    });
  }

  get formControls() {
    return this.statusForm.controls;
  }
  getAppointmentStatus() {
    var req = {
      'ProviderId': this.user.ProviderId
    };
    this.settingsService.AppointmentStatuses(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.appointmentStatusData = resp.ListResult;
        console.log(this.appointmentStatusData);

        //this.statusForm.controls.status

        for (let i = 0; i < this.appointmentStatusData.length; i++) {
          this.addStatus();
          this.formControls.status['controls'][i].get('Name').patchValue(this.appointmentStatusData[i].Name);
          this.formControls.status['controls'][i].get('Colour').patchValue('#' + this.appointmentStatusData[i].Colour);
        }

        console.log(JSON.stringify(this.statusForm.value))

      }

    });
  }

  // Add Update Appointment Status
  saveAppointmentStatus(statusIndex: number) {
    var reqparams = {
      ProviderId: this.user.ProviderId,
      StatusId: null,
      Editable: true,
      StatusName: this.statusForm.controls.status["controls"][statusIndex].get('appointmentStatus').value,
      Colour: this.color
    }
    console.log(reqparams);
    this.settingsService.AddUpdateAppointmentStatus(reqparams).subscribe(resp => {
      if (resp.IsSuccess) {
        Swal.fire({
          icon: 'success',
          title: 'Successfully Inserted',
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

  // Add Update Appointment Type
  saveAppointmentType(typeIndex: number) {
    var reqparams = {
      ProviderId: this.user.ProviderId,
      TypeId: null,
      Editable: true,
      TypeName: this.typeForm.controls.type["controls"][typeIndex].get('appointmentType').value,
      Colour: this.typecolor
    }
    console.log(reqparams);
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

}
