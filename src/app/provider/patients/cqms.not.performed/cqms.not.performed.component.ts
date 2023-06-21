import { CQMNotPerformedService } from './../../../_services/cqmnotperforemed.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AddeditinterventionComponent } from './../../../dialogs/addeditintervention/addeditintervention.component';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { CQMNotPerformed } from 'src/app/_models/_provider/cqmnotperformed';
import { Actions, User } from 'src/app/_models';
@Component({
  selector: 'app-cqmsnotperformed',
  templateUrl: './cqms.not.performed.component.html',
  styleUrls: ['./cqms.not.performed.component.scss']
})

export class CqmsNotPerformedComponent implements OnInit {
  user: User;
  CQMNotPreformedDataSource: any = [];
  CQMNotPreformedColumn: string[] = ['Date', 'Provider', 'NotPerformed', 'Code', 'CodeDescription', 'Reason','ReasonCode', 'ReasonDescription', 'Notes'];
  CQMNotPerformedDialogComponent = AddeditinterventionComponent;
  PatientDetails: any = [];
  DialogResponse = null;
  CQMNotPerformed: CQMNotPerformed;
  ActionTypes = Actions;
  CQMNotPerformedResponse: any;

  constructor(private overlayService: OverlayService, private authService: AuthenticationService,
    private cqmNotperformedService: CQMNotPerformedService) {
    this.user = authService.userValue;
    this.CQMNotPerformed = {} as CQMNotPerformed;
  }

  ngOnInit(): void {
    this.PatientDetails = this.authService.viewModel.Patient;
    this.getCQMNotPerformed();
  }

  getCQMNotPerformed() {
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId,
      "ProviderId": this.PatientDetails.ProviderId
    }
    this.cqmNotperformedService.CQMNotPerformed(reqparam).subscribe(resp => {
      console.log(resp);

      if (resp.IsSuccess) {
        this.CQMNotPreformedDataSource = resp.ListResult;
      }
    });
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.add) {
    this.CQMNotPerformed.Reasondetails = this.CQMNotPerformed.ReasonCodeDescription;
    let reqdata: any;
    if (actions == Actions.view && content === this.CQMNotPerformedDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {
      if (content === this.CQMNotPerformedDialogComponent) {
        this.CQMNotPerformedResponse = res.data;
      }
      else if (res.data == null) {
        reqdata = dialogData;
      }
     // this.UpdateView(res.data);
      this.getCQMNotPerformed();
    });
  }

  // UpdateView(data) {
  //   if (data.UpdatedModal == PatientChart.CQMNotPerforemd) {
  //     this.getCQMNotPerformed();
  //   }
  // }
}



