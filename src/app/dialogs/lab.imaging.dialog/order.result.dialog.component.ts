import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
import { ImagingResultDialogComponent } from './imaging.result.dialog.component';
import { EditLabImagingOrderComponent } from './order.edit.lab.imaging.component';
import { OrderManualEntryDialogComponent } from './order.manual.entry.dialog.component';

@Component({
  selector: 'app-orderresultdialogue',
  templateUrl: './order.result.dialog.component.html',
  styleUrls: ['./order.result.dialog.component.scss']
})
export class OrderResultDialogComponent implements OnInit {
  ActionTypes = Actions;
  editLabImagingOrderComponent = EditLabImagingOrderComponent;
  orderManualEntryDialogComponent = OrderManualEntryDialogComponent;
  imagingResultDialogComponent = ImagingResultDialogComponent;
  labandImaging?: LabProcedureWithOrder = new LabProcedureWithOrder();
  constructor(private ref: EHROverlayRef,
    public overlayService: OverlayService,) {

    this.labandImaging = ref.RequestData as LabProcedureWithOrder;
    this.labandImaging.ProcedureType = this.labandImaging.View;
    this.labandImaging.OrderingFacility = this.labandImaging.View;


  }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.editLabImagingOrderComponent) {
      reqdata = dialogData;
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

  onNoOrderEnterManually(){
    if(this.labandImaging.View == "Lab")
    {
      this.openComponentDialog(this.orderManualEntryDialogComponent, null, this.ActionTypes.add)

    }else if(this.labandImaging.View == "Imaging"){
      this.openComponentDialog(this.imagingResultDialogComponent, null, this.ActionTypes.add)
    }

  }


}
