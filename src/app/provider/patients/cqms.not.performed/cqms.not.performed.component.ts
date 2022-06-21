import { CQMNotPerformedService } from './../../../_services/cqmnotperforemed.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AddeditinterventionComponent } from './../../../dialogs/addeditintervention/addeditintervention.component';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { CQMNotPerformed } from 'src/app/_models/_provider/cqmnotperformed';

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

  constructor(private overlayService: OverlayService,private authService:AuthenticationService,
    private cqmNotperformedService: CQMNotPerformedService) { }

  ngOnInit(): void {
    this.PatientDetails = this.authService.viewModel.Patient;
    this.getCQMNotPerformed();
  }

  getCQMNotPerformed(){
    debugger;
    var reqparam = {
      "PatientId": '588ba54ec1a4c002ab2b38f3'
    }
    this.cqmNotperformedService.CQMNotPerformed(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.CQMNotPreformedDataSource = resp.ListResult;
        console.log(this.CQMNotPreformedDataSource);
      }
    });
  }

  AddeditinterventionDialog(content: TemplateRef<any> | ComponentType<any> | string) {
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




