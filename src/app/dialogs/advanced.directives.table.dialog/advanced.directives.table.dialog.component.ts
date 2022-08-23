import { EHROverlayRef } from './../../ehr-overlay-ref';
import { Actions, AdvancedDirective } from './../../_models';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdvancedDirectivesDialogComponent } from '../advanced.directives.dialog/advanced.directives.dialog.component';
import { ComponentType } from 'ngx-toastr';
import { OverlayService } from 'src/app/overlay.service';

@Component({
  selector: 'app-advanced.directives.table.dialog',
  templateUrl: './advanced.directives.table.dialog.component.html',
  styleUrls: ['./advanced.directives.table.dialog.component.scss']
})
export class AdvancedDirectivesTableDialogComponent implements OnInit {
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  public patientAdvancedDirectives = new MatTableDataSource<AdvancedDirective>();
  advancedDirectiveColumns: string[] = ['RecordAt', 'Notes'];
  ActionTypes = Actions;
  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;

  constructor(private ref: EHROverlayRef,
    private overlayService: OverlayService) {
      this.updateLocalModel(ref.RequestData);
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.patientAdvancedDirectives.sort = this.sort.toArray()[0];
  }

  updateLocalModel(data: AdvancedDirective) {
    this.patientAdvancedDirectives.data = [];
    if (data == null) return;
    this.patientAdvancedDirectives.data = data as AdvancedDirective[];
  }

  cancel(){
    this.ref.close(null);
  }

  openComponentDialog(content: any | ComponentType<any> | string,
    dialogData, action: Actions = this.ActionTypes.add) {
    let reqdata: any;
    if (action == Actions.view && content === this.advancedDirectivesDialogComponent) {
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
