import { OverlayService } from './../../overlay.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Actions, PatientChart, ViewModel } from 'src/app/_models';
import { MessageDialogInfo, Messages } from 'src/app/_models/_provider/messages';
import { NewmessageDialogComponent } from '../newmessage.dialog/newmessage.dialog.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ViewMessageDialogComponent } from '../view.message.dialog/view.message.dialog.component';

@Component({
  selector: 'app-messages.table.dialog',
  templateUrl: './messages.table.dialog.component.html',
  styleUrls: ['./messages.table.dialog.component.scss']
})
export class MessagesTableDialogComponent implements OnInit {
  public patientMessages = new MatTableDataSource<Messages>();
  messagesColumns: string[] = ['Subject', 'Updated'];
  ActionTypes = Actions;
  newmessageDialogComponent = NewmessageDialogComponent;
  viewMessageDialogComponent = ViewMessageDialogComponent;
  viewModel: ViewModel;

  constructor(private ref: EHROverlayRef,
    private authService: AuthenticationService,
    private overlayService: OverlayService) {
    this.updateLocalModel(ref.RequestData);
    this.viewModel = authService.viewModel;
  }

  ngOnInit(): void {
  }

  updateLocalModel(data: Messages) {
    this.patientMessages.data = [];
    if (data == null) return;
    this.patientMessages.data = data as Messages[];
  }

  cancel() {
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.viewMessageDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
    });
  }

  openComponentDialogmessage(content: any | ComponentType<any> | string, dialogData,
    action: Actions = this.ActionTypes.add, message: string) {
    let DialogResponse: MessageDialogInfo = {};
    if (action == Actions.view && content === this.newmessageDialogComponent) {
      DialogResponse.MessageFor = message
      DialogResponse.Messages = {};
      DialogResponse.Messages.toAddress = {}
      DialogResponse.Messages.toAddress.Name = this.viewModel.Patient.FirstName + ' ' + this.viewModel.Patient.LastName;
      DialogResponse.Messages.toAddress.UserId = this.viewModel.Patient.UserId;
      DialogResponse.ForwardReplyMessage = message;
    }
    const ref = this.overlayService.open(content, DialogResponse, true);
    ref.afterClosed$.subscribe(res => {
      this.ref.close(null);
    });
  }
}
