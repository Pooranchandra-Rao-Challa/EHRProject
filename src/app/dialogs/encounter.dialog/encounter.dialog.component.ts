
import { Component, OnInit } from '@angular/core';
import { PracticeProviders } from 'src/app/_models/_provider/practiceProviders';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { EHROverlayRef } from '../../ehr-overlay-ref';
import {
  PatientSearchResults, Actions,
  ScheduledAppointment, AppointmentTypes, NewAppointment,
  UserLocations, Room, AvailableTimeSlot,AppointmentDialogInfo
} from 'src/app/_models/_provider/smart.scheduler.data';
import {
  MU2Info,EncounterInfo,EncounterDiagnosis
} from 'src/app/_models/_provider/encounter';
import {
  MedicalCode
} from 'src/app/_models/codes';
import { MatRadioButton } from '@angular/material/radio';
import { Observable ,of,BehaviorSubject} from 'rxjs'

@Component({
  selector: 'app-encounter.dialog',
  templateUrl: './encounter.dialog.component.html',
  styleUrls: ['./encounter.dialog.component.scss']
})
export class EncounterDialogComponent implements OnInit {
  PracticeProviders: PracticeProviders[];
  SelectedProviderId: string;
  AppointmentTypes: AppointmentTypes[];
  encounterdiagnosesColumns1 = [
    {header:"CODE",element:"Code"},
    {header:"CODE SYSTEM",element:"CodeSystem"},
    {header: "DESCRIPTION",element:"Description"},
    {header: "PATIENT EDUCATION",element:"PatientEdn"},
    {header: "Primary DX",element:"PrimaryDx"},
    {header: "",element:"CanDelete"}];
    encounterdiagnosesColumns = [
      "CODE",
     "CODE SYSTEM",
      "DESCRIPTION",
      "PATIENT EDUCATION",
     "Primary DX",
      "Delete"];
  EncounterData = "";
  appointment: ScheduledAppointment
  location: UserLocations;
  encounterInfo: EncounterInfo = new EncounterInfo;
  diagnosesInfo = new BehaviorSubject<EncounterDiagnosis[]>([]); //= of(this.encounterInfo.Diagnoses)
  codeSystemsForDiagnosis: string[] = ['SNOMED/ICD10'];
  codeSystemsForReconcillation: string[] = ['SNOMED'];
  codeSystemsForDocumentation: string[] = ['CPT'];
  codeSystemsForProcedures: string[] = ['CDT/CPT','HCPCS'];

  constructor(private overlayref: EHROverlayRef,private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService) {
      this.diagnosesInfo.next(this.encounterInfo.Diagnoses);

      this.appointment = overlayref.RequestData as ScheduledAppointment
      this.location = (JSON.parse(this.authService.userValue.LocationInfo) as UserLocations[])
        .filter((loc) => loc.locationId === this.authService.userValue.CurrentLocation )[0];
     }

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

  }
  documentationChanged(value){
    this.encounterInfo.mu2.CurrentMedicationDocumented = (value as MatRadioButton).value
    if(this.encounterInfo.mu2.CurrentMedicationDocumented == 2){
      this.encounterInfo.mu2.DocumentedCode = "";
      this.encounterInfo.mu2.DocumentedDescription ="";
    }else{
      this.encounterInfo.mu2.DocumentedCode = "99213";
      this.encounterInfo.mu2.DocumentedDescription ="Office or Other Outpatient Visit";
    }
  }


  optionChangedForReconcillation(value){}

  optionChangedForDiagnosis(value: MedicalCode )
  {
    let d: EncounterDiagnosis = new EncounterDiagnosis;
    d.Code  = value.Code
    d.CodeSystem = value.CodeSystem
    d.Description = value.Description
    d.CanDelete = true;
    this.encounterInfo.Diagnoses.push(d);
    this.diagnosesInfo.next(this.encounterInfo.Diagnoses);
  }

  onProceduresRecommended(){

  }

  onProceduresCompleted(){

  }
  onDocumentedReasonChange(value){
    this.encounterInfo.mu2.DocumentedCode = value.Code;
    this.encounterInfo.mu2.DocumentedDescription = value.Description;
  }
}
