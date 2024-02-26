import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '../../_services/authentication.service';
import { User, ViewModel } from '../../_models';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'menu-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  user: User;
  locationsubscription: Subscription;
  view: string;
  viewModel: ViewModel;
  @ViewChild('settingsview', { read: ViewContainerRef, static: true })
  private settingsviewcontainerref: ViewContainerRef;
  settingsSubject: BehaviorSubject<string> = new BehaviorSubject<string>('')
  loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  changedSettingView$ = this.settingsSubject.asObservable();

  constructor(
    private cfr: ComponentFactoryResolver,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) {
    this.user = this.authService.userValue;
    this.viewModel = authService.viewModel;
    if (!this.viewModel.SubView)
      this.viewModel.SubView = 'practice';
  }

  ngAfterViewInit(): void {
    this.settingsSubject.next(this.viewModel.SubView);
  }

  ngOnInit(): void {
    this.changedSettingView$
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      ).subscribe((viewname) => {
        this.loadingSubject.next(true);
        //console.log(viewname);

        if (viewname == 'practice')
          this.loadPracticeComponent();
        else if (viewname == 'schedule')
          this.loadScheduleComponent();
        else if (viewname == 'erx')
          this.loadErxComponent();
        else if (viewname == 'accesspermission')
          this.loadAccessPermissionComponent();
        else if (viewname == 'clinicdecision')
          this.loadClinicDecisionComponent();
        else if (viewname == 'patientednmaterial')
          this.loadPatientEdnMaterialComponent();
        else if (viewname == 'auditlog')
          this.loadAuditLogComponent();
        else if (viewname == 'ehiexport')
          this.loadEHIExportComponent();
        this.loadingSubject.next(false)
      });
  }

  onChangeViewState(view: string) {
    this.authService.SetViewParam("SubView", view);
    this.viewModel = this.authService.viewModel;
    this.settingsSubject.next(view);
  }

  async loadPracticeComponent() {
    if (this.viewModel.SubView != 'practice')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { PracticeComponent } = await import('./practice.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(PracticeComponent)
      );
    }
  }

  async loadScheduleComponent() {
    if (this.viewModel.SubView != 'schedule')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { ScheduleComponent } = await import('./schedule.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ScheduleComponent)
      );
    }
  }

  async loadErxComponent() {
    if (this.viewModel.SubView != 'erx')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { ErxComponent } = await import('./erx.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ErxComponent)
      );
    }
  }

  async loadAccessPermissionComponent() {
    if (this.viewModel.SubView != 'accesspermission')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { AccessPermissionComponent } = await import('./access.permission.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(AccessPermissionComponent)
      );
    }
  }

  async loadClinicDecisionComponent() {
    if (this.viewModel.SubView != 'clinicdecision')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { ClinicDecisionComponent } = await import('./clinicdecision.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(ClinicDecisionComponent)
      );
    }
  }

  async loadPatientEdnMaterialComponent() {
    if (this.viewModel.SubView != 'patientednmaterial')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { PatientEdnMaterialComponent } = await import('./patientednmaterial.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(PatientEdnMaterialComponent)
      );
    }
  }

  async loadEHIExportComponent() {
    if (this.viewModel.SubView != 'ehiexport')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { EHIExportComponent } = await import('./ehi.export.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(EHIExportComponent)
      );
    }
  }

  async loadAuditLogComponent() {
    if (this.viewModel.SubView != 'auditlog')
      this.settingsviewcontainerref.clear();
    else {
      this.settingsviewcontainerref.clear();
      const { AuditLogComponent } = await import('./auditlog.component');
      let viewcomp = this.settingsviewcontainerref.createComponent(
        this.cfr.resolveComponentFactory(AuditLogComponent)
      );
    }
  }

  // Access Permissions

  get CanViewEducationMaterial(): boolean {
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter((fn: { RoleName: string; }) => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter((fn: { PolicyName: string; MethodName: string; }) => fn.PolicyName == "EducationMaterialPolicy" && fn.MethodName == "display")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanViewPractice(): boolean {
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter((fn: { RoleName: string; }) => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter((fn: { PolicyName: string; MethodName: string; }) => fn.PolicyName == "PracticePolicy" && fn.MethodName == "show")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanViewEHIExport():boolean{
    var permissions = this.authService.permissions();
    if (!permissions) return false;
    var providerpermissions = permissions.filter((fn: { RoleName: string; }) => fn.RoleName == "provider")
    if (providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter((fn: { PolicyName: string; MethodName: string; }) => fn.PolicyName == "EHI" && fn.MethodName == "export")
    if (temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanViewAccessPermissions(): boolean{
    var permissions = this.authService.permissions();
    if(!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider");
    if(providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "AccessPermissionsPolicy" && fn.MethodName == "view")
    if(temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanUpdateAccessPermissions(): boolean{
    var permissions = this.authService.permissions();
    if(!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider");
    if(providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "AccessPermissionsPolicy" && fn.MethodName == "update")
    if(temp.length == 0) return false;
    return temp[0].Allowed;
  }

  get CanScheduleSettingPolicy(): boolean{
    var permissions = this.authService.permissions();
    if(!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider");
    if(providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "SettingPolicy" && fn.MethodName == "schedule")
    if(temp.length == 0) return false;
    return temp[0].Allowed;
  }
}
