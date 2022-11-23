import { PatientService } from 'src/app/_services/patient.service';
import { Component } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { User, UserLocations } from '../_models'
import { ActiveLog } from '../_models/_patient/activelog';
import { Subject } from 'rxjs-compat';

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.component.scss']
})
export class ActivityLogComponent {
  ActiveLogData: ActiveLog;
  locationsInfo: UserLocations[];
  user: User
  startDate: string;
  enddate: string;
  minDateToFinish = new Subject<string>();
  endDateForActivityLog;
  constructor(private authenticationService: AuthenticationService, private patientservise: PatientService,) {
    this.user = authenticationService.userValue
    this.locationsInfo = JSON.parse(this.user.LocationInfo);
    this.minDateToFinish.subscribe(a => {
      this.endDateForActivityLog = new Date(a);
    })
  }

  ngOnInit(): void {
    this.getActivetLogList('');
  }

  dateChange(e) {
    this.minDateToFinish.next(e.value.toString());
  }

  getActivetLogList(event) {
    if (event == 'reset') {
      this.startDate = '';
      this.enddate = '';
      var reqparams = {
        "PatientId": this.user.PatientId,
        from: this.startDate,
        to: this.enddate
      }
    }
    else {
      var reqparams = {
        "PatientId": this.user.PatientId,
        from: this.startDate,
        to: this.enddate
      }
    }
    this.patientservise.MyActivityLogs(reqparams).subscribe(resp => {
      this.ActiveLogData = resp.ListResult;
    });
  }

}
