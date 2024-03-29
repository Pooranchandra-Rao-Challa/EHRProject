import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { UserLocations } from 'src/app/_models/_account/user';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Component, OnInit } from "@angular/core";
import { Blockout, BlockOutDialog, PracticeProviders, Room, User } from "src/app/_models";
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';


@Component({
  selector: 'app-blockout-dialog',
  templateUrl: './blockout.dialog.component.html',
  styleUrls: ['./blockout.dialog.component.scss']
})
export class BlockoutDialogComponent implements OnInit {

  user: User
  blockout?: Blockout = {}
  blockoutfor?: any[] = [{}]
  blockoutforItems?: any[] = [{}]
  locations?: UserLocations[];
  practiceProviders?: PracticeProviders[]
  blockoutDialog?: BlockOutDialog = {}
  changeOfBlockoutfor: BehaviorSubject<string> = new BehaviorSubject<string>("")
  todayDate: Date = new Date()

  PeriodsOfTimeSlots: { Text: string, Value: number }[]
  constructor(
    private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private utilityService: UtilityService,
    private alertMessage: AlertMessage,
    private datePipe: DatePipe
  ) {
    this.todayDate = new Date(datePipe.transform(this.todayDate,"MM/dd/yyyy"));
    this.user = authService.userValue;
    this.blockoutDialog = ref.RequestData as BlockOutDialog;
    this.blockout = this.blockoutDialog.Blockout;
    if(this.blockout?.strRangeDay) this.blockout.RangeDay = JSON.parse(this.blockout?.strRangeDay);


    if (this.blockout.ClinicId == null)
      this.blockout.ClinicId = this.user.ClinicId;
    if (this.blockout.LocationId == null)
      this.blockout.LocationId = this.user.CurrentLocation;
    if (this.blockout != null && this.blockout != null)
      this.blockout.Time = datePipe.transform(this.blockout.StartAt, "hh:mm a");

  }

  ngOnInit(): void {
    this.blockoutforItems = this.BlockoutItems;
    this.loadDefaults();
    this.changeOfBlockoutfor.subscribe((value) => {
      this.blockoutforItems = this.BlockoutItems;
    })
  }
  close() {
    this.ref.close();
  }
  get IsRecurEndDayisToday(){
    return this.blockout?.RecurEndAt != null && new Date(this.blockout?.RecurEndAt) <= this.todayDate
  }
  get IsDaily() {
    return this.blockout.RecurType == "daily"
  }
  get IsWeekly() {
    return this.blockout.RecurType == "weekly"
  }
  OnRecurTypeSelect(event) {
    this.blockout.RecurType = event.value;
  }

  get IsMonday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("M");
    return flag;
  }
  get IsTuesday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("T");
    return flag;
  }
  get IsWednesday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("W");
    return flag;
  }
  get IsThursday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("Th");
    return flag;
  }
  get IsFriday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("F");
    return flag;
  }
  get IsSaturday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("Sa");
    return flag;
  }
  get IsSunday() {
    let flag: boolean = this.blockout.RangeDay != null;
    if (flag) flag = this.checkWeekday("Su");
    return flag;
  }
  checkWeekday(weekday: string): boolean {
    let flag: boolean = false;
    this.blockout.RangeDay.forEach(value => {
      if (!flag)
        flag = value.RangeDay == weekday;
    })
    return flag
  }
  OnWeekSelect(event) {
    let weekday = event.source.value;
    if (this.blockout.RangeDay == null) this.blockout.RangeDay = [];

    if (event.checked) {
      let flag = false;
      this.blockout.RangeDay.forEach((value) => {
        if (value.RangeDay == weekday) {
          value.CanDelete = false;
          flag = true;
        }
      });
      if (!flag)
        this.blockout.RangeDay.push({ RangeDay: weekday, CanDelete: false });
    } else {
      this.blockout.RangeDay.forEach((value) => {
        if (value.RangeDay == weekday) {
          value.CanDelete = true;
        }
      })
    }
  }
  SelectedBlockoutFor(event) {
    this.changeOfBlockoutfor.next(event.value);
  }
  loadDefaults() {
    this.utilityService.BlockoutFor().subscribe(resp => {
      if (resp.IsSuccess) {
        this.blockoutfor = resp.ListResult as any[]
      }
    })
    this.PeriodsOfTimeSlots = [
      { Text: '15 min', Value: 15 },
      { Text: "30 min", Value: 30 },
      { Text: "45 min", Value: 45 },
      { Text: "1 hour", Value: 60 },
      { Text: "1 hour 15 min", Value: 75 },
      { Text: "1 hour 30 min", Value: 90 },
      { Text: "1 hour 45 min", Value: 105 },
      { Text: "2 hours", Value: 120 },
      { Text: "2 hours 15 min", Value: 135 },
      { Text: "2 hours 30 min", Value: 150 },
      { Text: "2 hours 45 min", Value: 165 },
      { Text: "3 hours", Value: 180 },
      { Text: "Full Day", Value: 1440 }];

  }

  get LabelBlockoutFor() {
    switch (this.blockout.BlockoutFor) {
      case 'individual_providers':
        return 'Select Provider'
      case 'practice_location':
        return 'Select Location'
      case 'staff':
        return 'Select Staff'
      default:
        return 'No Label'
    }
  }

  get BlockoutItems(): any[] {
    let returnArray: { Name: string, Value: string }[] = [];
    switch (this.blockout.BlockoutFor) {
      case 'individual_providers':
        this.blockoutDialog.PracticeProvider.forEach(val => {
          returnArray.push(
            { Name: val.FullName, Value: val.ProviderId }
          )
        });
        break;
      case 'practice_location':
        this.blockoutDialog.Locations.forEach(val => {
          returnArray.push(
            { Name: val.LocationName, Value: val.LocationId }
          )
        })
        break;
      case 'staff':
        this.blockoutDialog.Staff.forEach(val => {
          returnArray.push(
            { Name: val.FullName, Value: val.ProviderId }
          )
        });
        break;
      default:
        returnArray
    }
    return returnArray;
  }
  onChangeRecur(event) {

    if (event.checked) {
      this.blockout.StartAt = null;
      this.blockout.Duration = -1;
      this.blockout.Time = null;
    } else {
      this.blockout.RecurType = null;
      this.blockout.RecurStartAt = null;
      this.blockout.RecurEndAt = null;
      this.blockout.DayRecurStartTime = null;
      this.blockout.DayRecurEndTime = null;
      this.blockout.RangeDay = null;
    }
  }
  enableSave() {
    let timeRx = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

    let dailyflag = this.blockout.RecurType == 'daily' && this.blockout.Recur && this.blockout.RecurStartAt != null
      && this.blockout.DayRecurStartTime != null && timeRx.test(this.blockout.DayRecurStartTime)
      && this.blockout.DayRecurEndTime != null && timeRx.test(this.blockout.DayRecurEndTime);

    let weeklyflag = this.blockout.RecurType == 'weekly' && this.blockout.Recur && this.blockout.RecurStartAt != null
      && this.blockout.RangeDay != null && this.blockout.RangeDay.length > 0

    let regularflag = !this.blockout.Recur && this.blockout.StartAt != null &&
      ((this.blockout.Duration != 1440 && this.blockout.Time != null) || this.blockout.Duration == 1440)

    let flag = (this.blockout.BlockoutFor != null && this.blockout.BlockoutFor != "")
      && (this.blockout.BlockoutForId != null && this.blockout.BlockoutForId != "")
      && (this.blockout.ClinicId != null)
      && (this.blockout.LocationId != null)
      && (regularflag || dailyflag || weeklyflag)
    return !flag;
  }
  SelectionBlockoutForChange(event) {
    if (this.blockout.BlockoutFor == 'practice_location') {
      this.UpdateRooms();
    }
  }
  UpdateRooms() {
    let lreq = { "LocationId": this.blockout.BlockoutForId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.blockoutDialog.Rooms = resp.ListResult as Room[];
      } else {
        this.blockoutDialog.Rooms = [];
        this.blockout.RoomId = null;
      }
    });
  }

  Save() {

    let isAdd = this.blockout.BlockoutId == null

    if (this.blockout.StartAt != null)
      this.blockout.strStartAt = this.datePipe.transform(this.blockout.StartAt, "MM/dd/yyyy") + " " + this.blockout.Time;

    if (this.blockout.RecurStartAt != null)
      this.blockout.strRecurStartAt = this.datePipe.transform(this.blockout.RecurStartAt, "MM/dd/yyyy");
    if (this.blockout.RecurEndAt != null)
      this.blockout.strRecurEndAt = this.datePipe.transform(this.blockout.RecurEndAt, "MM/dd/yyyy");

    this.smartSchedulerService.CreateBlockout(this.blockout).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({ refresh: true, id: this.blockout.BlockoutId });
        this.alertMessage.displayMessageDailog(ERROR_CODES[isAdd ? "M2B1001" : "M2B1002"])
      }
      else {
        this.alertMessage.displayErrorDailog(ERROR_CODES[isAdd ? "E2B1001" : "E2B1002"])
      }
    })
  }

  Delete() {
    this.smartSchedulerService.DeleteBlockout(this.blockout).subscribe(resp => {
      if (resp.IsSuccess) {
        this.ref.close({ refresh: true });
        this.alertMessage.displayErrorDailog(ERROR_CODES["M2B1003"])
      }
      else {
        this.alertMessage.displayErrorDailog(ERROR_CODES["E2B1003"])
      }
    })
  }
}
