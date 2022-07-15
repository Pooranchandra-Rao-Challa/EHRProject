import { AuthenticationService } from './../../_services/authentication.service';
import { User } from './../../_models/_account/user';
import { LabsImagingService } from './../../_services/labsimaging.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { Actions } from 'src/app/_models';
import { OrderdialogueComponent } from 'src/app/dialogs/orderdialogue/orderdialogue.component';
import { OverlayService } from 'src/app/overlay.service';
import { OrderresultdialogueComponent } from 'src/app/dialogs/orderresultdialogue/orderresultdialogue.component';
import { EditlabimageorderComponent } from 'src/app/dialogs/editlabimageorder/editlabimageorder.component';
import { OdermanualentrydialogComponent } from 'src/app/dialogs/odermanualentrydialog/odermanualentrydialog.component';
import { ViewModel } from 'src/app/_models/';
import{Labandimaging} from 'src/app/_models/_provider/LabandImage';

declare var $: any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './labs.imaging.component.html',
  styleUrls: ['./labs.imaging.component.scss']
})
export class LabsImagingComponent implements OnInit {

  labImagingColumn: string[] = ['Order', 'Test', 'Type', 'Patient', 'Provider', 'Status', 'LabImagingStatus', 'Created'];
  labImagingDataSource: any = [];
  user: User;
  ActionTypes = Actions;
  viewmodel?:ViewModel;
  orderdialoguecomponent = OrderdialogueComponent;
  orderresultdialoguecomponent = OrderresultdialogueComponent;
  editlabimageordercomponent = EditlabimageorderComponent;
  ordermanualentrydialogcomponent = OdermanualentrydialogComponent;
  labandimaging?:Labandimaging =new Labandimaging() ;
  labing:boolean=false;
  constructor(private labimage: LabsImagingService, private authService: AuthenticationService,public overlayService: OverlayService,) {
    this.user = authService.userValue;
    this.viewmodel = authService.viewModel; 

    // console.log(this.user);
  }

  ngOnInit(): void {
    this.GetLabDetails();
  }

  GetLabDetails() {
    this.viewmodel.LabandImageView = "Lab";
    var reqparam = {
      "clinic_Id": this.user.CurrentLocation
    }
    // console.log(reqparam);
    //debugger;
    this.labimage.LabsDetails(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.labImagingDataSource = resp.ListResult;
      }
    });
    this.labing=true;
  }

  GetImagingDetails() {
    this.viewmodel.LabandImageView = "Image";
    var reqparam = {
      "clinic_Id": this.user.CurrentLocation
    }
    //debugger;
    this.labimage.ImageDetails(reqparam).subscribe(resp => {
      if (resp.IsSuccess) {
        this.labImagingDataSource = resp.ListResult;
      }
    });
    this.labing=true;
    
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
      debugger;
    let reqdata: any;
    if (action == Actions.add && content === this.orderdialoguecomponent) {
      this.labandimaging.View = this.viewmodel.LabandImageView;
      reqdata = this.labandimaging;
      console.log(reqdata);
    }
    else if (action == Actions.view && content === this.orderresultdialoguecomponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.editlabimageordercomponent) {
      reqdata = dialogData;
    }
    else if (action == Actions.view && content === this.ordermanualentrydialogcomponent) {
      reqdata = dialogData;
    }
    console.log(reqdata);
    
    const ref = this.overlayService.open(content, reqdata);
    ref.afterClosed$.subscribe(res => {

  
    });
  }
}
