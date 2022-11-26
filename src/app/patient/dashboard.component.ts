import { ERROR_CODES } from './../_alerts/alertMessage';
import { NewmessageDialogComponent } from './../dialogs/newmessage.dialog/newmessage.dialog.component';
import { PatientappointmentDialogComponent } from 'src/app/dialogs/patientappointment.dialog/patientappointment.dialog.component';
import { Component, TemplateRef } from '@angular/core';
import { OverlayService } from '../overlay.service';
import { Actions, GeneralSchedule, User, UserLocations, ViewModel } from '../_models';
import { AuthenticationService } from '../_services/authentication.service';
import { ComponentType } from '@angular/cdk/portal';
import { PatientService } from '../_services/patient.service';
import { Appointments } from '../_models/_patient/appointments';
import { Router } from '@angular/router';
import { MessageDialogInfo, Messages } from '../_models/_provider/messages';
import { MessagesService } from '../_services/messages.service';
import { SettingsService } from '../_services/settings.service';
import { AlertMessage } from '../_alerts/alertMessage';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isHealth: boolean = false;
  isAccees: boolean = false;
  ActionTypes = Actions;
  displayNew = "none";
  user: User;
  locationsInfo: UserLocations[];
  PatientDialogComponent = PatientappointmentDialogComponent;
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse = null;
  PatientUpcomingAppointmentsList: Appointments;
  PatientUpcomingAppointmentsCount: number = 0;
  viewModel: ViewModel;
  messages: Messages;
  messagescount: number = 0;
  currentMessageView: string = 'Inbox';
  viewAppoinments: Appointments = {} as Appointments;
  viewMessages: Messages = {} as Messages;
  generalSchedule: GeneralSchedule = {} as GeneralSchedule;

  constructor(private authenticationService: AuthenticationService, private overlayService: OverlayService,
    private patientservice: PatientService, private router: Router,
    private messageService: MessagesService,private settingsService: SettingsService,
    private alertmsg: AlertMessage) {
    this.user = authenticationService.userValue;
    this.locationsInfo = JSON.parse(this.user.LocationInfo)
    this.viewModel = authenticationService.viewModel;
  }

  ngOnInit(): void {
    this.getPatientUpcomingAppointments();
    this.getmessages();
    this.GeneralScheduleInfo();
    $(document).ready(function () {
      $('ul.navbar-nav > li')
        .click(function (e) {
          $('ul.navbar-nav > li')
            .removeClass('active');
          $(this).addClass('active');
        });
    });
  }

  onChangeViewState(view) {
    this.authenticationService.SetViewParam("SubView", view);
    this.viewModel = this.authenticationService.viewModel;
    this.router.navigate(
      ['/patient/dashboard'],
    );
  }

  onhealth() {
    this.isAccees = false;
    this.isHealth = true;
  }

  onAccess() {
    this.isHealth = false;
    this.isAccees = true;
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {


    if(!this.generalSchedule.PatientRescedule){
      this.alertmsg.displayMessageDailog(ERROR_CODES["M3D001"]);
    }else{
      const ref = this.overlayService.open(content, null);
      ref.afterClosed$.subscribe(res => {
        if (typeof content === 'string') {
          //} else if (content === this.yesNoComponent) {
          //this.yesNoComponentResponse = res.data;
        }
        else if (content === this.PatientDialogComponent) {
          this.DialogResponse = res.data;
          this.getPatientUpcomingAppointments();
        }
      });

    }

  }


  openComponentDialogmessage(content: any | ComponentType<any> | string, data,
    action: Actions = this.ActionTypes.add, message: string) {
    let DialogResponse: MessageDialogInfo = {};
    if (action == Actions.view && content === this.MessageDialogComponent) {
      DialogResponse.MessageFor = message
      DialogResponse.Messages = data;
      DialogResponse.Messages.toAddress = {}
      DialogResponse.Messages.toAddress.Name = (data as Messages).PatientName
      DialogResponse.Messages.toAddress.UserId = (data as Messages).ToId
      DialogResponse.ForwardReplyMessage = message;
    }
    else if (action == Actions.add && content === this.MessageDialogComponent) {
      DialogResponse.MessageFor = message;
      DialogResponse.Messages = null;
      DialogResponse.ForwardReplyMessage = null;
    }
    const ref = this.overlayService.open(content, DialogResponse);
    ref.afterClosed$.subscribe(res => {
    });

  }

  getPatientUpcomingAppointments() {
    var req = {
      "PatientId": this.user.PatientId,
      // "PatientId":"62385146391cba10c7c20539"
    }
    this.patientservice.PatientUpcomingAppointments(req).subscribe(res => {
      this.PatientUpcomingAppointmentsList = res.ListResult == null ? [] : res.ListResult;
      this.PatientUpcomingAppointmentsCount = res.ListResult?.length;
    })
  }

  GeneralScheduleInfo() {
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


  getmessages() {
    var req = {
      // "PatientId": "5836dafef2e48f36ba90a996",
      "UserId": this.user.UserId,
      "PageIndex": 0,
      "PageSize": 10,
      "SortField": "Created",
      "SortDirection": "desc",
      "Filter": "",
      "MessageFilter": "Inbox"
    }
    this.messageService.Messages(req).subscribe(res => {
      this.messages = res.ListResult == null ? [] : res.ListResult;
      this.messagescount = res.ListResult == null ? 0 : res.ListResult[0].MessagesCount;
    });
  }

  showappoinments(item) {
    this.viewAppoinments = item;
  }

  showMessages(messages) {
    this.viewMessages = messages;
  }
}
