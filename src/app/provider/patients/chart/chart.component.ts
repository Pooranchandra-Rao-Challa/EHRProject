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
  advancedDirectives: any[];
  allDiagnoses: any[];
  allAllergies: any[];

  constructor(public overlayService: OverlayService,
    private patientService: patientService) { }

  ngOnInit(): void {
    // this.AdvancedDirectives();
    // this.AllDiagnoses();
    // this.AllAllergies();
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

  // Common Reqparams for chart screen
  // reqparams = {
  //   ClinicId: '5836d8f2f2e48f33037e5e39',
  //   ProviderId: '5836d7d1f2e48f310385069c',
  //   PatientId: '5836dafef2e48f36ba90a996'
  // }

  // Get advanced directives info
  // AdvancedDirectives() {
  //   this.patientService.AdvancedDirectives(this.reqparams).subscribe((resp) => {
  //     this.advancedDirectives = resp.ListResult;
  //     console.log(this.advancedDirectives);
  //   });
  // }

  // Get diagnoses info
  // AllDiagnoses() {
  //   let reqparams = {
  //     ClinicId: '59307584bc61173526a63361',
  //     ProviderId: '59307582bc61173526a63336',
  //     PatientId: '59841816bc61176759627700'
  //   }
  //   this.patientService.AllDiagnoses(reqparams).subscribe((resp) => {
  //     this.allDiagnoses = resp.ListResult;
  //     console.log(this.allDiagnoses);

  //   });
  // }

  // Get allergies info
  // AllAllergies() {
  //   let reqparams = {
  //     ClinicId: '5953c325bc611739aaf8c0e7',
  //     ProviderId: '5953c323bc611739aaf8c0bc',
  //     PatientId: '59dd3796bc6117730c9ca3d3'
  //   }
  //   this.patientService.AllAllergies(reqparams).subscribe((resp) => {
  //     this.allAllergies = resp.ListResult;
  //     console.log(this.allAllergies);

  //   });
  // }

}
