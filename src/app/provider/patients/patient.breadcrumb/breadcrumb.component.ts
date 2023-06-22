
import { PatientService } from 'src/app/_services/patient.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientBreadcurm } from 'src/app/_models/_provider/Providerpatient';
import { NotifyPatientChangedInProviderPatientDetails } from 'src/app/_navigations/provider.layout/view.notification.service';


@Component({
  selector: 'patient-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {

  @Input() breadcrumbs: PatientBreadcurm[] = [];
  @Output() removePatientInBreadcrumb = new EventEmitter<PatientBreadcurm>();
  @Output() navigateTo = new EventEmitter<PatientBreadcurm>();
  constructor(private authService: AuthenticationService,
    private patientService: PatientService,
    private notifyPatientChanged: NotifyPatientChangedInProviderPatientDetails) {
  }

  removePatientBreadcrumbInView(breadcrumb: PatientBreadcurm) {
    this.removePatientInBreadcrumb.emit(breadcrumb);
  }

  patientDetailsView(breadcrumb: PatientBreadcurm) {
    this.navigateTo.emit(breadcrumb);
  }

  onSwitchPatient(breadcrumb: PatientBreadcurm,showListView: boolean) {


    this.notifyPatientChanged.sendData(breadcrumb,showListView)
  }


}
