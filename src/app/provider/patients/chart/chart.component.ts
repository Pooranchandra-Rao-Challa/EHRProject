import { Component, OnInit, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../../overlay.service';
import { AdvancedDirectivesDialogComponent } from '../../../dialogs/advanced.directives.dialog/advanced.directives.dialog.component';
import { SmokingStatusDialogComponent } from 'src/app/dialogs/smoking.status.dialog/smoking.status.dialog.component';
import { InterventionDialogComponent } from 'src/app/dialogs/intervention.dialog/intervention.dialog.component';
import { patientService } from '../../../_services/patient.service';

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

  constructor(public overlayService: OverlayService,
    private patientService: patientService) { }

  ngOnInit(): void {
    this.AdvancedDirectives();
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

  advancedDirectives: any[];
  AdvancedDirectives() {
    let reqparams = {
      ProviderId: '5836d7d1f2e48f310385069c',
      ClinicId: '5836d8f2f2e48f33037e5e39',
      PatientId: '5836dafef2e48f36ba90a996'
    }
    this.patientService.AdvancedDirectives(reqparams).subscribe((resp) => {
      this.advancedDirectives = resp.ListResult;
      console.log(this.advancedDirectives);
    });
  }

}
