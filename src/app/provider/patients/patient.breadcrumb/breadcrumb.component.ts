
import { PatientService } from 'src/app/_services/patient.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthenticationService} from 'src/app/_services/authentication.service';
import { PatientBreadcurm } from 'src/app/_models/_provider/Providerpatient';


@Component({
  selector: 'patient-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent{

  @Input() breadcrumbs: PatientBreadcurm[]=[];
  @Output() removePatientInBreadcrumb = new EventEmitter<string>();
  @Output() navigateTo = new EventEmitter<PatientBreadcurm>();
  constructor(private authService: AuthenticationService,
    private patientService: PatientService ){
  }

  removePatientBreadcrumbInView(patientId: string){
    this.removePatientInBreadcrumb.emit(patientId);
  }

  patientDetailsView(breadcrumb: PatientBreadcurm){
    this.navigateTo.emit(breadcrumb);
  }
}
