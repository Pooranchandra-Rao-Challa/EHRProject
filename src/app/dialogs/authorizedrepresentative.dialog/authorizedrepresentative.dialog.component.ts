import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';
import { AddauthorizedrepresentativeDialogComponent } from '../addauthorizedrepresentative.dialog/addauthorizedrepresentative.dialog.component';

@Component({
  selector: 'app-authorizedrepresentative.dialog',
  templateUrl: './authorizedrepresentative.dialog.component.html',
  styleUrls: ['./authorizedrepresentative.dialog.component.scss']
})
export class AuthorizedrepresentativeDialogComponent implements OnInit {
  ActionTypes = Actions;
  addauthorizedRepresentativeDialogComponent = AddauthorizedrepresentativeDialogComponent
  constructor(private ref:EHROverlayRef, public overlayService: OverlayService,) { }

  ngOnInit(): void {
  }
  cancel() {
    
      this.ref.close(null);
    
}
openComponentDialog(content: any | ComponentType<any> | string,
  dialogData, action: Actions = this.ActionTypes.add) {
  let reqdata: any;
  if (action == Actions.view && content === this.addauthorizedRepresentativeDialogComponent) {
    reqdata = dialogData;
  }
  
  const ref = this.overlayService.open(content, reqdata);
  ref.afterClosed$.subscribe(res => {
  
   
  });
  
}
}