import { Component, OnInit, TemplateRef, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { OverlayService } from '../../overlay.service';
import { PatientDialogComponent } from '../../dialogs/patient.dialog.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models';
import { PageEvent } from "@angular/material/paginator";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PatientsData } from 'src/app/_models/patients';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { SmartScheduleComponent } from '../smart.schedule/smart.schedule.component';
import { SmartSchedulerService } from '../../_services/smart.scheduler.service';
import { PracticeProviders } from '../../_models/_provider/practiceProviders';
import { patientService } from './../../_services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();
  patientColumns: string[] = ['Image', 'First', 'Middle', 'Last', 'DOB', 'Age', 'ContactInfo', 'LastAccessed', 'Created', 'Select'];
  // patientsDataSource: PatientsData[];
  public patientsDataSource = new MatTableDataSource<PatientsData>();
  public patientsList = new MatTableDataSource<PatientsData>();
  filteredPatients: any;
  searchName: any;
  patientDialogComponent = PatientDialogComponent;
  dialogResponse = null;
  user: User;
  pageSize = 10;
  page = 0;
  inactivePatients: any[] = [];
  PracticeProviders: PracticeProviders[];
  keys = 'FirstName,MobilePhone';
  value: any;
  @ViewChild('filter', { static: false }) filter: ElementRef;
  constructor(public overlayService: OverlayService,
    private patientService: patientService,
    private authService: AuthenticationService,
    private router: Router,
    private smartschedule: SmartScheduleComponent,
    private smartSchedulerService: SmartSchedulerService) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.loadPatientProviders();
    this.getPatientsByProvider();
  }

  ngAfterViewInit(): void {
    this.patientsDataSource.paginator = this.paginator.toArray()[0];
    this.patientsDataSource.sort = this.sort.toArray()[0];
  }

  loadPatientProviders() {
    let req = { "ClinicId": this.authService.userValue.ClinicId };
    this.smartSchedulerService.PracticeProviders(req).subscribe(resp => {
      if (resp.IsSuccess) {
        this.PracticeProviders = resp.ListResult as PracticeProviders[];
        console.log(this.PracticeProviders);
      }
    });
  }

  onChangeViewState(view) {
    //debugger;
    // this.router.navigate(
    //   ['/provider/patientdetails'],
    //   { queryParams: { name: "patient", view: view } }
    // );
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "name": "patient",
        "patient": JSON.stringify(view)
      }
    };
    this.router.navigate(["/provider/patientdetails"], navigationExtras);
  }

  getPatientsByProvider() {
    let reqparams = {
      "ClinicId": this.user.ClinicId,
      "ProviderId": this.user.ProviderId
    }
    this.patientService.PatientsByProvider(reqparams).subscribe((resp) => {
      this.patientsDataSource.data = resp.ListResult as PatientsData[];
      this.patientsList.data = this.patientsDataSource.data;
    });
  }

  showInactivePatients(event) {
    if (event.checked == true) {
      this.inactivePatients = this.patientsDataSource.data.filter(a => a.active === false);
      this.patientsList.data = this.inactivePatients;
    }
    else {
      this.patientsList.data = this.patientsDataSource.data;
    }
  }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
        //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.patientDialogComponent) {
        this.dialogResponse = res.data;
      }
    });
  }
}
