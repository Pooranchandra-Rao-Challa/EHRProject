import { EncounterInfo } from './../../_models/_provider/encounter';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ComponentType } from 'ngx-toastr';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';
import { OverlayService } from 'src/app/overlay.service';
import { Actions } from 'src/app/_models';
import { EncounterDialogComponent } from '../encounter.dialog/encounter.dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-encounter.table.dialog',
  templateUrl: './encounter.table.dialog.component.html',
  styleUrls: ['./encounter.table.dialog.component.scss']
})
export class EncounterTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public patientencounters = new MatTableDataSource<EncounterInfo>();
  encounterColumns: string[] = ['ServicedAt', 'VisitingReason'];
  ActionTypes = Actions;
  encounterDialogComponent = EncounterDialogComponent;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
      this.updateLocalModel(ref.RequestData);
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientencounters.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: EncounterInfo) {
    this.patientencounters.data = [];
    if (data == null) return;
    this.patientencounters.data = data as unknown as EncounterInfo[];
    console.log(this.patientencounters.data);

  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.encounterDialogComponent) {
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
