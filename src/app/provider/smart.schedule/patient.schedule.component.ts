import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Subject } from "rxjs";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { SmartSchedulerService } from "src/app/_services/smart.scheduler.service";
import { Actions, AppointmentDialogInfo, AppointmentTypes, NewAppointment, PatientSearchResults, PracticeProviders, Room, ScheduledAppointment, UserLocations } from 'src/app/_models';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { NewAppointmentDialogComponent } from '../../dialogs/newappointment.dialog/newappointment.dialog.component';
import { UpcomingAppointmentsDialogComponent } from '../../dialogs/upcoming.appointments.dialog/upcoming.appointments.dialog.component';
//import { CompleteAppointmentDialogComponent } from 'src/app/dialogs/newappointment.dialog/complete.appointment.component';
import { PatientDialogComponent } from 'src/app/dialogs/patient.dialog/patient.dialog.component';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage'
import { Router } from '@angular/router';
import { ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';


@Component({
  selector: 'patient-schedule',
  templateUrl: './patient.schedule.component.html',
  styleUrls: ['./smart.schedule.component.scss']
})
export class PatientScheduleComponent implements OnInit{

  patientDialogComponent = PatientDialogComponent;
  appointmentDialogComponent = NewAppointmentDialogComponent;
  upcomingAppointmentsDialogComponent = UpcomingAppointmentsDialogComponent;
  //completeAppointmentDialogComponent = CompleteAppointmentDialogComponent;



  @Input() SelectedProviderId: string;
  @Input() SelectedLocationId: string
  @Input() SwitchUrl:string;
  @Input() PracticeProviders: PracticeProviders[];
  @Input() AppointmentTypes: AppointmentTypes[];
  @Input() Locations: UserLocations[];
  @Input() Rooms: Room[];
  @Input() PatientAppointment: NewAppointment;

  selectedPatient: PatientSearchResults;
  //@Output() PatientSelected:EventEmitter<PatientSearchResults>= new EventEmitter();
  //@Output() OpenNewPatient:EventEmitter<boolean> = new EventEmitter();
  @Output() RefreshParentView:EventEmitter<boolean> = new EventEmitter();
  private patientSearchTerms = new Subject<string>();
  public patients: PatientSearchResults[];
  AppointmentsOfPatient: NewAppointment[];
  public patientNameOrCellNumber = '';

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private alertMessage: AlertMessage,
    private overlayService: OverlayService,
    private router: Router,
    private viewChangeService: ViewChangeService
    // private locationSelectService: LocationSelectService,
    // private alertMessage: AlertMessage,

) {}





  ngOnInit(): void {
    this.patientSearchTerms
    .pipe(debounceTime(300),  // wait for 300ms pause in events
      distinctUntilChanged())   // ignore if next search term is same as previous
    .subscribe((term) =>
      this.smartSchedulerService
        .SearchPatients({
          ProviderId: this.SelectedProviderId,
          ClinicId: this.authService.userValue.ClinicId,
          SearchTerm: term
        })
        .subscribe(resp => {
          if (resp.IsSuccess) {
            this.patients = resp.ListResult;
          }

        })
    );
  }

  searchPatient(term: string): void {
    this.patientSearchTerms.next(term);
  }

  displayPatient(value: PatientSearchResults): string {
    if (!value) return "";
    return ""
    return value.Name + "-" + value.MobilePhone;
  }

  onPatientSelected(value: any) {

    //this.PatientSelected.emit(value);
    if (!value) return "";
    let patient = value.option.value;

    this.patients =[];
    if(patient.NumberOfAppointments == 0){
      this.openComponentDialog( this.appointmentDialogComponent ,patient,this.PatinetActions(patient));
    }else{
      this.openComponentDialog( this.upcomingAppointmentsDialogComponent ,patient,this.PatinetActions(patient));
    }

    // return patient.Name + "-" + patient.MobilePhone;
  }

  PatinetActions(patient: PatientSearchResults) {
    if (patient.NumberOfAppointments == 0) return Actions.new;
    else return Actions.upcomming;
  }
  PatientAppointmentInfo(appointment: NewAppointment, action?: Actions) {
    let data = {} as AppointmentDialogInfo;
    this.PatientAppointment = {} as NewAppointment;
    this.PatientAppointment.PatientId = appointment.PatientId;
    this.PatientAppointment.PatientName = appointment.PatientName;
    this.PatientAppointment.LocationId = appointment.LocationId;
    this.PatientAppointment.ProviderId = appointment.ProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    data.Title =  "Edit Appointment";
    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = appointment.ProviderId;
    data.LocationId = appointment.LocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;
    data.PatientAppointment.AppointmentId = appointment.AppointmentId
    data.PatientAppointment.Startat = appointment.Startat
    data.PatientAppointment.AppointmentStatusId = appointment.AppointmentStatusId;
    data.PatientAppointment.AppointmentTypeId = appointment.AppointmentTypeId;
    data.PatientAppointment.RoomId = appointment.RoomId;
    data.PatientAppointment.Notes = appointment.Notes;
    data.status = action;
    data.NavigationFrom = "Smart Schedule"
    return data;
  }


  PatientAppointments(PatientObj,data) {
    let req = {
      "PatientId": PatientObj.PatientId
    };

    this.smartSchedulerService.ActiveAppointments(req).subscribe(resp => {
      if (resp.IsSuccess) {
        data.AppointmentsOfPatient = resp.ListResult as ScheduledAppointment[];
        //return this.AppointmentsOfPatient;
      }
    });
  }

  PatientAppointmentInfoFromSearch(PatientObj: PatientSearchResults, action?: Actions) {
    let data = {} as AppointmentDialogInfo
    this.PatientAppointment = {} as NewAppointment;

    this.selectedPatient = PatientObj as PatientSearchResults;
    if (this.selectedPatient.NumberOfAppointments == 0) {
      data.Title = "Add New Appointment";
      data.status = action;
    } else {
      this.PatientAppointments(PatientObj,data)
      data.Title = "Edit Appointment";
      //data.AppointmentsOfPatient = this.AppointmentsOfPatient;
      data.status = action
    }

    this.PatientAppointment.PatientId = this.selectedPatient.PatientId;
    this.PatientAppointment.PatientName = this.selectedPatient.Name;
    this.PatientAppointment.LocationId = this.SelectedLocationId;
    this.PatientAppointment.ProviderId = this.SelectedProviderId;
    this.PatientAppointment.ClinicId = this.authService.userValue.ClinicId;
    this.PatientAppointment.Duration = 30;
    data.NavigationFrom = "Smart Schedule"


    data.ClinicId = this.authService.userValue.ClinicId;
    data.ProviderId = this.SelectedProviderId;
    data.LocationId = this.SelectedLocationId;
    data.PatientAppointment = this.PatientAppointment;
    data.AppointmentTypes = this.AppointmentTypes;
    data.PracticeProviders = this.PracticeProviders;
    data.Locations = this.Locations;
    data.Rooms = this.Rooms;

    return data;
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions, status: string = "") {

    //this.flag = false;
    //this.patientNameOrCellNumber = "";

    let dialogData: any;
    if (content === this.appointmentDialogComponent && action == Actions.new) {
      dialogData = this.PatientAppointmentInfoFromSearch(data, action);
    } else if (content === this.appointmentDialogComponent && action == Actions.view) {
      dialogData = this.PatientAppointmentInfo(data, action);
    } else if (content === this.upcomingAppointmentsDialogComponent) {
      dialogData = this.PatientAppointmentInfoFromSearch(data, action);
    }

    // else if (content === this.completeAppointmentDialogComponent) {
    //   let d = data as ScheduledAppointment;
    //   d.StatusToUpdate = status;
    //   dialogData = d;
    // }

    const ref = this.overlayService.open(content, dialogData);

    ref.afterClosed$.subscribe(res => {


      if (content === this.patientDialogComponent) {

      }
      else if (content === this.appointmentDialogComponent) {



        //this.flag = false;
        //this.patientNameOrCellNumber = "";
        if (res.data && res.data.refresh) {
          //this.filterAppointments();
          this.RefreshParentView.emit(true);
        }
      }
      else if (content === this.upcomingAppointmentsDialogComponent) {
        //this.flag = false;
        //this.patientNameOrCellNumber = "";


        if (res.data && res.data.saved) {
          //this.filterAppointments();
          this.RefreshParentView.emit(true);
        }
      }
      // else if (content == this.completeAppointmentDialogComponent) {
      //   if (res.data != null && res.data.confirmed) {
      //     this.updateAppointmentStatus(res.data.appointment, res.data.AppComponent.StatusToUpdate);
      //   }
      // }
    });

  }

  SwitchView(){
    if(this.SwitchUrl == '/provider/calendar'){
      this.authService.SetViewParam("View", "Calender");
      this.viewChangeService.sendData("Calender");
      this.router.navigate([this.SwitchUrl]);
    }else{
      this.authService.SetViewParam("View", "Smart Schedule");
      this.viewChangeService.sendData("Smart Schedule");
      this.router.navigate([this.SwitchUrl]);
    }

  }
  // updateAppointmentStatus(appointment: ScheduledAppointment, status: string) {
  //   if (appointment.Status != status) {
  //     appointment.StatusToUpdate = status;
  //     this.smartSchedulerService.UpdateAppointmentStatus(appointment).subscribe(resp => {
  //       if (resp.IsSuccess) {
  //         //this.filterAppointments();
  //         this.RefreshParentView.emit(true);
  //         if (resp.IsSuccess && resp.Result != 'Error01') {
  //           this.alertMessage.displayMessageDailog(ERROR_CODES["M2JSAT004"]);
  //         } else {
  //           this.alertMessage.displayErrorDailog(ERROR_CODES["E2JSAT002"]);
  //         }
  //       }
  //       else {
  //         this.alertMessage.displayErrorDailog(ERROR_CODES["E2JSAT003"]);
  //       }
  //     });
  //   }

  // }
}