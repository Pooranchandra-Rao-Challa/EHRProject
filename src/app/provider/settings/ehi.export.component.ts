import { DownloadService } from './../../_services/download.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { NewAppointment, PatientSearchResults, User } from '../../_models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { HttpEventType } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import * as FileSaver from "file-saver";

@Component({
  selector: 'ehi-export',
  templateUrl: './ehi.export.component.html',
  styleUrls: ['./erx.component.scss']
})
export class EHIExportComponent implements OnInit {
  selectedPatient: PatientSearchResults;
  noSearchResults: boolean = false;
  @Output() RefreshParentView: EventEmitter<boolean> = new EventEmitter();
  private patientSearchTerms = new Subject<string>();
  private notfiyAllPatients = new Subject<boolean>();
  patients: PatientSearchResults[];
  AppointmentsOfPatient: NewAppointment[];
  patientNameOrCellNumber = '';
  @Input() SelectedProviderId: string;
  allPatients: boolean = false;
  downloadinginprogress: boolean = false;
  user: User;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'indeterminate';
  value = 40;
  bufferValue = 100;

  constructor(private authService: AuthenticationService,
    private smartSchedulerService: SmartSchedulerService,
    private downloadService: DownloadService) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.patientSearchTerms
      .pipe(
        map(value => {
          this.noSearchResults = false;
          this.patients = []
          return value;
        }),
        debounceTime(300),  // wait for 300ms pause in events
        distinctUntilChanged())   // ignore if next search term is same as previous
      .subscribe((term) => {
        if (term !== "") {
          this.smartSchedulerService
            .SearchPatientsWithAppointments({
              ProviderId: this.SelectedProviderId,
              ClinicId: this.authService.userValue.ClinicId,
              SearchTerm: term
            })
            .subscribe(resp => {
              if (resp.IsSuccess) {
                this.patients = resp.ListResult;
              } else {
                this.noSearchResults = true;
                this.patients = [];
              }

            })
        }
      }


      );

    this.notfiyAllPatients.subscribe(value => {
      if (value) {
        this.clearPatientSelection();
      }
    })
  }

  clearPatientSelection() {
    this.selectedPatient = null;
    this.patientNameOrCellNumber = null;
    this.patientSearchTerms.next("");
  }
  searchPatient(term: string): void {
    this.patientSearchTerms.next(term);
  }
  displayPatient(value: PatientSearchResults): string {
    if (!value) return "";
    return value.Name + "-" + value.MobilePhone;
  }

  onPatientSelected(value: any) {
    if (!value) return "";
    this.selectedPatient = value.option.value;
    if (this.selectedPatient) this.allPatients = false;
    this.patients = [];
    this.patientNameOrCellNumber = null;
  }

  ExportEHI() {
    //console.log(`Export all patients: ${this.allPatients}`);
    //console.log(`Export the patient: ${JSON.stringify(this.selectedPatient)}`);
    this.downloadinginprogress = true;
    let fileName = this.allPatients ? this.authService.userValue.ClinicId : this.selectedPatient.PatientId
    this.downloadService.DownloadPatientsCDA(this.allPatients?{ClinicId: this.authService.userValue.ClinicId}:{PatientId:this.selectedPatient.PatientId})
      .subscribe(
        (resp) => {
              if (resp.type === HttpEventType.DownloadProgress) {
                const percentDone = Math.round(100 * resp.loaded / resp.total);
                //console.log(percentDone);
                this.value = percentDone;
              }
              if (resp.type === HttpEventType.Response) {
                //console.log(resp.type );
                const file = new Blob([resp.body], { type: 'application/zip' });
                const document = window.URL.createObjectURL(file);
                FileSaver.saveAs(document, fileName+".zip");
              }

            },
            (error) => {
              this.downloadinginprogress = false;
            },
            () => {
              this.downloadinginprogress = false;
            }
      )
  }
  updateAllComplete() {
    this.notfiyAllPatients.next(this.allPatients);
  }
}
