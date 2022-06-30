import { ProceduresInfo } from 'src/app/_models';
import { DentalChartService } from 'src/app/_services/dentalchart.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { OverlayService } from 'src/app/overlay.service';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { ProviderPatient } from 'src/app/_models/_provider/Providerpatient';

declare var $: any;
@Component({
  selector: 'app-dentalchart',
  templateUrl: './dental.chart.component.html',
  styleUrls: ['./dental.chart.component.scss']
})
export class DentalChartComponent implements OnInit {

  AdultPrem: boolean = true;
  ChilPrim: boolean = false;
  displayStyle = "none";
  DentalNumber: number;
  procedureCodeList: any = [];
  currentPatient: ProviderPatient
  procedureDialogComponent = ProcedureDialogComponent;
  ActionTypes = Actions

  constructor(private overlayService: OverlayService,
    private dentalService: DentalChartService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getProcedureList();
  }

  getProcedureList() {
    this.dentalService.ProcedureCodes().subscribe(resp => {
      if (resp.IsSuccess) {
        this.procedureCodeList = resp.ListResult;
        this.procedureCodeList.map((e) => {
          if (e.Category != '') {
            e.isClosed = true;
          }
        });
      }
    });
  }

  expandCollapse(obj) {
    //debugger
    obj.isClosed = !obj.isClosed;
    // let procedureList:any = [];
    // procedureList = obj.value;
    for (let index = 0; index < obj.value.length; obj++) {
      this.procedureCodeList[index].isClosed = !obj.isClosed;
    }
  }

  AdultPerm() {
    this.AdultPrem = true;
    this.ChilPrim = false;
  }

  ChildPrim() {
    this.AdultPrem = false;
    this.ChilPrim = true;
  }

  OpenDentalModal(number) {
    this.DentalNumber = number;
    this.displayStyle = "block";
  }

  CloseDentalModal() {
    this.displayStyle = "none";
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, actions: Actions = this.ActionTypes.new,ToothNo: number=0) {
      let reqData: ProceduresInfo;
      if(dialogData == null){
        reqData = new ProceduresInfo();
        if(ToothNo>0)
        reqData.ToothNo = ToothNo ;
        reqData.ViewFrom = "ToothNo";
      }


    const ref = this.overlayService.open(content, reqData);

    ref.afterClosed$.subscribe(res => {
      console.log(res.data);

      if (content === this.procedureDialogComponent) {
        if (res.data != null) {

        }
      }
    });
  }
}
