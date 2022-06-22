import { CQMNotPerformedService } from './../../../_services/cqmnotperforemed.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AddeditinterventionComponent } from './../../../dialogs/addeditintervention/addeditintervention.component';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { CQMNotPerformed } from 'src/app/_models/_provider/cqmnotperformed';
import { Actions, User, ViewModel } from 'src/app/_models';

@Component({
  selector: 'app-cqmsnotperformed',
  templateUrl: './cqms.not.performed.component.html',
  styleUrls: ['./cqms.not.performed.component.scss']
})
export class CqmsNotPerformedComponent implements OnInit {

  CQMNotPreformedDataSource: any = [];
  CQMNotPreformedColumn: string[] = ['Date', 'Provider', 'NotPerformed', 'Code', 'CodeDescription', 'Reason',
  'ReasonCode', 'ReasonDescription','Notes'];
  CQMNotPerformedDialogComponent = AddeditinterventionComponent;
  PatientDetails: any = [];
  DialogResponse = null;
  CQMNotPerformed: CQMNotPerformed;
  user:User;

  constructor(private overlayService: OverlayService,private authService:AuthenticationService,
    private cqmNotperformedService: CQMNotPerformedService) {
      this.user = authService.userValue;
      console.log(this.user);
      this.CQMNotPerformed= {} as CQMNotPerformed;
  }

  ngOnInit(): void {
    this.PatientDetails = this.authService.viewModel.Patient;
    this.getCQMNotPerformed();
  }

  getCQMNotPerformed(){
    debugger;
    var reqparam = {
      "PatientId": this.PatientDetails.PatientId,
      "ProviderId": this.PatientDetails.ProviderId
    }
    this.cqmNotperformedService.CQMNotPerformed(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.CQMNotPreformedDataSource = resp.ListResult;
      }
    });
  }

  openCQMComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);
    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.CQMNotPerformedDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }
}




