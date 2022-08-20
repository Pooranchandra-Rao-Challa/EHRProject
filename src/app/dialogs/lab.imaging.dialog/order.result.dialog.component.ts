import { LabsImagingService } from 'src/app/_services/labsimaging.service';
import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions, PatientSearch } from 'src/app/_models';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { ImagingResultDialogComponent } from './imaging.result.dialog.component';
import { LabResultComponent } from './lab.result.component';
import { OrderDialogComponent } from './order.dialog.component'

@Component({
  selector: 'app-orderresultdialogue',
  templateUrl: './order.result.dialog.component.html',
  styleUrls: ['./order.result.dialog.component.scss']
})
export class OrderResultDialogComponent implements OnInit {
  ActionTypes = Actions;
  labResultComponent = LabResultComponent;
  imagingResultDialogComponent = ImagingResultDialogComponent;
  orderDialogComponent = OrderDialogComponent;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  labImageOrders?: LabProcedureWithOrder[];


  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService,
    private labImageService: LabsImagingService) {
    this.labandImaging = ref.RequestData as LabProcedureWithOrder;


  }

  ngOnInit(): void {
    let reqparams = {
      "ClinicId": this.labandImaging.ClinicId,
      "ProcedureType": this.labandImaging.ProcedureType,
      "PatientId": this.labandImaging.CurrentPatient.PatientId,
    }
    this.labImageService.LabImageOrderWithResultsList(reqparams)
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let lis = resp.ListResult as LabProcedureWithOrder[];
          lis.forEach(value => {
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
    opt.View = this.labandImaging.ProcedureType;
    opt.ProcedureType = this.labandImaging.ProcedureType;
    opt.CurrentPatient = this.labandImaging.CurrentPatient;
    opt.ViewFor = this.labandImaging.ViewFor;
    if (this.labandImaging.ViewFor == "Order") {
      this.openComponentDialog(this.orderDialogComponent, opt, Actions.view)
    } else if (this.labandImaging.ProcedureType == "Lab" &&
      this.labandImaging.ViewFor == "Result") {
      this.openComponentDialog(this.labResultComponent, opt, Actions.view)
    } else if (this.labandImaging.ProcedureType == "Image" &&
      this.labandImaging.ViewFor == "Result") {
      this.openComponentDialog(this.imagingResultDialogComponent, opt, Actions.view)
    }
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    const ref = this.overlayService.open(content, dialogData,true);
    ref.afterClosed$.subscribe(res => {


    });
  }

  onNoOrderEnterManually() {
    if ((this.labandImaging.ProcedureType == "Lab" &&
      this.labandImaging.ViewFor == "Order") || (
        this.labandImaging.ProcedureType == "Image" &&
        this.labandImaging.ViewFor == "Order"
      )) {
      this.openComponentDialog(this.orderDialogComponent, this.labandImaging, this.ActionTypes.add);
    }
  }


}
