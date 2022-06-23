import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PatientService } from 'src/app/_services/patient.service';
import { Component } from '@angular/core';
import { Patient } from 'src/app/_models/_account/newPatient';
import { AuthenticationService} from 'src/app/_services/authentication.service';


export class PatientBreadcurm{
  Name?: string;
  DOB?: NgbDateStruct;
  URL?: string;
  PatientId?: string;
  ProviderId?: string;
  ShowRemoveIcon?: boolean = false;
}

@Component({
  selector: 'patient-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent{
  breadcrumbs?: PatientBreadcurm[]= []
  constructor(private authService: AuthenticationService,
    private patientService: PatientService ){
      this.loadBreadcurmData();

      let  pb: PatientBreadcurm = {
        Name:  "Patients",
        URL: 'provider/patientdetails',
        ProviderId: this.authService.userValue.ProviderId
      }
      this.breadcrumbs.push(pb);
      console.log(this.breadcrumbs);

  }
  loadBreadcurmData(){
    this.patientService.LatestUpdatedPatientsUrl({ProviderId:this.authService.userValue.ProviderId})
    .subscribe(resp => {
      if(resp.IsSuccess){
        let patients = resp.ListResult as Patient[];
        console.log(patients);

        patients.forEach((p) =>{
            let  pb: PatientBreadcurm = {
              Name:  p.FirstName+' '+p.LastName,
              DOB:  p.DateofBirth,
              URL: 'provider/patientdetails',
              PatientId: p.PatientId,
              ShowRemoveIcon: true
            }
            this.breadcrumbs.push(pb);
        });
      }
    })
  }
}
