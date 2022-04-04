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
declare var $: any;

@Component({
  selector: 'schedule-settings',
  templateUrl: './schedule.component.html',
  styleUrls: ['./settings.component.scss']
})
export class ScheduleComponent implements OnInit {
  user: User;
  LocationAddress: any;
  ProviderId: string;
  locationdataSource: any;
  appointmentStatusList: any[];
  appointmentStatusColumns: string[] = ['Status', 'Color', 'isEdit'];
  appointmentTypeColumns: string[] = ['Type', 'Color', 'isEdit'];
  appointmentTypeList: any[];
  roomForm: FormGroup;
  dataSource4: any;
  showEditBtn: boolean = false;
  showSaveBtn: boolean = false;
  showInput: boolean = true;
  appointmentStatusForm: FormGroup;

  constructor(private authService: AuthenticationService, private settingsService: SettingsService, private fb: FormBuilder) {
    this.user = authService.userValue;
  }
  ngOnInit(): void {
    this.roomForm = this.fb.group({
      rooms: this.fb.array([]),
    })
  }

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

  removeEmployee(roomIndex: number) {
    this.rooms().removeAt(roomIndex);
  }

  onSubmitBasedOnIndex(roomIndex: number) {
    debugger
    this.showEditBtn = true;
    this.showInput = false;
    this.showSaveBtn = false;
    var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
    console.log(testing);
  }
  onSubmitEdit(roomIndex: number) {
    debugger
    this.showSaveBtn = true;
    this.showEditBtn = false;
    this.showInput = true;
    var testing = this.roomForm.controls.rooms["controls"][roomIndex].get('roomOP').value;
    console.log(testing);
  }

}
