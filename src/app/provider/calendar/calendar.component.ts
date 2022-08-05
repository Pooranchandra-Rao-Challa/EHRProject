import { AvailableTimeSlot } from './../../_models/_provider/smart.scheduler.data';
import { BehaviorSubject } from 'rxjs';
import { AppointmentType, AppointmentStatus, TimeSlot, GeneralSchedule } from './../../_models/_provider/_settings/settings';
import { SmartSchedulerService } from './../../_services/smart.scheduler.service';
import { AuthenticationService } from './../../_services/authentication.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import { Component, OnInit, ElementRef, Inject, LOCALE_ID, HostListener, ViewChild, forwardRef, AfterViewInit, QueryList, ViewChildren, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { CalendarOptions, Calendar, EventHoveringArg, EventApi, BusinessHoursInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Actions, AppointmentDialogInfo, BlockOutDialog, CalendarAppointment, NewAppointment, PracticeProviders, Room, User, UserLocations } from 'src/app/_models';
import { SettingsService } from 'src/app/_services/settings.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { LocationSelectService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { ComponentType } from '@angular/cdk/portal';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { BlockoutDialogComponent } from 'src/app/dialogs/blockout/blockout.dialog.component';
import { I } from '@angular/cdk/keycodes';

//import adaptivePlugin from '@fullcalendar/adaptive'


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],

})
export class CalendarComponent implements OnInit, AfterViewInit {
  displayStyle: string = "none"
  nameTitle: { titleId: number; titleName: string; }[];
  appointmentForm: FormGroup;
  availableTimeSlots: string[];
  toggleButtonVisibility: boolean = false;
  calendarOptions: CalendarOptions;
  eventsModel: any;
  practiceProviders: PracticeProviders[];
  providerStaff: PracticeProviders[];
  appointmentTypes: AppointmentType[];
  appointmentStatuses: AppointmentStatus[];
  PatientAppointment: NewAppointment;
  SelectedProviderId: string = "";
  SelectedLocationId: string;
  Rooms: Room[];
  locations: UserLocations[];
  providerAndStaff: PracticeProviders[] = [];
  updateProviderAndStaff: BehaviorSubject<PracticeProviders[]> = new BehaviorSubject([])
  CalendarSchedule: GeneralSchedule = {} as GeneralSchedule;

  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  @ViewChildren('roomCheckboxes') private roomCheckboxes: QueryList<any>;
  @ViewChild('roomsToggle') private roomsToggle: MatCheckbox;

  @ViewChildren('appointmentTypeCheckboxes') private appointmentTypeCheckboxes: QueryList<any>;
  @ViewChild('appointmentTypesToggle') private appointmentTypesToggle: MatCheckbox;

  @ViewChildren('appointmentStatusCheckboxes') private appointmentStatusCheckboxes: QueryList<any>;
  @ViewChild('appointmentStatusesToggle') private appointmentStatusesToggle: MatCheckbox;

  @ViewChildren('providerCheckboxes') private providerCheckboxes: QueryList<any>;
  @ViewChild('providerToggle') private providerToggle: MatCheckbox;

  user: User;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  blockoutDialogComponent = BlockoutDialogComponent;
  sundayDate: Date = new Date();

  resources: any[] = [{}];

  calendarAppointments: CalendarAppointment[] = [{}]
  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService,
    private locationSelectService: LocationSelectService,
    private alertMessage: AlertMessage,
    private overlayService: OverlayService,
    private datepipe: DatePipe) {
    this.user = authService.userValue;
    this.sundayDate.setDate(this.sundayDate.getDate() - this.sundayDate.getDay());
    this.SelectedProviderId = this.user.ProviderId;
    this.SelectedLocationId = this.user.CurrentLocation;

    this.locationSelectService.getData().subscribe(locationId => {
      this.SelectedLocationId = locationId;
      this.LoadAppointmentDefalts();
    });
  }

  loadDefaults() {
    this.smartSchedulerService
      .PracticeProviders({ "ClinicId": this.authService.userValue.ClinicId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.practiceProviders = resp.ListResult as PracticeProviders[];
          this.updateProviderAndStaff.next(this.practiceProviders)
        }
      });

    this.smartSchedulerService
      .PracticeStaff({ "ClinicId": this.authService.userValue.ClinicId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.providerStaff = resp.ListResult as PracticeProviders[];
          this.updateProviderAndStaff.next(this.providerStaff)
        }
      });


    this.settingsService
      .AppointmentTypes({ 'ProviderId': this.authService.userValue.ProviderId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.appointmentTypes = resp.ListResult as AppointmentType[];
        }
      });
    this.settingsService
      .AppointmentStatuses({ 'ProviderId': this.authService.userValue.ProviderId })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.appointmentStatuses = resp.ListResult as AppointmentStatus[];
        }
      });
  }

  ngAfterViewInit(): void {
    //this.fullcalendar.getApi().
    let timeGridResourceButtons = document.getElementsByClassName('fc-resourceTimeGridDay-button');
    let timeGridWeekButtons = document.getElementsByClassName('fc-timeGridWeek-button');

    let roomsPanel = document.getElementsByClassName('panel rooms');

    if (timeGridResourceButtons != null && timeGridResourceButtons.length == 1) {
      timeGridResourceButtons[0].addEventListener('click', function () {

        if (roomsPanel != null && roomsPanel.length == 1)
          roomsPanel[0].classList.remove('fc-hide-control');
      })
    }
    if (timeGridWeekButtons != null && timeGridWeekButtons.length == 1) {
      timeGridWeekButtons[0].addEventListener('click', function () {

        if (roomsPanel != null && roomsPanel.length == 1)
          roomsPanel[0].classList.add('fc-hide-control');

      })
    }
    let providerExPanel = document.getElementsByClassName('panel providers')
    if (providerExPanel != null && providerExPanel.length == 1) {
      let expPanelIndicator = providerExPanel[0].getElementsByClassName('mat-expansion-indicator');

      if (expPanelIndicator != null) {
        expPanelIndicator[0].setAttribute("style", "transform: rotate(270deg);");
      }

    }
  }

  UpdateResources() {
    this.Rooms.forEach(room => {
      if (room.RoomName != '') {
        this.fullcalendar.getApi().addResource({
          id: room.RoomId,
          title: room.RoomName
        });
      }
    });
  }

  updateRoom(event, room: Room, roomIndex: number) {

    let allchecked: boolean = true;
    this.roomCheckboxes.toArray().forEach(source => {
      allchecked = allchecked && source.checked;
    })
    this.roomsToggle.checked = allchecked;

    if (event.source.checked) {
      this.fullcalendar.getApi().addResource({
        id: room.RoomId,
        title: room.RoomName
      }
      )
    } else {
      this.fullcalendar.getApi().getResourceById(room.RoomId).remove();
    }
  }

  ToggleAllRooms(event) {
    if (event.source.checked) {
      this.UpdateResources();
      this.roomCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.roomCheckboxes.toArray().forEach(source => {
        source.checked = false;
        this.fullcalendar.getApi().getResourceById(source.value.RoomId).remove();
      })
    }
  }

  ToggleAllAppointmentTypes(event) {
    this.removeAllEvents();
    if (event.source.checked) {
      this.updateCalendarEvents();
      this.appointmentTypeCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.appointmentTypeCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }

  updateAppointmentType(event, type: AppointmentType) {
    let allchecked: boolean = true;
    this.appointmentTypeCheckboxes.toArray().forEach(source => {
      allchecked = allchecked && source.checked;
    })
    this.appointmentTypesToggle.checked = allchecked;
    this.updateEvents(event.source.checked, { value: type.Id })
  }

  ToggleAllAppointmentStatuses(event) {
    this.removeAllEvents();
    if (event.source.checked) {
      this.updateCalendarEvents();
      this.appointmentStatusCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.appointmentStatusCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }

  updateAppointmentStatus(event, status: AppointmentStatus) {
    let allchecked: boolean = true;
    this.appointmentStatusCheckboxes.toArray().forEach(source => {
      allchecked = allchecked && source.checked;
    })
    this.appointmentStatusesToggle.checked = allchecked;
    this.updateEvents(event.source.checked, { value: status.Id })
  }

  removeAllEvents() {
    this.fullcalendar.getApi().getEvents().forEach(event => {
      event.remove();
    })
  }

  updateEvents(toggler: boolean, check: { value: string }) {
    this.calendarAppointments.forEach(appoinment => {
      if (appoinment.AppStatusId == check.value
        || appoinment.AppTypeId == check.value
        || appoinment.ProviderId == check.value) {
        if (!toggler)
          this.fullcalendar.getApi().getEventById(appoinment.AppointmentId).remove();
        else {
          this.fullcalendar.getApi().addEvent({
            id: appoinment.AppointmentId,
            title: appoinment.PatientName,
            start: appoinment.StartAt,
            end: appoinment.EndAt,
            classNames: ['fc-event-appointment-type'],
            backgroundColor: appoinment.StatusColor,
            borderColor: appoinment.TypeColor,
            resourceId: appoinment.RoomId,
            //textColor: app.AppColor,
            extendedProps: {
              'PatientName': appoinment.PatientName,
              'ProviderName': appoinment.ProviderName, 'Room': appoinment.RoomName,
              Duration: appoinment.Duration
            }
          })
        }
      }
    })
  }

  ToggleProviders(event) {
    this.removeAllEvents();
    if (event.source.checked) {
      this.updateCalendarEvents();
      this.providerCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.providerCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }

  updateProviderCheckbox(event, provider: PracticeProviders) {
    let allchecked: boolean = true;
    this.providerCheckboxes.toArray().forEach(source => {
      allchecked = allchecked && source.checked;
    })
    this.providerToggle.checked = allchecked;
    this.updateEvents(event.source.checked, { value: provider.ProviderId })
  }

  updateCalendarEvents() {
    this.smartSchedulerService
      .CalendarAppointments({ 'StartDate': this.datepipe.transform(this.sundayDate, "MM/dd/yyyy") })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.calendarAppointments = resp.ListResult as CalendarAppointment[];
          this.updateWeeklyEvents();
        }
      })
  }

  updateWeeklyEvents() {
    this.calendarAppointments.forEach(app => {
      this.fullcalendar.getApi().addEvent({
        id: app.AppointmentId,
        title: app.PatientName,
        start: app.StartAt,
        end: app.EndAt,
        classNames: ['fc-event-appointment-type'],
        backgroundColor: app.StatusColor,
        borderColor: app.TypeColor,
        resourceId: app.RoomId,
        //textColor: app.AppColor,
        extendedProps: {
          PatientName: app.PatientName,
          ProviderName: app.ProviderName, Room: app.RoomName,
          Duration: app.Duration
        }
      })
    })

  }

  handleButtons() {
    this.toggleButtonVisibility = !this.toggleButtonVisibility;
  }

  nextCalenderEvents() {
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().next();
    this.sundayDate = this.WeekBeginDate;
    this.updateCalendarEvents();
  }

  previousCalenderEvents() {
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().prev();
    this.sundayDate = this.WeekBeginDate;
    this.updateCalendarEvents();
  }

  get WeekBeginDate(): Date {
    let tdate = this.fullcalendar.getApi().getDate()
    tdate.setDate(tdate.getDate() - tdate.getDay());
    return tdate;
  }
  InitCalendarOptions() {

    this.calendarOptions = {
      schedulerLicenseKey: '0977988272-fcs-1658237663',
      plugins: [resourceTimeGridPlugin, dayGridPlugin, interactionPlugin],
      initialView: "timeGridWeek",
      editable: true,
      duration: 30,
      weekends: true,
      // columnHeaderText: function(mom){if (mom.weekday() === 5) {
      //   return 'Friday!';
      // } else {
      //   return mom.format('LLL');
      // }},
      // slotLabelFormat: 'h(:mm)a',
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      },
      views: {
        timeGridWeek: {
          titleFormat: { year: 'numeric', month: 'long' }

        },
        timeGrid: {
          titleFormat: { year: 'numeric', day: '2-digit', month: 'short' }
        },
      },
      customButtons: {
        NextWeek: {
          text: ' > ',
          click: this.nextCalenderEvents.bind(this)
        },
        Previousweek: {
          text: ' < ',
          click: this.previousCalenderEvents.bind(this)
        }
      },

      headerToolbar: {
        left: 'resourceTimeGridDay,timeGridWeek',
        center: 'title',
        right: 'Previousweek,NextWeek'
      },

      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDragStop.bind(this),
      eventDidMount: this.handleEventMount.bind(this),
      eventMouseEnter: function (args: EventHoveringArg) {
        //alert(JSON.stringify(args.event))
        this.timer = setTimeout(() => {
          let myPopup = document.getElementById('event-view');
          if (myPopup) { myPopup.remove(); }
          let timer;
          let x = args.el.getBoundingClientRect().left + this.el.offsetWidth / 2; // Get the middle of the element
          let y = args.el.getBoundingClientRect().top + this.el.offsetHeight + 6; // Get the bottom of the element, plus a little extra
          let popup = document.createElement('div');
          popup.id = "event-view"
          popup.style.width = "250px";

          let data = args.event.extendedProps;
          // popup.style.top = y.toString() + "px";
          //popup.style.left = x.toString() + "px";
          popup.style.background = "#fff"
          popup.style.color = "#41b6a6"
          popup.style.fontSize = "12px"
          popup.style.fontWeight = "600"
          popup.style.marginTop = "2px"
          popup.style.position = "absolute"
          popup.style.zIndex = "1000000"


          let dcontainer = document.createElement('div');
          dcontainer.id = "dcontainer"
          dcontainer.style.width = "250px"
          dcontainer.style.height = "10px"
          dcontainer.style.display = "inline-flex"
          dcontainer.style.left = "0px"
          dcontainer.style.position = "absolute"
          dcontainer.style.background = "#fff"
          let d1 = document.createElement('div');
          d1.style.width = "50px";
          d1.style.height = "10px";
          d1.style.border = "unset"
          d1.style.borderBottom = "solid 2px #41b6a6"
          d1.style.left = "0px"
          dcontainer.appendChild(d1);

          let ar = document.createElement('div');
          ar.style.height = "5px"
          ar.style.width = "10px";
          ar.style.border = "unset"
          ar.style.left = "48px"
          ar.style.top = " 2px"
          ar.style.position = "relative"
          let i = document.createElement("i")
          i.className = "fa fa-chevron-up"
          i.style.color = "#41b6a6"
          i.style.fontSize = "15px"
          i.style.top = "-5px"
          i.style.left = "-50px"
          i.style.position = "absolute"

          ar.appendChild(i);
          dcontainer.appendChild(ar);

          let d3 = document.createElement('div');
          d3.style.width = "188px";
          d3.style.height = "10px";
          d3.style.border = "unset"
          d3.style.borderBottom = "solid 2px #41b6a6"
          d3.style.left = "63px"

          dcontainer.appendChild(d3);

          popup.appendChild(dcontainer)

          let content = document.createElement('div');
          dcontainer.id = "event-content"
          content.style.width = "248px"
          content.style.whiteSpace = "nowrap"
          content.style.border = "solid 2px #41b6a6"
          content.style.borderTop = "unset"
          content.style.padding = "10px"
          let pn = document.createElement('div');
          pn.style.padding = '5px';
          pn.innerHTML = "Patient: " + data.PatientName;
          content.appendChild(pn);
          let pr = document.createElement('div');
          pr.style.padding = '5px';
          pr.innerHTML = "Provider: " + data.ProviderName;
          content.appendChild(pr);
          let rm = document.createElement('div');
          rm.style.padding = '5px';
          rm.innerHTML = data.Room + '  ' + data.Duration + ' Min';
          content.appendChild(rm);
          popup.appendChild(content)

          args.el.appendChild(popup);
          this.myPopup = popup;
          setTimeout(() => {
            if (myPopup) this.myPopup.remove();
          }, 10000);
        }, this.delay)
      },
      eventMouseLeave: function (args) {
        if (this.timer) clearTimeout(this.timer);
        if (this.myPopup) { this.myPopup.remove(); }
      }

    };

  }

  handleEventMount(arg) {
    //console.log(arg);
  }

  ngOnInit() {
    this.loadDefaults();
    this.updateCalendarEvents();
    // need for load calendar bundle first
    forwardRef(() => Calendar);
    this.InitCalendarOptions();
    //this.initPatient();
    this.LoadAppointmentDefalts();
    this.updateProviderAndStaff.subscribe((value) => {
      value.forEach(val => { this.providerAndStaff.push(val) })
    })
    this.CalenderSchedule();
  }


  PatientAppointmentInfo(appointment: CalendarAppointment, action: Actions) {
    let data = {} as AppointmentDialogInfo;
    this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = appointment.LocationId;
    this.PatientAppointment.ProviderId = appointment.ProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    let endAt = new Date(appointment.StartAt);
    endAt.setMinutes(endAt.getMinutes() + 30);
    let timeslot = this.datepipe.transform(appointment.StartAt, "HH:mm a") + ' - ' + this.datepipe.transform(endAt, "HH:mm a")
    let TimeSlot: AvailableTimeSlot = {};
    TimeSlot.EndDateTime = endAt;
    TimeSlot.StartDateTime = appointment.StartAt;
    TimeSlot.TimeSlot = timeslot;
    TimeSlot.Selected = true;
    data.TimeSlot = TimeSlot;
    data.Title = action == Actions.new ? "Add Appointment" : "Edit Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.appointmentTypes;
    data.PracticeProviders = this.practiceProviders;
    data.Locations = this.locations;
    data.Rooms = this.Rooms;
    data.PatientAppointment.AppointmentId = appointment.AppointmentId
    data.PatientAppointment.Startat = appointment.StartAt
    data.PatientAppointment.AppointmentStatusId = appointment.AppStatusId;
    data.PatientAppointment.AppointmentTypeId = appointment.AppTypeId;
    data.PatientAppointment.RoomId = appointment.RoomId;
    data.PatientAppointment.Notes = appointment.Notes;
    data.status = action;
    data.NavigationFrom = "Calendar"
    return data;
  }

  SelectAppointment(event: EventApi): AppointmentDialogInfo {
    let appointment: CalendarAppointment = null;

    this.calendarAppointments.forEach(app => {
      if (app.AppointmentId == event.id) {

        appointment = app;
      }
    })
    if (appointment == null) {
      appointment = {};
      appointment.StartAt = event.start;
    }


    return this.PatientAppointmentInfo(appointment, Actions.view);
  }

  handleDateClick(arg) {
    let event = arg;
    let eventDate = new Date(this.datepipe.transform(event.date, "MM/dd/yyyy"));
    let today = new Date(this.datepipe.transform(new Date(), "MM/dd/yyyy"))

    if (eventDate >= today) {
      let appointment: CalendarAppointment = {};
      appointment.StartAt = event.date;
      appointment.ProviderId = this.authService.userValue.ProviderId;
      appointment.LocationId = this.authService.userValue.CurrentLocation;
      if (event.resource != null)
        appointment.RoomId = event.resource.id;
      let dialog: AppointmentDialogInfo = this.PatientAppointmentInfo(appointment, Actions.new);

      let isTimeInBusinessHours = (event.date as Date).getTime() > (this.CalendarSchedule.CalendarFrom).getTime()
        && (event.date as Date).getTime() < (this.CalendarSchedule.CalendarTo).getTime()

      if (this.CalendarSchedule.OutSidePracticeHour)
        this.openComponentDialog(this.appointmentDialogComponent,
          dialog, Actions.view);
      else if (!isTimeInBusinessHours) {
        this.displayMessageDialogForBusinessHours(ERROR_CODES["E2B005"], dialog)
      }
    }

  }

  handleEventClick(arg) {
    let event: EventApi = arg.event;
    let eventDate = new Date(this.datepipe.transform(event.start, "MM/dd/yyyy"));
    let today = new Date(this.datepipe.transform(new Date(), "MM/dd/yyyy"));
    let dialog: AppointmentDialogInfo = this.SelectAppointment(arg.event);
    if (eventDate >= today)
      this.openComponentDialog(this.appointmentDialogComponent,
        dialog, Actions.view);
  }

  checkEventMove(event: EventApi): boolean {
    let flag: boolean = false;
    if (!this.CalendarSchedule.ConcurrentApps) {
      this.fullcalendar.getApi().getEvents().forEach((evt) => {
        if (event.startStr == evt.startStr
          && event.id != evt.id
        ) {
          let eventResources = event.getResources()
          let evtResources = evt.getResources()
          eventResources.forEach(resource => {
            evtResources.forEach(res => {
              if (!flag)
                flag = (res.id == resource.id);
            })
          })

        }
      })
    }
    return flag;
  }

  handleEventDragStop(arg) {
    let event: EventApi = arg.event as EventApi;
    let oldEvent: EventApi = arg.oldEvent as EventApi;

    if (arg.view.type == 'timeGridWeek') {
      if (event.start < new Date()) {
        this.alertMessage.displayErrorDailog(ERROR_CODES["E2B001"]);
        arg.revert();
      } else if (this.checkEventMove(event)) {
        this.displayMessageDialogWithResult(ERROR_CODES["E2B002"], arg);
      }
      else {
        this.RescheduleAppointment(event)
      }
    } else if (arg.view.type == 'resourceTimeGridDay') {
      if (event.start < new Date()) {
        this.alertMessage.displayErrorDailog(ERROR_CODES["E2B001"]);
        arg.revert();
      } else if (event.getResources().length == 1 &&
        oldEvent.getResources().length == 1) {
        let resoruce = event.getResources()[0]
        let oldresoruce = oldEvent.getResources()[0]
        if (resoruce.id == oldresoruce.id) {
          this.RescheduleAppointment(event);
        } else if (this.checkEventMove(event)) {
          this.displayMessageDialogWithResult(ERROR_CODES["E2B002"], arg);
        }
        else {
          this.AllocateNewResource(event)
        }
      }
    }
  }

  displayMessageDialogWithResult(message, arg) {
    Swal.fire({
      title: message,
      position: 'top',
      background: '#e1dddd',
      showConfirmButton: true,
      confirmButtonText: 'Accept',
      showDenyButton: true,
      denyButtonText: `Reject`,
      width: '600',
      customClass: {
        container: 'swal2-container-high-zindex',
        confirmButton: 'swal2-messaage'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (arg.view.type == 'timeGridWeek')
          this.RescheduleAppointment(arg.event as EventApi)
        // else if (arg.view.type == 'resourceTimeGridDay')
        //   this.AllocateNewResource(arg.event as EventApi)
      } else if (result.isDenied) {
        arg.revert();
      }
    })
  }

  displayMessageDialogForBusinessHours(message, dialog: AppointmentDialogInfo) {
    Swal.fire({
      title: message,
      position: 'top',
      background: '#e1dddd',
      showConfirmButton: true,
      confirmButtonText: 'Accept',
      showDenyButton: true,
      denyButtonText: `Reject`,
      width: '600',
      customClass: {
        container: 'swal2-container-high-zindex',
        confirmButton: 'swal2-messaage'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.openComponentDialog(this.appointmentDialogComponent,
          dialog, Actions.view);
      }
    })
  }

  RescheduleAppointment(event: EventApi) {
    this.calendarAppointments.forEach(appointment => {
      if (appointment.AppointmentId == event.id) {
        appointment.strStartAt = this.datepipe.transform(event.start, "MM/dd/yyyy HH:mm");
        appointment.
        this.smartSchedulerService.ReschuduleAppoinment(appointment)
          .subscribe(resp => {
            if (resp.IsSuccess) {
              this.alertMessage.displayMessageDailog(ERROR_CODES["M2B001"]);
            } else {
              this.alertMessage.displayMessageDailog(ERROR_CODES["E2B003"]);
            }
          })
      }
    })
  }

  AllocateNewResource(event: EventApi) {
    this.calendarAppointments.forEach(appointment => {
      if (appointment.AppointmentId == event.id) {
        if (event.getResources().length == 1) {
          appointment.RoomId = event.getResources()[0].id;
          appointment.strStartAt = this.datepipe.transform(event.start, "MM/dd/yyyy HH:mm");
          this.smartSchedulerService.AllocateNewResource(appointment)
            .subscribe(resp => {
              if (resp.IsSuccess) {
                this.alertMessage.displayMessageDailog(ERROR_CODES["M2B002"]);
              } else {
                this.alertMessage.displayMessageDailog(ERROR_CODES["E2B004"]);
              }
            })
        }
        else {
          this.alertMessage.displayMessageDailog(ERROR_CODES["E2B004"]);
        }
      }
    })
  }

  RefreshCalendar(event) {
    if (event) {
      this.fullcalendar.getApi().removeAllEvents();
      this.updateCalendarEvents();
    }
  }

  TimeIn24Format() {
    let time = (this.CalendarSchedule.CalendarFrom + "").replace('AM', " AM").replace('PM', " PM");
    let tm = this.datepipe.transform(new Date(), 'MM/dd/yy') + ' ' + time
    this.CalendarSchedule.CalendarFrom = new Date(tm)
    time = (this.CalendarSchedule.CalendarTo + "").replace('AM', " AM").replace('PM', " PM");
    tm = this.datepipe.transform(new Date(), 'MM/dd/yy') + ' ' + time.replace('AM', " AM").replace('PM', " PM")
    this.CalendarSchedule.CalendarTo = new Date(tm)
  }
  CalenderSchedule() {
    let reqparams = {
      clinicId: this.user.ClinicId
    };
    this.settingsService.Generalschedule(reqparams).subscribe((resp) => {
      if (resp.IsSuccess) {
        if (resp.ListResult.length == 1) {
          this.CalendarSchedule = resp.ListResult[0];
          this.TimeIn24Format();
          this.fullcalendar.getApi().setOption("businessHours", {
            daysOfWeek: [1, 2, 3, 4, 5], // Monday, Tuesday, Wednesday
            startTime: this.datepipe.transform(this.CalendarSchedule.CalendarFrom, 'H:mm'), // 8am
            endTime: this.datepipe.transform(this.CalendarSchedule.CalendarTo, 'H:mm')// 6pm
          })
        }
      }
    })
  }

  LoadAppointmentDefalts() {
    if (this.SelectedProviderId == this.authService.userValue.ProviderId ||
      this.SelectedProviderId == "")
      this.locations = JSON.parse(this.authService.userValue.LocationInfo);
    else {
      this.smartSchedulerService.PracticeLocations(this.SelectedProviderId, this.user.ClinicId)
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.locations = resp.ListResult as UserLocations[];
          }
        });
    }

    let lreq = { "LocationId": this.SelectedLocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        this.UpdateResources();
      }
    });
  }

  BlockoutInfo() {
    let blockoutDialog: BlockOutDialog = {}
    blockoutDialog.Locations = this.locations;
    blockoutDialog.PracticeProvider = this.practiceProviders;
    blockoutDialog.Rooms = this.Rooms;
    blockoutDialog.Staff = this.providerStaff;
    return blockoutDialog;
  }
  OpenBlockoutDialog() {
    this.openComponentDialog(this.blockoutDialogComponent,
      this.BlockoutInfo(), Actions.new);
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
      if (content === this.appointmentDialogComponent) {
        if (res.data && res.data.refresh) {
          this.fullcalendar.getApi().removeAllEvents();
          this.updateCalendarEvents();
          //this.RefreshParentView.emit(true);
        }
      } else if (content == this.blockoutDialogComponent) {

      }
    });

  }
}

