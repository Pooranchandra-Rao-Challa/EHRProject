import { Component } from '@angular/core';
import { OverlayService } from '../../overlay.service';
import {  TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NewmessageDialogComponent } from '../../dialogs/newmessage.dialog/newmessage.dialog.component';
declare var $: any;
@Component({
  selector: 'app-labs.imaging',
  templateUrl: './directmsg.component.html',
  styleUrls: ['./directmsg.component.scss']
})
export class DirectMsgComponent  {

  displayReq = "none";
  MessageDialogComponent = NewmessageDialogComponent;
  DialogResponse = null;


  constructor(private overlayService :OverlayService) { }

  ngOnInit(): void {
    $('#openBtn').click(function(){
      $('#myModal').modal({show:true});
    })
  }
  openComponentDialogmessage(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.MessageDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }
}
