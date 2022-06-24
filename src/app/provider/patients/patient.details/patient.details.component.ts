import { BehaviorSubject, of } from 'rxjs';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
//import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ViewModel } from "src/app/_models"
import { catchError, finalize } from 'rxjs/operators';
@Component({
  selector: 'app-patient.details',
  templateUrl: './patient.details.component.html',
  styleUrls: ['./patient.details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patient: any;
  viewModel: ViewModel;
  chartSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Chart')
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  changedChartView$ = this.chartSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  @ViewChild('chartview', { read: ViewContainerRef, static: true })
  private chartviewcontainerref: ViewContainerRef;
  viewFunctions: {} = {
    'Chart': 'this.loadChartComponent',
    'Dental Chart': 'this.loadDentalChartComponent',
    'Profile': 'this.loadProfileComponent',
    'Insurance': 'this.loadInsuranceComponent',
    'Amendments': 'this.loadAmendmentsComponent',
    'Patients': 'this.loadPatientsComponent',
    'CQMs Not Performed': 'this.loadCQMsNotPerformedComponent'
  }

  constructor(private authService: AuthenticationService,
    private cfr: ComponentFactoryResolver) {
    this.viewModel = authService.viewModel;
    this.patient = this.authService.viewModel.Patient;
  }

  ngOnInit(): void {
    this.changedChartView$
    .pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
  ).subscribe((viewname) => {
      if (viewname == 'Chart')
        this.loadChartComponent();
      else if (viewname == 'Dental Chart')
        this.loadDentalChartComponent();
      else if (viewname == 'Profile')
        this.loadProfileComponent();
      else if (viewname == 'Insurance')
        this.loadInsuranceComponent();
      else if (viewname == 'Amendments')
        this.loadAmendmentsComponent();
      else if (viewname == 'Patients')
        this.loadPatientsComponent();
      else if (viewname == 'CQMs Not Performed')
        this.loadCQMsNotPerformedComponent();
        this.loadingSubject.next(false)
    })
  }

  UpdatePatientView(patientView: string) {
    this.loadingSubject.next(true);
    this.authService.SetViewParam("PatientView", patientView);
    this.viewModel = this.authService.viewModel;
    this.chartSubject.next(patientView);

  }

  async loadChartComponent() {
    this.chartviewcontainerref.clear();
    const { ChartComponent } = await import('../chart/chart.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(ChartComponent)
    );
  }

  async loadDentalChartComponent() {
    this.chartviewcontainerref.clear();
    const { DentalChartComponent } = await import('../dental.chart/dental.chart.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(DentalChartComponent)
    );
  }

  async loadProfileComponent() {
    this.chartviewcontainerref.clear();
    const { ProfileComponent } = await import('../profile/profile.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(ProfileComponent)
    );
  }

  async loadInsuranceComponent() {
    this.chartviewcontainerref.clear();
    const { InsuranceComponent } = await import('../insurance/insurance.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(InsuranceComponent)
    );
  }

  async loadAmendmentsComponent() {
    this.chartviewcontainerref.clear();
    const { AmendmentsComponent } = await import('../amendments/amendments.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(AmendmentsComponent)
    );
  }

  async loadPatientsComponent() {
    this.chartviewcontainerref.clear();
    const { ResetPasswordComponent } = await import('../resetpassword/resetpassword.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(ResetPasswordComponent)
    );
  }
  async loadCQMsNotPerformedComponent() {
    this.chartviewcontainerref.clear();
    const { CqmsNotPerformedComponent } = await import('../cqms.not.performed/cqms.not.performed.component');
    let viewcomp = this.chartviewcontainerref.createComponent(
      this.cfr.resolveComponentFactory(CqmsNotPerformedComponent)
    );
  }
}
