import { patientService } from './../../_services/patient.service';
import { Component, OnInit, TemplateRef, QueryList, ViewChildren } from '@angular/core';
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
  filteredPatients: any;
  searchName: any;
  patientDialogComponent = PatientDialogComponent;
  dialogResponse = null;
  user: User;

  constructor(public overlayService: OverlayService,
    private patientService: patientService,
    private authService: AuthenticationService,
    private router: Router) {
    this.user = authService.userValue;
  }

  ngOnInit(): void {
    this.getPatientsByProvider();
  }

  ngAfterViewInit(): void {
    this.patientsDataSource.sort = this.sort.toArray()[0];
  }

  onChangeViewState(view) {
    debugger;
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
      this.patientsDataSource.data = resp.ListResult;
    });
  }

  showInactive(event) {
    this.patientsDataSource.data = [];
  }

  toggleSelect(event) {
    if (event.checked == true) {
      this.patientsDataSource.data = [];
    }
    else {
      this.ngOnInit();
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

  filtered() {
    this.filteredPatients = this.patientsDataSource.data.filter(a => a.FirstName === this.searchName);
    this.patientsDataSource = this.filteredPatients;
  }
}
