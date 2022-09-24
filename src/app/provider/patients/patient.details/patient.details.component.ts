
import { UtilityService } from 'src/app/_services/utiltiy.service';
import { BehaviorSubject, of } from 'rxjs';
import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Actions, EncounterInfo, PatientPortalUser, ProceduresInfo, ViewModel } from "src/app/_models"
import { catchError, finalize } from 'rxjs/operators';
import { PatientAccountInfo, PatientBreadcurm, ProviderPatient }
  from 'src/app/_models/_provider/Providerpatient';
import { PatientService } from 'src/app/_services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayService } from 'src/app/overlay.service';
import { PatientPortalAccountComponent } from '../../../dialogs/patient.dialog/patient.portal.account.dialog.component';
import { PatientHealthPortalComponent } from 'src/app/dialogs/patient.dialog/patient.health.portal.component';
import { ComponentType } from '@angular/cdk/portal';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { EncounterDialogComponent } from 'src/app/dialogs/encounter.dialog/encounter.dialog.component';
import { ProcedureDialogComponent } from 'src/app/dialogs/procedure.dialog/procedure.dialog.component';
import { LabProcedureWithOrder } from 'src/app/_models/_provider/LabandImage';
// import { OrderDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.dialog.component'
// import { LabResultComponent } from 'src/app/dialogs/lab.imaging.dialog/lab.result.component'
import { OrderResultDialogComponent } from 'src/app/dialogs/lab.imaging.dialog/order.result.dialog.component'
import { PatientUpdateService, ViewChangeService } from 'src/app/_navigations/provider.layout/view.notification.service';
import { CCdaDialogComponent } from 'src/app/dialogs/c-cda.dialog/c-cda.dialog.component';
import { AuthorizedrepresentativeDialogComponent } from 'src/app/dialogs/authorizedrepresentative.dialog/authorizedrepresentative.dialog.component';


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
  procedureInfo: ProceduresInfo = new ProceduresInfo();
  ActionTypes = Actions;
  patientPortalAccountComponent = PatientPortalAccountComponent;
  patientHealthPortalComponent = PatientHealthPortalComponent;
  encounterDialogComponent = EncounterDialogComponent;
  procedureDialogComponent = ProcedureDialogComponent;
  orderResultDialogComponent = OrderResultDialogComponent;
  cCdaDialogComponent = CCdaDialogComponent;
  authorizedRepresentativeDialogComponent = AuthorizedrepresentativeDialogComponent



  constructor(private authService: AuthenticationService,
    private cfr: ComponentFactoryResolver,
    private patientService: PatientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private overlayService: OverlayService,
    private utilityService: UtilityService,
    private alertmsg: AlertMessage,
    private viewChangeService: ViewChangeService,
    private patientUpdateNotifier: PatientUpdateService) {
    this.viewModel = authService.viewModel;



    if (this.viewModel.PatientView == null
      || this.viewModel.PatientView == '') {
      this.viewModel.PatientView = 'Chart';
    }

    this.removedPatientIdsInBreadcurmb = authService.viewModel.PatientBreadCrumb;

  }
  ngAfterViewInit(): void {
    this.chartSubject.next(this.viewModel.PatientView);
  }



  ngOnInit(): void {
    this.loadBreadcurmData();
    this.patientUpdateNotifier.getData().subscribe(patientUpdatedData => {
      this.patient.Dob = patientUpdatedData.DateOfBirth
      this.patient.Age = Number(patientUpdatedData.Age);
      this.patient.FirstName = patientUpdatedData.FirstName;
      this.patient.LastName = patientUpdatedData.LastName;
      this.patient.Gender = patientUpdatedData.Sex;
    })
    this.viewChangeService.getData().subscribe(changedView => {
      this.viewModel = this.authService.viewModel;
      this.chartSubject.next(changedView)
    }
    );
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



  }

  loadDependents() {
    this.loadPatientAccountInfo();
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
  //#region Tab Components
  async loadChartComponent() {
    if (this.viewModel.PatientView != 'Chart')
      this.chartviewcontainerref.clear();
    else {
      this.chartviewcontainerref.clear();
      const { ChartComponent } = await import('../chart/chart.component');
      let viewcomp = this.chartviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ChartComponent)
      );
      viewcomp.changeDetectorRef.detectChanges();
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

//#endregion

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
    let paramkey = this.activatedRoute.snapshot.queryParams.paramkey;
    if (paramkey == null) {
      this.patient = this.authService.viewModel.Patient;
      this.loadDependents();
    }

    this.patientService.LatestUpdatedPatientsUrl({
      ProviderId: this.authService.userValue.ProviderId,
      RemovedPatientIds: this.removedPatientIdsInBreadcurmb,
      EncKey: paramkey
    })
      .subscribe(resp => {
        if (resp.IsSuccess) {
          let patients = resp.ListResult as ProviderPatient[];
          this.breadcrumbs = [];
          let pb: PatientBreadcurm = {
            Name: "Patients",
            ViewType: 0,
            ActiveId: false,
            ProviderId: this.authService.userValue.ProviderId
          }
          this.breadcrumbs.push(pb);
          let flag = false;
          patients.forEach((p) => {
            let pb: PatientBreadcurm = {
              Name: p.FirstName + ' ' + p.LastName,
              DOB: p.Dob,
              ViewType: 1,
              PatientId: p.PatientId,
              ShowRemoveIcon: true,
              EncKey: p.EncKey,
              ActiveId: p.ShowDetailView == false ? this.patient?.PatientId == p.PatientId : p.ShowDetailView,
              Details: p
            }
            if (p.ShowDetailView) {
              this.authService.SetViewParam('Patient', p);
              this.viewModel = this.authService.viewModel;
              flag = true;
            }
            this.breadcrumbs.push(pb);
          });

          this.patient = this.authService.viewModel.Patient;
          this.loadPatientBreadcrumbView();
          this.loadDependents();
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
    //this.viewChangeService.sendData("Patients");
    console.log(
      this.authService.viewModel);
    this.authService.SetViewParam("Patient", patientview);
    this.authService.SetViewParam("PatientView", "Chart");
    this.authService.SetViewParam("View", "Patients");
    const currentUrl = this.router.url;
    this.router.navigateByUrl(currentUrl, { skipLocationChange: true }).then(() => {
      this.router.navigate(["/provider/patientdetails"]);
    });
    //this.router.navigate(["/provider/patientdetails"]);
  }

  _listView() {
    this.viewChangeService.sendData("Patients");
    this.authService.SetViewParam("View", "Patients")
    this.router.navigate(["provider/patients"]);
  }

  InvitePatient(content: TemplateRef<any> | ComponentType<any> | string,action?: Actions) {
    this.patientUser = new PatientPortalUser();
    this.patientUser.Email = this.patient.Email;
    this.patientUser.DateofBirth = new Date(this.patient.Dob);
    this.patientUser.PatientId = this.patient.PatientId;
    this.utilityService.GetUserInfoForPatient(this.patientUser).subscribe(resp => {
      if (resp.IsSuccess) {
        this.patientUser = resp.Result as PatientPortalUser;
        this.openComponentDialog(content,this.patientUser,action)
      }
    })
  }

  _completePatientAccountProcess(req: PatientPortalUser) {
    this.utilityService.CompletePatientAccountProcess(req).subscribe(resp => {
      if (resp.IsSuccess) {
        //this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
        this.loadPatientAccountInfo();
      } else {
        this.alertmsg.displayErrorDailog(ERROR_CODES["E2AP002"])
      }
    });
  }

  openLabDialogs(procedureType: string, viewfor: string) {
    let labOrImage: LabProcedureWithOrder = {};
    labOrImage.ProcedureType = procedureType;
    labOrImage.View = procedureType;
    labOrImage.ViewFor = viewfor;
    labOrImage.PatientId = this.patient.PatientId;
    labOrImage.CurrentPatient = {};
    labOrImage.CurrentPatient.PatientId = this.patient.PatientId;
    labOrImage.CurrentPatient.DateofBirth = new Date(this.patient.Dob);
    labOrImage.CurrentPatient.Name = this.patient?.FirstName + ' ' + this.patient?.LastName
    labOrImage.CurrentPatient.PrimaryPhone = this.patient?.PrimaryPhone
    labOrImage.CurrentPatient.Age = this.patient?.Age;
    labOrImage.CurrentPatient.Gender = this.patient?.Gender;
    labOrImage.CurrentPatient.MobilePhone = this.patient?.MobilePhone;
    labOrImage.ClinicId = this.authService.userValue.ClinicId;

    this.openComponentDialog(this.orderResultDialogComponent, labOrImage, Actions.view)

  }

  // InvitePatient(){

  // }

  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string,
    data?: any, action?: Actions) {
    let dialogData: any;
    if (content === this.patientPortalAccountComponent && action == Actions.view) {
      dialogData = data;
    } else if (content === this.patientHealthPortalComponent && action == Actions.view) {
      dialogData = data;
    } else if (action == Actions.new && content === this.encounterDialogComponent) {
      let ef = new EncounterInfo();
      if (dialogData == null) {
        ef.PatientId = this.authService.viewModel.Patient.PatientId;
        ef.PatientName = this.authService.viewModel.Patient.FirstName + " " + this.authService.viewModel.Patient.LastName;
      }
      dialogData = ef
    } else if (action == Actions.view && content === this.orderResultDialogComponent) {
      dialogData = data;
    }
    else if (action == Actions.view && content === this.cCdaDialogComponent) {
      dialogData = data;
    }
    else if (action == Actions.view && content === this.authorizedRepresentativeDialogComponent) {
      dialogData = data
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
        if (res.data !== null) {
          this._completePatientAccountProcess(res.data.patientUser)
          if (res.data.download) {

            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP002"])

          } else if (res.data.sendemail) {
            //'straight' update to database which recied from ref.data
            // Update Patient with invivation_sent_at, straight_invitation to database
            this.alertmsg.displayMessageDailog(ERROR_CODES["M2AP003"])
          }
        }
      } else if (content === this.encounterDialogComponent) {
        if (res.data != null && res.data.refreshView) {
          if (this.viewModel.PatientView == "Dental Chart")
            this.loadDentalChartComponent();
          else if (this.viewModel.PatientView == "Chart")
            this.loadChartComponent();
        }


      }
      else if (content === this.procedureDialogComponent) {
        this.loadDentalChartComponent();
      }
    });
  }
}
