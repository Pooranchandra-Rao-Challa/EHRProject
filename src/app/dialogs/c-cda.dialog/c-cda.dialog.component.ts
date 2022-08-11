import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { EHROverlayRef } from 'src/app/ehr-overlay-ref';

@Component({
  selector: 'app-c-cda.dialog',
  templateUrl: './c-cda.dialog.component.html',
  styleUrls: ['./c-cda.dialog.component.scss']
})
export class CCdaDialogComponent implements OnInit {
  @ViewChild('patientInformationToggle') private patientInformationToggle: MatCheckbox;
  @ViewChildren('patientInformationCheckboxes') private patientInformationCheckboxes: QueryList<any>;
  @ViewChild('encounterDetailsToggle') private encounterDetailsToggle: MatCheckbox;
  @ViewChildren('encounterDetailsCheckboxes') private encounterDetailsCheckboxes: QueryList<any>;
  @ViewChild('patientChartInformationToggle') private patientChartInformationToggle: MatCheckbox;
  @ViewChildren('PatientChartInformationCheckboxes') private PatientChartInformationCheckboxes: QueryList<any>;
  @ViewChild('TransitionofCareDatailsToggle') private TransitionofCareDatailsToggle: MatCheckbox;
  @ViewChildren('TransitionofCareDatailsCheckboxes') private TransitionofCareDatailsCheckboxes: QueryList<any>;

  toggleButtonVisibility: boolean = false;
  constructor(private ref: EHROverlayRef,) { }

  ngOnInit(): void {
  }

  
  cancel() {
    this.ref.close(null);
  }
  TogglePatients(event) {
    // this.removeAllEvents();
    if (event.source.checked) {
    
      this.patientInformationCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.patientInformationCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }
  ToggleEncounter(event) {
    // this.removeAllEvents();
    if (event.source.checked) {
    
      this.encounterDetailsCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.encounterDetailsCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }
  TogglePatientChartInfo(event) {
    // this.removeAllEvents();
    if (event.source.checked) {
    
      this.PatientChartInformationCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.PatientChartInformationCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }

 ToggleTransititionDetails(event) {
    // this.removeAllEvents();
    if (event.source.checked) {
    
      this.TransitionofCareDatailsCheckboxes.toArray().forEach(source => {
        source.checked = true;
      })
    } else {
      this.TransitionofCareDatailsCheckboxes.toArray().forEach(source => {
        source.checked = false;
      })
    }
  }
  enconterdetails:boolean =true;
  encouterdetails(){
this.enconterdetails = true;
  }
  transitiondetails()
  {
    this.enconterdetails = false;
  }


  patientInformation:any[] = [
  { value: 'Patient Information' },
  { value: 'Identification & Demographics'}]
  
  encounterDetails:any[]
=[{value: 'Basic Information'},
{value:'Reason for visit'},
{value:'Clinical Instructions'},
{value: 'Medication Administered'},
{value: 'Immunizations Administered'},
{value: 'Diagnostic Tests Pending'},
{value: 'Future Scheduled Tests'},
{value: 'Referrals to Other Providers'},
{value: 'Recommended Patient Decision Aids'}
]
patientChartInformation:any[] = [{value :'Smoking Status'},
{value : 'Problems (Dx)'},
{value : 'Medications (Rx)'},
{value : 'Medication Allergies'},
{value : 'Laboratory Tests & Results'},
{value : 'Vital Stats'},
{value : 'Care Plan - Goals & Instructions'},
{value : 'Procedures'},{value :'Care Team Members'}
]



TransitionofCareDatails:any[] =[{value:'Basic Information'},
{value:'Encounter Diagnosis'},
{value:'Immunizations'},
{value:'Cognitive Status'},
{value:'Functional Status'},
{value:'Reason for Referral'},
{value:'Discharge Instructions'}]


}














