import { MedicalCode } from 'src/app/_models/codes';
import { ProceduresInfo } from 'src/app/_models';
import { DentalChartService } from 'src/app/_services/dentalchart.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';
import { BehaviorSubject } from 'rxjs';
import { reflectNameOfDeclaration } from '@angular/compiler-cli/src/ngtsc/reflection';

declare var $: any;
@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {
  hoverStartDate:string='Start Date';
  hoverEndDate:string='End Date';
  AdultPrem: boolean = true;
  ChilPrim: boolean = false;
  displayStyle = "none";
  DentalNumber: number;
  procedureCodeList: any = [];
  currentPatient: ProviderPatient
  procedureDialogComponent = ProcedureDialogComponent;
  ActionTypes = Actions
  usedProcedures: MedicalCode;
  procedureColumns: string[] = ['SELECT', 'START DATE', 'END DATE', 'TOOTH', 'SURFACE', 'CODE', 'DESCRIPTION', 'PROVIDER', 'STATUS', 'CQM STATUS','Encounter'];

  patientProceduresView = new BehaviorSubject<ProceduresInfo[]> ([]);

  constructor(private overlayService: OverlayService,
    private dentalService: DentalChartService,
    private authService: AuthenticationService) {
      this.currentPatient = authService.viewModel.Patient;
    }

  ngOnInit(): void {
    this.patientUsedProcedures();
    this.patientProcedureView();
    console.log(this.patientProceduresView);
    console.log(this.currentPatient);


  }

  patientUsedProcedures(){
    this.dentalService.PatientUsedProcedures({"PatientId" : this.currentPatient.PatientId })
      .subscribe(resp =>
        {
          if(resp.IsSuccess){
            this.usedProcedures = resp.ListResult;
          }
        })
  }
  patientProcedureView(){
    this.dentalService.PatientProcedureView({"PatientId" : this.currentPatient.PatientId })
      .subscribe(resp =>
        {
          if(resp.IsSuccess){
            this.patientProceduresView.next(resp.ListResult as ProceduresInfo[]);
          }
        })
  }
  AdultPerm() {
    this.AdultPrem = true;
    this.ChilPrim = false;
  }

  ChildPrim() {
    this.AdultPrem = false;
    this.ChilPrim = true;
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.new,ToothNo: number=0,medicalCode: MedicalCode) {
      let reqData: ProceduresInfo
      if(content == this.procedureDialogComponent){
        reqData = new ProceduresInfo();
        reqData.PatientId = this.currentPatient.PatientId;
        reqData.ProviderId = this.currentPatient.ProviderId;
        reqData.LocationId = this.authService.userValue.CurrentLocation;

        if(ToothNo>0){
          reqData.ToothNo = ToothNo ;
          reqData.ViewFrom = "ToothNo";

        }
        if(medicalCode){
          reqData.Code = medicalCode.Code
          reqData.CodeSystem = medicalCode.CodeSystem
          reqData.Description = medicalCode.Description;
          reqData.ViewFrom = "Tree";
        }
      }

    const ref = this.overlayService.open(content, reqData);

    ref.afterClosed$.subscribe(res => {
      if (content === this.procedureDialogComponent) {
        if (res.data != null && res.data.saved) {
          this.patientProcedureView();
        }
      }
    });
  }
}
