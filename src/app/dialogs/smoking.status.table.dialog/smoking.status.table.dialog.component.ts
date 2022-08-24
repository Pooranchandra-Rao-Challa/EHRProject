import { EHROverlayRef } from './../../ehr-overlay-ref';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Actions, SmokingStatus } from 'src/app/_models';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';
import { SmokingStatusDialogComponent } from '../smoking.status.dialog/smoking.status.dialog.component';

@Component({
  selector: 'app-smoking.status.table.dialog',
  templateUrl: './smoking.status.table.dialog.component.html',
  styleUrls: ['./smoking.status.table.dialog.component.scss']
})
export class SmokingStatusTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public patientSmokingStatusList = new MatTableDataSource<SmokingStatus>();
  smokingStatusColumns: string[] = ['Status', 'EffectiveFrom'];
  ActionTypes = Actions;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
      this.updateLocalModel(ref.RequestData);
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientSmokingStatusList.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: SmokingStatus) {
    this.patientSmokingStatusList.data = [];
    if (data == null) return;
    this.patientSmokingStatusList.data = data as SmokingStatus[];
  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.smokingStatusDialogComponent) {
      reqdata = dialogData;
    }
    const ref = this.overlayService.open(content, reqdata, true);
    ref.afterClosed$.subscribe(res => {
      if(res.data != null){
        this.ref.close(res.data);
      }
    });
  }


}
