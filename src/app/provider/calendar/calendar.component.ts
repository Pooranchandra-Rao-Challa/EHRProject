import { DownloadService } from './../../_services/download.service';
import { MatSelect } from '@angular/material/select';
import { AvailableTimeSlot, Blockout } from 'src/app/_models/_provider/smart.scheduler.data';
import { BehaviorSubject } from 'rxjs';
import { AppointmentType, AppointmentStatus, TimeSlot, GeneralSchedule } from './../../_models/_provider/_settings/settings';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

import { Component, OnInit, ElementRef, Inject, LOCALE_ID, HostListener, ViewChild, forwardRef, AfterViewInit, QueryList, ViewChildren, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { CalendarOptions, Calendar, EventHoveringArg, EventApi, BusinessHoursInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent, EventClickArg } from '@fullcalendar/angular';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import { Actions, AppointmentDialogInfo, AppointmentDownloadParams, BlockOutDialog, CalendarAppointment, NewAppointment, PracticeProviders, Room, User, UserLocations } from 'src/app/_models';
import { SettingsService } from 'src/app/_services/settings.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { LocationSelectService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { ComponentType } from '@angular/cdk/portal';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { BlockoutDialogComponent } from 'src/app/dialogs/blockout/blockout.dialog.component';


//import adaptivePlugin from '@fullcalendar/adaptive'

class BlockOutInfo {
  id?: string;
  providerId: string;
}

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
  blockouts?: Blockout[] = [{}]

  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;

  @ViewChildren('locationCheckboxes') private locationCheckboxes: QueryList<any>;
  // @ViewChild('locationsToggle') private locationsToggle: MatCheckbox;


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
  selectedDate = null;

  calendarAppointments: CalendarAppointment[] = [{}]
  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private settingsService: SettingsService,
    private locationSelectService: LocationSelectService,
    private alertMessage: AlertMessage,
    private overlayService: OverlayService,
    private downloadService: DownloadService,
    private datepipe: DatePipe) {
    this.user = authService.userValue;
    //this.selectedDate = new Date();
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

  InsertActions() {
    if (document.getElementsByClassName("fc-header-toolbar") != null &&
      document.getElementsByClassName("fc-header-toolbar").length == 1) {
      let chunks = document.getElementsByClassName("fc-header-toolbar")[0].getElementsByClassName("fc-toolbar-chunk");
      if (chunks != null && chunks.length == 3) {
        let select = document.createElement('div');
        select.setAttribute('aria-label', 'Select option');
        select.setAttribute('class', 'calendar-actions ');
        let selectButton = document.createElement('button');
        selectButton.setAttribute('class', 'calendar-btn btn-green dropdown-toggle');
        selectButton.setAttribute('type', 'button');
        selectButton.setAttribute('id', 'actionOptions');
        selectButton.setAttribute('data-bs-toggle', 'dropdown');
        selectButton.setAttribute('aria-expanded', 'false');
        selectButton.innerText = " Actions ";
        select.append(selectButton);
        let selectMenu = document.createElement('ul');
        selectMenu.setAttribute('class', 'dropdown-menu calender-menu');
        selectMenu.setAttribute('aria-labelledby', 'actionOptions');
        select.append(selectMenu);

        let opt1 = document.createElement('li');
        let optitem1 = document.createElement('div');
        optitem1.setAttribute('class', 'dropdown-item calender-item');
        optitem1.addEventListener('click', this.PrintAppointments.bind(this), false);
        optitem1.innerText = "Print";
        opt1.appendChild(optitem1);
        selectMenu.appendChild(opt1);

        let opt2 = document.createElement('li');
        let optitem2 = document.createElement('div');
        optitem2.setAttribute('class', 'dropdown-item calender-item');
        optitem2.addEventListener('click', this.downloadCsvAppointments.bind(this), false);
        optitem2.innerText = "Download CSV";
        opt2.appendChild(optitem2);
        selectMenu.appendChild(opt2);

        chunks[2].setAttribute("style", "display: flex");
        chunks[2].insertBefore(select, chunks[2].firstChild);
      }
    }
  }

  ngAfterViewInit(): void {

    this.InsertActions();

    let timeGridResourceButtons = document.getElementsByClassName('fc-DayButton-button');
    let timeGridWeekButtons = document.getElementsByClassName('fc-WeekButton-button');

    let fccolheader = document.getElementsByClassName('fc-col-header');
    let fctimegridbody = document.getElementsByClassName('fc-timegrid-body');
    if (fccolheader != null && fccolheader.length == 1) {
      document.getElementsByClassName('fc-col-header')[0].setAttribute('style', 'width:100%')
    }
    if (fctimegridbody != null && fctimegridbody.length == 1) {
      document.getElementsByClassName('fc-timegrid-body')[0].setAttribute('style', 'width:100%')
      let tables = document.getElementsByClassName('fc-timegrid-body')[0].getElementsByTagName('table')
      if (tables != null && tables.length == 2) {
        document.getElementsByClassName('fc-timegrid-body')[0].getElementsByTagName('table')[1].setAttribute('style', 'width:100%')
      }
      let fcTimeGridSlots = document.getElementsByClassName('fc-timegrid-slots');
      if (fcTimeGridSlots != null && fcTimeGridSlots.length == 1) {
        let fcTimeGridSlotsTable = fcTimeGridSlots[0].getElementsByTagName('table');
        if (fcTimeGridSlotsTable != null && fcTimeGridSlotsTable.length == 1) {
          document.getElementsByClassName('fc-timegrid-slots')[0].getElementsByTagName('table')[0].setAttribute('style', 'width:100%');
        }
      }
    }


    let roomsPanel = document.getElementsByClassName('panel rooms');

    if (timeGridResourceButtons != null && timeGridResourceButtons.length == 1) {
      timeGridResourceButtons[0].addEventListener('click', function () {

        if (roomsPanel != null && roomsPanel.length == 1)
          roomsPanel[0].classList.remove('fc-hide-room');
      })
    }
    if (timeGridWeekButtons != null && timeGridWeekButtons.length == 1) {
      timeGridWeekButtons[0].addEventListener('click', function () {

        if (roomsPanel != null && roomsPanel.length == 1) {
          roomsPanel[0].classList.remove('fc-hide-room');
          roomsPanel[0].classList.add('fc-hide-room');
        }


      })
    }
    let providerExPanel = document.getElementsByClassName('panel providers')
    if (providerExPanel != null && providerExPanel.length == 1) {
      let expPanelIndicator = providerExPanel[0].getElementsByClassName('mat-expansion-indicator');

      if (expPanelIndicator != null) {
        expPanelIndicator[0].setAttribute("style", "transform: rotate(270deg);");
      }

    }


    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.add('fc-timegrid-switch');
    }

    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-Previousweek-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-Previousweek-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-Previousweek-button")[0].classList.add('fc-timegrid-switch');
    }
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-NextWeek-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-NextWeek-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-NextWeek-button")[0].classList.add('fc-timegrid-switch');
    }


    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.add('fc-resource-toolbar-button');

      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-timegrid-switch-2');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.add('fc-timegrid-switch-2');
      //fc-timegrid-switch-2
    }
    //this.bindLocation();
  }

  bindLocation() {

    let dcontainer = document.createElement('div');
    dcontainer.classList.add("col-12")
    let left = document.createElement('div');
    left.classList.add(...["col-6", "pull-left"])
    let lblLocation = document.createElement('span');
    lblLocation.innerText = "Locations";
    lblLocation.classList.add(...["col-4", "fc-calender-label"]);
    left.append(lblLocation);
    let right = document.createElement('div');
    right.classList.add(...["col-6", "pull-right"])

    dcontainer.append(left)
    dcontainer.append(right)
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-header-toolbar").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-header-toolbar")[0].after(dcontainer);
    }

    let fieldset = document.createElement('field-set')
    fieldset.setAttribute("id", "custom")
    let select = document.createElement('select')
    select.setAttribute("id", "select")
    select.classList.add(...["col-4", "fc-toolbar-select"])


    select.addEventListener("change", (event) => {
      event.stopPropagation();
      this.SelectedLocationId = select.value;
      this.LoadAppointmentDefalts();
      this.updateCalendarEvents();
    }
    );

    let selectIndex = -1;
    this.locations.forEach((location, index) => {
      let opt = document.createElement('option');
      opt.classList.add("fc-select-option")
      opt.text = location.LocationName
      opt.value = location.LocationId
      select.add(opt);
      if (location.LocationId == this.SelectedLocationId) {
        selectIndex = index;
      }
    })
    fieldset.append(select);
    left.append(fieldset)

    select.selectedIndex = selectIndex;
  }

  UpdateResources() {
    this.clearResource();
    this.Rooms.forEach(room => {
      if (room.RoomName != '') {
        this.fullcalendar.getApi().addResource({
          id: room.RoomId,
          title: room.RoomName
        });
      }
    });
  }

  clearResource() {
    this.fullcalendar.getApi().getResources().forEach(resource => resource.remove());
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

  updateLocation(event, location: UserLocations, locationIndex: number) {
    this.SelectedLocationId = event.source.value.LocationId;
    this.locationCheckboxes.toArray().forEach(source => {
      source.checked = false;
    })
    event.source.checked = this.SelectedLocationId == event.source.value.LocationId;
    this.removeAllEvents();
    this.updateCalendarEvents();
    this.loadRooms();
  }




  ToggleAllAppointmentTypes(event) {
    this.removeAllEvents();
    this.updateBlockOuts(true, null);
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
    this.updateBlockOuts(true, null);
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
      if (event.extendedProps.IsEvent) event.remove();
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
            LocationName: appoinment.LocationName,
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
      this.updateBlockOuts(true, null);
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
    this.updateBlockOuts(event.source.checked, { value: provider.ProviderId });
  }

  updateCalendarEvents() {
    this.smartSchedulerService
      .CalendarAppointments({
        'StartDate': this.datepipe.transform(this.sundayDate, "MM/dd/yyyy"),
        ClinicId: this.user.ClinicId,
        LocationId: this.SelectedLocationId
      })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          this.calendarAppointments = resp.ListResult as CalendarAppointment[];
          this.updateWeeklyEvents();
        }
      })
  }

  updateWeeklyEvents() {
    this.calendarAppointments.forEach(app => {
      if (this.fullcalendar.getApi().getEventById(app.AppointmentId) != null)
        this.fullcalendar.getApi().getEventById(app.AppointmentId).remove();
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
          IsEvent: true,
          PatientName: app.PatientName,
          ProviderName: app.ProviderName,
          Room: app.RoomName,
          Duration: app.Duration,
          LocationName: app.LocationName,
          IsBlockout: false,
        }
      })
    })

  }

  SwitchfullcalendarToDate(event) {
    this.selectedDate = new Date(event);
    this.sundayDate = new Date(event)
    this.sundayDate.setDate(this.sundayDate.getDate() - this.sundayDate.getDay());


    if (this.fullcalendar.getApi().currentData.viewApi.type == "timeGridWeek")
      this.fullcalendar.getApi().changeView(this.fullcalendar.getApi().currentData.viewApi.type, this.selectedDate);
    else
      this.fullcalendar.getApi().changeView(this.fullcalendar.getApi().currentData.viewApi.type, this.selectedDate);
    this.fullcalendar.getApi().removeAllEvents();
    this.highlightSelectedDate();
    this.updateCalendarEvents();
    this.CalendarBlockouts();
  }

  highlightSelectedDate() {

    this.fullcalendar.getApi().el.querySelectorAll("h2[id='fc-dom-1']").forEach((nodeElement: HTMLElement) => {
      nodeElement.classList.remove('fc-resource-title-date');
    })



    if (this.fullcalendar.getApi().view.type == 'timeGridWeek') {
      let curdate = this.datepipe.transform(this.selectedDate, "yyyy-MM-dd")
      this.fullcalendar.getApi().el.querySelectorAll("a[data-selected='true']").forEach((nodeElement: HTMLElement) => {
        nodeElement.classList.remove('fc-selected-date');
        nodeElement.removeAttribute("data-selected");
      });


      this.fullcalendar.getApi().el.querySelectorAll("th[data-date='" + curdate + "']").forEach((nodeElement: HTMLElement) => {
        nodeElement.childNodes.forEach((ne: HTMLElement) => {
          if (ne.children.length > 0) {
            ne.children[0].classList.remove('fc-selected-date')
            ne.children[0].classList.add('fc-selected-date')
            ne.children[0].setAttribute("data-selected", "true")
          }
        })
      });
    } else if (this.fullcalendar.getApi().view.type == 'resourceTimeGridDay' && this.selectedDate != null) {
      this.fullcalendar.getApi().el.querySelectorAll("h2[id='fc-dom-1']").forEach((nodeElement: HTMLElement) => {
        nodeElement.classList.remove('fc-resource-title-date');
        nodeElement.classList.add('fc-resource-title-date');
      })

    }


  }

  removeAllBlockouts() {
    this.fullcalendar.getApi().getEvents()?.forEach((value, i) => {
      if (value.extendedProps.IsBlockout) value.remove();
    })
  }
  updateBlockOuts(toggler?: boolean, check: { value: string } = null) {
    this.removeAllBlockouts();

    this.blockouts.forEach(blockout => {
      if ((check == null || (check != null && check.value != blockout.BlockoutForId))
        || (toggler && (check != null && check.value == blockout.BlockoutForId))) {
        let bid = blockout.BlockoutId + ':' + blockout.SequenceNumber;
        this.fullcalendar.getApi().addEvent({
          id: bid,
          title: blockout.Message == "" ? "Blockout day" : blockout.Message,
          start: blockout.StartAt,
          end: blockout.EndAt,
          classNames: ['fc-event-blockout'],
          backgroundColor: "#BBBBBB",
          borderColor: "#BBBBBB",
          resourceId: blockout.RoomId,
          extendedProps: {
            IsBlockout: true,
            Note: blockout.Note,
            bidFor: blockout.BlockoutFor,
            bid: blockout.BlockoutForId,
            Duration: blockout.Duration
          }
        })
      }
    });

  }

  handleButtons() {
    this.toggleButtonVisibility = !this.toggleButtonVisibility;
  }

  nextCalenderEvents() {
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().next();
    this.sundayDate = this.WeekBeginDate;
    this.updateCalendarEvents();
    this.CalendarBlockouts();
  }

  previousCalenderEvents() {
    this.fullcalendar.getApi().removeAllEvents();
    this.fullcalendar.getApi().prev();
    this.sundayDate = this.WeekBeginDate;
    this.updateCalendarEvents();
    this.CalendarBlockouts()
  }

  downloadCsvAppointments(event$) {
    let reqParams: AppointmentDownloadParams = {
      ClinicId: this.user.ClinicId,
      ProviderId: this.user.ProviderId,
      LocationId: this.user.CurrentLocation,
      strCurrentDate: this.datepipe.transform(this.fullcalendar.getApi().getDate(), "MM/dd/yyyy"),
      CalendarView: this.fullcalendar.getApi().view.type,
      strCurrentStart: this.datepipe.transform(this.fullcalendar.getApi().view.currentStart, "MM/dd/yyyy"),
      strCurrentEnd: this.datepipe.transform(this.fullcalendar.getApi().view.currentEnd, "MM/dd/yyyy"),
    };

    //resourceTimeGridDay
    //timeGridWeek
    this.downloadService.DownloadAppointments(reqParams);
  }

  PrintAppointments() {

    var winAttr = "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=640, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";

    var linkElements = document.getElementsByTagName('link');
    var link = '';
    for(var i = 0, length = linkElements.length; i < length; i++) {
      link = link + linkElements[i].outerHTML;
    }

    var styleElements = document.getElementsByTagName('style');
    var styles = '';
    for(var i = 0, length = styleElements.length; i < length; i++) {
      styles = styles + styleElements[i].innerHTML;
     }

    let popupWin = window.open('', '_blank',winAttr);
    popupWin.document.open();
    popupWin.document.write('<html><title>Schedule Preview</title><style>.fc-header-toolbar{display :none !important;} .fc-scroller.fc-scroller-liquid{overflow:visible !important;} .fc-view-harness.fc-view-harness-active{height:auto !important;}</style></head><body">')
    popupWin.document.write(this.fullcalendar.getApi().el.innerHTML);
    popupWin.document.write('</html>');
    popupWin.document.close();
    popupWin.print();
    //setTimeout(popupWin.print(), 20000);

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
      selectable: true,

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
          titleFormat: { year: 'numeric', day: '2-digit', month: 'short' },

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
        },
        DayButton: {
          text: ' Day ',
          click: this.resourceTimegridDayClick.bind(this)
        },

        WeekButton: {
          text: ' Week ',
          click: this.timegridWeekClick.bind(this)
        }
      },

      headerToolbar: {
        left: 'DayButton,WeekButton',
        center: 'title',
        right: 'Previousweek,NextWeek',
      },


      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventDragStop.bind(this),
      eventDidMount: this.handleEventMount.bind(this),
      select: this.handleSelectDuration.bind(this),
      viewDidMount: this.handleViewDidMount.bind(this),
      eventMouseEnter: function (args: EventHoveringArg) {
        //alert(JSON.stringify(args.event))
        this.timer = setTimeout(() => {
          let data = args.event.extendedProps;
          if (data.IsBlockout) return;
          let myPopup = document.getElementById('event-view');
          if (myPopup) { myPopup.remove(); }
          let timer;
          let top = args.el.parentElement.offsetTop;
          let x = args.el.getBoundingClientRect().left + this.el.offsetWidth / 2; // Get the middle of the element
          let y = args.el.getBoundingClientRect().top + this.el.offsetHeight + 6; // Get the bottom of the element, plus a little extra
          let popup = document.createElement('div');
          popup.id = "event-view"
          popup.style.width = "250px";

          popup.style.background = "transparent"
          popup.style.color = "#41b6a6"
          popup.style.fontSize = "12px"
          popup.style.fontWeight = "600"
          popup.style.marginTop = "30px"
          popup.style.position = "absolute"
          popup.style.zIndex = "1000000"
          popup.style.top = top + "px";

          let dcontainer = document.createElement('div');
          dcontainer.id = "dcontainer"
          dcontainer.style.width = "18px"
          dcontainer.style.height = "10px"
          dcontainer.style.display = "inline-flex"
          dcontainer.style.left = "20px"
          dcontainer.style.position = "absolute"
          dcontainer.style.background = "#41b6a6"
          let d1 = document.createElement('div');
          d1.style.width = "55px";
          d1.style.height = "10px";
          //d1.style.marginLeft = "4px";
          d1.style.border = "unset"
          // d1.style.borderBottom = "solid 1px #41b6a6"
          d1.style.borderRightWidth = "2px";
          d1.style.borderRightColor = "#41b6a6";
          d1.style.borderRightStyle = "solid";
          d1.style.borderBottomRightRadius = "50px"
          d1.style.left = "0px"
          d1.style.background = "white"
          dcontainer.appendChild(d1);

          let d3 = document.createElement('div');
          d3.style.width = "55px";
          d3.style.height = "10px";
          d3.style.border = "unset"
          d3.style.left = "63px"
          d3.style.borderLeftWidth = "1px";
          d3.style.borderBottomLeftRadius = "50px"
          d3.style.borderLeftColor = "#41b6a6";
          d3.style.borderLeftStyle = "solid";
          d3.style.background = "white"

          dcontainer.appendChild(d3);

          popup.appendChild(dcontainer)

          let content = document.createElement('div');
          dcontainer.id = "event-content"
          content.style.width = "248px"
          content.style.whiteSpace = "nowrap"
          content.style.border = "solid 1px #41b6a6"
          content.style.borderRadius = "10"
          content.style.borderTop = "solid 1px #41b6a6"
          content.style.padding = "5px 10px 10px 10px"
          content.style.borderRadius = "5px"
          content.style.marginTop = "10px"
          content.style.background = "white"

          let pn = document.createElement('div');
          pn.style.padding = '5px';
          pn.innerHTML = "Patient: " + data.PatientName;
          content.appendChild(pn);
          let pr = document.createElement('div');
          pr.style.padding = '5px';
          pr.innerHTML = "Provider: " + data.ProviderName;
          content.appendChild(pr);
          let lo = document.createElement('div');
          lo.style.padding = '5px';
          lo.innerHTML = data.LocationName;
          content.appendChild(lo);
          let rm = document.createElement('div');
          rm.style.padding = '5px';
          rm.innerHTML = data.Room + '  ' + data.Duration + ' Min';
          content.appendChild(rm);
          popup.appendChild(content)

          args.el.parentElement.parentElement.appendChild(popup);
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

  resourceTimegridDayClick(arg) {

    this.fullcalendar.getApi().changeView('resourceTimeGridDay', this.selectedDate)
    this.highlightSelectedDate();
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.add('fc-timegrid-switch');
    }
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.add('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-timegrid-switch-2');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.add('fc-timegrid-switch-2');
    }
  }
  ResetSelection() {
    this.selectedDate = null;
    this.sundayDate = new Date()
    this.sundayDate.setDate(this.sundayDate.getDate() - this.sundayDate.getDay());
    this.highlightSelectedDate();
    if (this.fullcalendar.getApi().currentData.viewApi.type == "timeGridWeek") {
      this.fullcalendar.getApi().changeView('timeGridWeek', this.sundayDate)
    } else {
      this.fullcalendar.getApi().changeView('resourceTimeGridDay', new Date())
    }
  }
  timegridWeekClick(arg) {
    this.fullcalendar.getApi().changeView('timeGridWeek', this.sundayDate)


    this.highlightSelectedDate()
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-DayButton-button")[0].classList.add('fc-timegrid-switch');



    }
    if (this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button").length == 1) {
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-timegrid-switch');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.add('fc-resource-toolbar-button');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.remove('fc-timegrid-switch-2');
      this.fullcalendar.getApi().el.getElementsByClassName("fc-WeekButton-button")[0].classList.add('fc-timegrid-switch-2');
    }

  }
  handleEventMount(arg) {

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
    this.CalendarBlockouts();

  }


  PatientAppointmentInfo(appointment: CalendarAppointment, action: Actions) {
    let data = {} as AppointmentDialogInfo;
    this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = appointment.LocationId;
    this.PatientAppointment.ProviderId = appointment.ProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = appointment.Duration;
    let endAt = new Date(appointment.StartAt);
    endAt.setMinutes(endAt.getMinutes() + appointment.Duration);
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


  }

  handleEventClick(arg) {

    let event: EventApi = arg.event;
    if (!event.extendedProps.IsBlockout) {
      let eventDate = new Date(this.datepipe.transform(event.start, "MM/dd/yyyy"));
      let today = new Date(this.datepipe.transform(new Date(), "MM/dd/yyyy"));
      let dialog: AppointmentDialogInfo = this.SelectAppointment(arg.event);
      if (eventDate >= today)
        this.openComponentDialog(this.appointmentDialogComponent,
          dialog, Actions.view);
    }
    else {
      this.OpenBlockoutForEdit(event.id, this.BlockoutDialogInfo())
    }
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
    if (event.extendedProps.IsBlockout) arg.revert();

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

  handleSelectDuration(arg) {
    let event = arg;
    let eventDate = new Date(this.datepipe.transform(event.start, "MM/dd/yyyy"));
    let today = new Date(this.datepipe.transform(new Date(), "MM/dd/yyyy"))
    var diff = Math.abs(event.start.getTime() - event.end.getTime());
    var diffMin = Math.ceil(diff / (1000 * 60));
    if (diffMin > 60 * 24) return;
    if (eventDate >= today) {
      let appointment: CalendarAppointment = {};
      appointment.StartAt = event.start;
      appointment.ProviderId = this.authService.userValue.ProviderId;
      appointment.LocationId = this.authService.userValue.CurrentLocation;
      appointment.Duration = diffMin;
      if (event.resource != null)
        appointment.RoomId = event.resource.id;
      let dialog: AppointmentDialogInfo = this.PatientAppointmentInfo(appointment, Actions.new);

      let localStart = new Date(this.datepipe.transform(event.start as Date, "MM/dd/yyyy") + " " + this.datepipe.transform(this.CalendarSchedule.CalendarFrom, "HH:mm:ss"))
      let localEnd = new Date(this.datepipe.transform(event.start as Date, "MM/dd/yyyy") + " " + this.datepipe.transform(this.CalendarSchedule.CalendarTo, "HH:mm:ss"))

      let weeklyOff = [0, 6].indexOf((event.start as Date).getDay()) != -1;
      let isTimeInBusinessHours = ((event.start as Date).getTime() > localStart.getTime()
        && (event.start as Date).getTime() < localEnd.getTime())

      if (this.CalendarSchedule.OutSidePracticeHour
        || (isTimeInBusinessHours && !weeklyOff))
        this.openComponentDialog(this.appointmentDialogComponent,
          dialog, Actions.view);
      else if (weeklyOff) {
        this.displayMessageDialogForBusinessHours(ERROR_CODES["E2B006"], dialog)
      }
      else if (!isTimeInBusinessHours) {
        this.displayMessageDialogForBusinessHours(ERROR_CODES["E2B005"], dialog)
      }
    }

  }

  handleViewDidMount(arg) {

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
      //this.fullcalendar.getApi().removeAllEvents();
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
      this.SelectedProviderId == "") {
      this.locations = JSON.parse(this.authService.userValue.LocationInfo);
    }
    else {
      this.smartSchedulerService.PracticeLocations(this.SelectedProviderId, this.user.ClinicId)
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.locations = resp.ListResult as UserLocations[];
          }
        });
    }

    this.loadRooms();
  }

  loadRooms() {
    let lreq = { "LocationId": this.SelectedLocationId };
    this.smartSchedulerService.RoomsForLocation(lreq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.Rooms = resp.ListResult as Room[];
        this.UpdateResources();
      }
    });
  }

  BlockoutDialogInfo(): BlockOutDialog {
    let blockoutDialog: BlockOutDialog = {}
    blockoutDialog.Locations = this.locations;
    blockoutDialog.PracticeProvider = this.practiceProviders;
    blockoutDialog.Rooms = this.Rooms;
    blockoutDialog.Staff = this.providerStaff;
    blockoutDialog.Blockout = {}
    return blockoutDialog;
  }
  OpenBlockoutDialog() {
    let blockOutDialog = this.BlockoutDialogInfo();
    blockOutDialog.Blockout.CanEdit = true;
    this.openComponentDialog(this.blockoutDialogComponent,
      blockOutDialog, Actions.new);
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    const ref = this.overlayService.open(content, data);
    ref.afterClosed$.subscribe(res => {
      if (content === this.appointmentDialogComponent) {
        if (res.data && res.data.refresh) {
          //this.fullcalendar.getApi().removeAllEvents();
          this.updateCalendarEvents();
        }
      } else if (content == this.blockoutDialogComponent) {
        if (res.data && res.data.refresh) {
          this.CalendarBlockouts();
        }
      }
    });
  }



  CalendarBlockouts() {
    this.smartSchedulerService.CalendarBlockouts({
      'StartDate': this.datepipe.transform(this.sundayDate, "MM/dd/yyyy"),
      ClinicId: this.user.ClinicId
    }).subscribe(resp => {
      if (resp.IsSuccess) {
        this.blockouts = resp.ListResult;
        //this.GetBlockouts();
        this.updateBlockOuts(true, null);
      }
      else {
        this.blockouts = [{}]
        this.updateBlockOuts(true, null);
      }
    })
  }

  OpenBlockoutForEdit(blockoutId: string, blockoutdata: BlockOutDialog) {
    let bId = blockoutId;
    if (blockoutId.indexOf(':') > -1)
      bId = blockoutId.substring(0, blockoutId.indexOf(':'));
    this.smartSchedulerService.BlockoutInfo({
      BlockoutId: bId,
      strCurrentDate: this.datepipe.transform(new Date(), 'MM/dd/yyyy')
    }).subscribe(resp => {
      if (resp.IsSuccess) {
        blockoutdata.Blockout = resp.Result as Blockout;
        this.openComponentDialog(this.blockoutDialogComponent,
          blockoutdata, Actions.view);
      }
    })
  }


  // GetBlockouts() {
  //   this.blockouts.forEach(value => {
  //     value.start = new Date(this.datepipe.transform(value.StartAt, "MM/dd/yyyy HH:mm:ss"));
  //     value.end = this.getEndDate(value.Duration, value.start)
  //   })
  // }

  // getEndDate(duration: number, date: Date): Date {
  //   let returnDate: Date = new Date(date)
  //   switch (duration) {
  //     case 15:
  //       returnDate.setMinutes(returnDate.getMinutes() + 15)
  //       break;
  //     case 30:
  //       returnDate.setMinutes(returnDate.getMinutes() + 30)
  //       break;
  //     case 45:
  //       returnDate.setMinutes(returnDate.getMinutes() + 45)
  //       break;
  //     case 60:
  //       returnDate.setHours(returnDate.getHours() + 1)
  //       break;
  //     case 75:
  //       returnDate.setHours(returnDate.getHours() + 1)
  //       returnDate.setMinutes(returnDate.getMinutes() + 15)
  //       break;
  //     case 90:
  //       returnDate.setHours(returnDate.getHours() + 1)
  //       returnDate.setMinutes(returnDate.getMinutes() + 30)
  //       break;
  //     case 105:
  //       returnDate.setHours(returnDate.getHours() + 1)
  //       returnDate.setMinutes(returnDate.getMinutes() + 45)
  //       break;
  //     case 120:
  //       returnDate.setHours(returnDate.getHours() + 2)
  //       break;
  //     case 135:
  //       returnDate.setHours(returnDate.getHours() + 2)
  //       returnDate.setMinutes(returnDate.getMinutes() + 15)
  //       break;
  //     case 150:
  //       returnDate.setHours(returnDate.getHours() + 2)
  //       returnDate.setMinutes(returnDate.getMinutes() + 30)
  //       break;
  //     case 165:
  //       returnDate.setHours(returnDate.getHours() + 2)
  //       returnDate.setMinutes(returnDate.getMinutes() + 45)
  //       break;
  //     case 180:
  //       returnDate.setHours(returnDate.getHours() + 3)
  //       break;
  //     case 1440:
  //       returnDate.setDate(returnDate.getDate() + 1)
  //       break;
  //   }
  //   returnDate.setSeconds(returnDate.getSeconds() - 1);
  //   return returnDate;
  // }
}

/**{ Text: '15 min', Value: 15 },
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
 */
/** extendedProps: Identity<Dictionary>;
    start: Identity<DateInput>;
    end: Identity<DateInput>;
    date: Identity<DateInput>;
    allDay: BooleanConstructor;
    id: StringConstructor;
    groupId: StringConstructor;
    title: StringConstructor;
    url: StringConstructor;
    interactive: BooleanConstructor; */
