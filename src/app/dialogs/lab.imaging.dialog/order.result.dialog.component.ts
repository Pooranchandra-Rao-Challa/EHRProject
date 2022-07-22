import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, PatientSearch } from 'src/app/_models';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { ImagingResultDialogComponent } from './imaging.result.dialog.component';
import { LabOrderEditComponent } from './lab.order.edit.component';
import { OrderManualEntryDialogComponent } from './order.manual.entry.dialog.component';
import { PatientService } from 'src/app/_services/patient.service';

@Component({
  selector: 'app-orderresultdialogue',
  templateUrl: './order.result.dialog.component.html',
  styleUrls: ['./order.result.dialog.component.scss']
})
export class OrderResultDialogComponent implements OnInit {
  ActionTypes = Actions;
  labOrderEditComponent = LabOrderEditComponent;
  orderManualEntryDialogComponent = OrderManualEntryDialogComponent;
  imagingResultDialogComponent = ImagingResultDialogComponent;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  labImageOrders?: LabProcedureWithOrder[];
  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService,
    private labImageService: LabsImagingService) {
    this.labandImaging = ref.RequestData as LabProcedureWithOrder;
    this.labandImaging.ProcedureType = this.labandImaging.View;

  }

  ngOnInit(): void {
    let reqparams = {
      "ClinicId": this.labandImaging.ClinicId,
      "ProcedureType": this.labandImaging.ProcedureType,
    }
    this.labImageService.LabImageOrderNumberList(reqparams)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let lis = resp.ListResult as LabProcedureWithOrder[];
          lis.forEach(value =>{
            value.Tests = JSON.parse(value.StrTests)
          })
          this.labImageOrders = lis;
        }
      })
  }


  cancel() {
    this.ref.close(null);
  }
  OpenDialog(opt: LabProcedureWithOrder) {
    opt.View = opt.ProcedureType;
    this.labandImaging.PatientId = opt.PatientId;
    opt.CurrentPatient = new PatientSearch();
    if (opt.ProcedureType == "Lab") {
      this.openComponentDialog(this.labOrderEditComponent, opt, Actions.view)
    } else if (opt.ProcedureType == "Image") {
      this.openComponentDialog(this.imagingResultDialogComponent, opt, Actions.view)
    }
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.labOrderEditComponent) {
      reqdata = dialogData;
    }
    else  if (action == Actions.add && content === this.labOrderEditComponent) {

    }
    else if (action == Actions.view && content === this.orderManualEntryDialogComponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.imagingResultDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {


    });
  }

  onNoOrderEnterManually() {
    if (this.labandImaging.View == "Lab"){
      this.openComponentDialog(this.labOrderEditComponent, null, this.ActionTypes.add)
    }

    // if (this.labandImaging.View == "Lab") {
    //   this.openComponentDialog(this.orderManualEntryDialogComponent, null, this.ActionTypes.add)

    // } else if (this.labandImaging.View == "Imaging") {
    //   this.openComponentDialog(this.imagingResultDialogComponent, null, this.ActionTypes.add)
    // }

  }


}
