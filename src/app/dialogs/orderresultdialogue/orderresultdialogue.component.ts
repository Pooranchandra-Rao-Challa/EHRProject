import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';
import { AddimagingresultdialogComponent } from '../addimagingresultdialog/addimagingresultdialog.component';
import { EditlabimageorderComponent } from '../editlabimageorder/editlabimageorder.component';
import { OdermanualentrydialogComponent } from '../odermanualentrydialog/odermanualentrydialog.component';

@Component({
  selector: 'app-orderresultdialogue',
  templateUrl: './orderresultdialogue.component.html',
  styleUrls: ['./orderresultdialogue.component.scss']
})
export class OrderresultdialogueComponent implements OnInit {
  ActionTypes = Actions;
  editlabimageordercomponent=EditlabimageorderComponent;
  ordermanualentrydialogcomponent=OdermanualentrydialogComponent;
  addimagingresultdialogcomponent=AddimagingresultdialogComponent
  constructor(private ref: EHROverlayRef,public overlayService: OverlayService,) { }

  ngOnInit(): void {
  }
  cancel() {
    this.ref.close(null);
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
      debugger;
    let reqdata: any;
    if (action == Actions.view && content === this.editlabimageordercomponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.ordermanualentrydialogcomponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.addimagingresultdialogcomponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {

  
    });
  }
}
