import { Component, OnInit } from '@angular/core';
import { PracticeProviders } from 'src/app/_models/practiceProviders';
import { AppointmentTypes } from 'src/app/_models/smar.scheduler.data';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';

@Component({
  selector: 'app-encounter.dialog',
  templateUrl: './encounter.dialog.component.html',
  styleUrls: ['./encounter.dialog.component.scss']
})
export class EncounterDialogComponent implements OnInit {
  PracticeProviders: PracticeProviders[];
  SelectedProviderId: string;
  AppointmentTypes: AppointmentTypes[];
  encounterdiagnosesColumns = ["CODE", "CODE SYSTEM", "DESCRIPTION", "PATIENT EDUCATION", "Primary DX"];
  EncounterData = "";

  constructor(private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService) { }

  ngOnInit(): void {
    this.loadDefaults();
  }

  loadDefaults() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
      }
    });
    let preq = { "ProviderId": this.SelectedProviderId };
    this.smartSchedulerService.AppointmentTypes(preq).subscribe(resp => {
      if (resp.IsSuccess) {
        this.AppointmentTypes = resp.ListResult as AppointmentTypes[];
      }
    });
    // this.filterAppointments();
  }

}
