import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PatientProfile } from './../_models/_patient/patientprofile';
import { patientService } from 'src/app/_services/patient.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from '../_models';



@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  user: User;
  myControl = new FormControl();
  PatientProfile: PatientProfile;
  patietnprofile:any
  options: string[] = ['501', '502', '401','402','601','603'];
  filteredOptions: Observable<string[]>;
  questions: string[] =  ['What is your favorite sports team?', 'Which historical figure would you most like to meet?', 'In what city were you born?','What was the make and model of your first car?',
  'What is your favorite movie?','What is the name of your favorite person in history?','Who is your favorite actor, musician, or artist?','What was your favorite sport in high school?',
'What is the name of your favorite book?','What was the last name of your first grade teacher?','Where were you when you had your first kiss?','Where were you when you had your first kiss?',
'What is the last name of the teacher who gave you your first falling grade?'];

  constructor(private patientservise: patientService,private authenticationService: AuthenticationService,) {
    this.user = authenticationService.userValue;
    console.log(this.user);
  }

  ngOnInit(): void {
     this.getPatientProfile();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  getPatientProfile(reqparam?) {

    var req={
      "PatientId": this.user.PatientId,
    }
    this.patientservise.PatientProfileByPatientId(req).subscribe(resp => {
      debugger;
      if (resp.IsSuccess) {
        this.PatientProfile=resp.ListResult[0];
      }
    });
  }


  private _filter(value: string): string[] {
    //debugger
    if(value==""){
      return ['Please enter 1 or more characters']
    }
    const filterValue = value.toLowerCase();
    var searchData=this.options.filter(option => option.toLowerCase().includes(filterValue));
    if(searchData.length===0){
      return ['No Data Found']
    }
    return searchData;
  }

  }

