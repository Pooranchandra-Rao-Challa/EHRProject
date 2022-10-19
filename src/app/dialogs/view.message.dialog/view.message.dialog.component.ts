import { Component, OnInit } from '@angular/core';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { Messages } from 'src/app/_models/_provider/messages';

@Component({
  selector: 'app-view.message.dialog',
  templateUrl: './view.message.dialog.component.html',
  styleUrls: ['./view.message.dialog.component.scss']
})
export class ViewMessageDialogComponent implements OnInit {
  viewMessages:Messages = {} as Messages;

  constructor(private ref: EHROverlayRef,) {
    this.updateLocalModel(ref.RequestData);
  }

  ngOnInit(): void {
  }

  cancel(){
    this.ref.close(null);
  }

  updateLocalModel(data: Messages) {
    this.viewMessages = {};
    if (data == null) return;
    this.viewMessages = data as Messages;
  }

}
