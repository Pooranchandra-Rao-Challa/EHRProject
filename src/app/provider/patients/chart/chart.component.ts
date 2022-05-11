import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  advancedDirectivesDialogComponent = AdvancedDirectivesDialogComponent;
  smokingStatusDialogComponent = SmokingStatusDialogComponent;
  interventionDialogComponent = InterventionDialogComponent;
  dialogResponse = null;

  constructor(public overlayService: OverlayService) { }

  ngOnInit(): void {
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    //debugger;
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {

      }
      else if (content === this.advancedDirectivesDialogComponent) {
        this.dialogResponse = res.data;
      }
      else if (content === this.smokingStatusDialogComponent) {
        this.dialogResponse = res.data;
      }
      else if (content === this.interventionDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }

}
