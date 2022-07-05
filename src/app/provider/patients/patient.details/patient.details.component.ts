import { SmartSchedulerService } from 'src/app/_services/smart.scheduler.service';
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { BehaviorSubject, of } from 'rxjs';
import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Actions, PatientPortalUser, ProceduresInfo, ViewModel } from "src/app/_models"
import { catchError, finalize } from 'rxjs/operators';
import { PatientAccountInfo, PatientBreadcurm, ProviderPatient }
  from 'src/app/_models/_provider/Providerpatient';
import { PatientService } from 'src/app/_services/patient.service';
import { Router } from '@angular/router';
import { OverlayService } from 'src/app/overlay.service';
import { PatientPortalAccountComponent } from '../../../dialogs/patient.dialog/patient.portal.account.dialog.component';
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component';
import { ComponentType } from '@angular/cdk/portal';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { EncounterDialogComponent } from 'src/app/dialogs/encounter.dialog/encounter.dialog.component';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';

@Component({
  selector: 'app-patient.details',
  templateUrl: './patient.details.component.html',
  styleUrls: ['./patient.details.component.scss']
})
export class PatientDetailsComponent implements OnInit, AfterViewInit {
  patient: ProviderPatient;
  patientUser: PatientPortalUser;
  viewModel: ViewModel;
  chartSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  changedChartView$ = this.chartSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  @ViewChild('chartview', { read: ViewContainerRef, static: true })
  private chartviewcontainerref: ViewContainerRef;

  @ViewChild('patientbreadcrumb', { read: ViewContainerRef, static: true })
  private patientbreadcrumb: ViewContainerRef;
  breadcrumbs: PatientBreadcurm[] = [];
  removedPatientIdsInBreadcurmb: string[]
  patientAccountInfo: PatientAccountInfo = new PatientAccountInfo();
  patientPortalAccountComponent = PatientPortalAccountComponent;
  patientHealthPortalComponent = PatientHealthPortalComponent;
  encounterDialogComponent = EncounterDialogComponent;
  procedureDialogComponent = ProcedureDialogComponent;
  procedureInfo: ProceduresInfo = new ProceduresInfo();
  ActionTypes = Actions;


  constructor(private authService: AuthenticationService,
    private cfr: ComponentFactoryResolver,
    private patientService: PatientService,
    private router: Router,
    private overlayService: OverlayService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage) {
    this.viewModel = authService.viewModel;
    if (this.viewModel.PatientView == null
      || this.viewModel.PatientView == '') {
      this.viewModel.PatientView = 'Chart';
    }
    this.patient = this.authService.viewModel.Patient;
    this.removedPatientIdsInBreadcurmb = authService.viewModel.PatientBreadCrumb
  }
  ngAfterViewInit(): void {
    this.chartSubject.next(this.viewModel.PatientView);
  }


  ngOnInit(): void {
    this.changedChartView$
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe((viewname) => {
        this.loadingSubject.next(true);
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
      });

    this.loadBreadcurmData();
    this.loadPatientAccountInfo();
    this.getUserInfoForPatient();
    this.updateProcedureInfo();

  }

  updateProcedureInfo() {
    this.procedureInfo.PatientId = this.patient.PatientId;
  }

  loadPatientAccountInfo() {
    this.patientService.PatientAccountInfo({
      PatientId: this.patient.PatientId
    }).subscribe(resp => {
      if (resp.IsSuccess)
        this.patientAccountInfo = resp.Result;
      else
        this.patientAccountInfo = new PatientAccountInfo();
    });
  }
  UpdatePatientView(patientView: string) {
    this.loadingSubject.next(true);
    this.authService.SetViewParam("PatientView", patientView);
    this.viewModel = this.authService.viewModel;
    this.chartSubject.next(patientView);

  }

  async loadChartComponent() {
    if (this.viewModel.PatientView != 'Chart')
      this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { ChartComponent } = await import('../chart/chart.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ChartComponent)
      );
    }
  }

  async loadDentalChartComponent() {
    if (this.viewModel.PatientView != 'Dental Chart')
    this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { DentalChartComponent } = await import('../dental.chart/dental.chart.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(DentalChartComponent)
      );
    }
  }

  async loadProfileComponent() {
    if (this.viewModel.PatientView != 'Profile')
    this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { ProfileComponent } = await import('../profile/profile.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ProfileComponent)
      );
    }
  }

  async loadInsuranceComponent() {
    if (this.viewModel.PatientView != 'Insurance')
    this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { InsuranceComponent } = await import('../insurance/insurance.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(InsuranceComponent)
      );
    }
  }

  async loadAmendmentsComponent() {
    if (this.viewModel.PatientView != 'Amendments')
    this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { AmendmentsComponent } = await import('../amendments/amendments.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(AmendmentsComponent)
      );
    }
  }

  async loadPatientsComponent() {
    if (this.viewModel.PatientView != 'Patients')
    this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { ResetPasswordComponent } = await import('../resetpassword/resetpassword.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ResetPasswordComponent)
      );
    }
  }
  async loadCQMsNotPerformedComponent() {
    if (this.viewModel.PatientView != 'CQMs Not Performed') this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { CqmsNotPerformedComponent } = await import('../cqms.not.performed/cqms.not.performed.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(CqmsNotPerformedComponent)
      );
    }
  }


  async loadPatientBreadcrumbView() {
    this.patientbreadcrumb.clear();
    const { BreadcrumbComponent } = await import('../patient.breadcrumb/breadcrumb.component');
    let viewcomp = this.patientbreadcrumb.createComponent(
      this.cfr.resolveComponentFactory(BreadcrumbComponent)
    );
    viewcomp.instance.breadcrumbs = this.breadcrumbs;
    viewcomp.instance.navigateTo.subscribe((pbc: PatientBreadcurm) => {
      if (pbc.ViewType == 1) this._detailsView(pbc.Details);
      else if (pbc.ViewType == 0) this._listView();
    });
    viewcomp.instance.removePatientInBreadcrumb.subscribe(($event) => {
      this.removePatientBreadcrumbInView($event);
    });
  }

  loadBreadcurmData() {
    this.patientService.LatestUpdatedPatientsUrl({
      ProviderId: this.authService.userValue.ProviderId,
      RemovedPatientIds: this.removedPatientIdsInBreadcurmb
    })
      .subscribe(resp => {
       // console.log(resp);

        if (resp.IsSuccess) {
          let patients = resp.ListResult as ProviderPatient[];
        //  console.log(patients);
          this.breadcrumbs = [];
          let pb: PatientBreadcurm = {
            Name: "Patients",
            ViewType: 0,
            ProviderId: this.authService.userValue.ProviderId
          }
          this.breadcrumbs.push(pb);
          patients.forEach((p) => {
            let pb: PatientBreadcurm = {
              Name: p.FirstName + ' ' + p.LastName,
              DOB: p.Dob,
              ViewType: 1,
              PatientId: p.PatientId,
              ShowRemoveIcon: true,
              Details: p
            }
            this.breadcrumbs.push(pb);
          });
          this.loadPatientBreadcrumbView()
        }
      })
  }

  updateBreadcurmbModel() {

  }

  removePatientBreadcrumbInView(patientId: string) {
    if (this.removedPatientIdsInBreadcurmb == null)
      this.removedPatientIdsInBreadcurmb = [];
    this.removedPatientIdsInBreadcurmb.push(patientId);
    this.authService.SetViewParam('PatientBreadCrumb', this.removedPatientIdsInBreadcurmb);
    this.loadBreadcurmData();
  }

  _detailsView(patientview) {
    this.authService.SetViewParam("Patient", patientview);
    this.authService.SetViewParam("PatientView", "Chart");
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  _listView() {
    this.router.navigate(["provider/patients"]);
  }

  getUserInfoForPatient() {
    this.patientUser = new PatientPortalUser();
    this.patientUser.Email = this.patient.Email;
    this.patientUser.DateofBirth = new Date(this.patient.Dob);
    this.patientUser.PatientId = this.patient.PatientId;


    this.utilityService.GetUserInfoForPatient(this.patientUser).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientUser = resp.Result as PatientPortalUser;
      }
    })
  }

  _completePatientAccountProcess(req: PatientPortalUser){
    console.log(req);
    this.utilityService.CompletePatientAccountProcess(req).subscribe(resp => {
      if (resp.IsSuccess) {
        //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
        this.loadPatientAccountInfo();
      } else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      }
    });
  }


  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.patientPortalAccountComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.patientHealthPortalComponent && action == Actions.view) {
      dialogData = data;
    } else if (action == Actions.new && content === this.encounterDialogComponent) {
      dialogData = this.patient;
    }
    const ref = this.overlayService.open(content, dialogData);

    ref.afterClosed$.subscribe(res => {
      if (content === this.patientPortalAccountComponent) {

        if (res.data != null) {
          this.utilityService.CreatePatientAccount(res.data).subscribe(resp => {
            if (resp.IsSuccess) {
              this.openComponentDialog(this.patientHealthPortalComponent,
                res.data, Actions.view);
            } else {
              this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
            }
          });
        }
      } else if (content === this.patientHealthPortalComponent) {
        if (ref.data !== null) {
          this._completePatientAccountProcess(res.data.patientUser)
          if (ref.data.download) {

            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP002"])

          } else if (ref.data.sendemail) {
            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP003"])
          }
        }
      }
    });
  }
}
