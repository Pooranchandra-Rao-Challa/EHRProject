import { Component, OnInit } from '@angular/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'access-permission-settings',
  templateUrl: './access.permission.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AccessPermissionComponent implements OnInit {
  accessPermissionColumns = ['empty', 'admin', 'back_office', 'dentist', 'ehr1_administrator', 'front_desk', 'hygienist'];

  accessPermissiondataSource = [
    {Name: 'Advanced directive show?'},
    {Name: 'Advanced directive update?'},
    {Name: 'Allergy create?'},
    {Name: 'Allergy show?'},
    {Name: 'Allergy update?'},
    {Name: 'Appointment create?'},
    {Name: 'Appointment reschedule?'},
    {Name: 'Appointment show?'},
    {Name: 'Appointment update?'},
    {Name: 'Cds configure?'},
    {Name: 'Cds display?'},
    {Name: 'Chart dental show?'},
    {Name: 'Chart insurance show?'},
    {Name: 'Chart main show?'},
    {Name: 'Chart perio show?'},
    {Name: 'Chart perio update?'},
    {Name: 'Chart profile show?'},
    {Name: 'Diagnosis create?'},
    {Name: 'Diagnosis show?'},
    {Name: 'Diagnosis update?'},
    {Name: 'Education material configure?'},
    {Name: 'Education material display?'},
    {Name: 'Email message create?'},
    {Name: 'Email message show?'},
    {Name: 'Encounter create?'},
    {Name: 'Encounter show?'},
    {Name: 'Encounter update?'},
    {Name: 'Immunization create?'},
    {Name: 'Immunization show?'},
    {Name: 'Immunization update?'},
    {Name: 'Intervention create?'},
    {Name: 'Intervention show?'},
    {Name: 'Intervention update?'},
    {Name: 'Medication create?'},
    {Name: 'Medication show?'},
    {Name: 'Medication update?'},
    {Name: 'Past medical history show?'},
    {Name: 'Past medical history update?'},
    {Name: 'Patient create?'},
    {Name: 'Patient patient?'},
    {Name: 'Patient update?'},
    {Name: 'Practice create?'},
    {Name: 'Practice show?'},
    {Name: 'Practice update?'},
    {Name: 'Procedure create?'},
    {Name: 'Procedure show?'},
    {Name: 'Procedure update?'},
    {Name: 'Profile show?'},
    {Name: 'Profile update?'},
    {Name: 'Setting schedule?'},
    {Name: 'Setting show?'},
    {Name: 'Smoking status show?'},
    {Name: 'Smoking status update?'},
  ];

  constructor(private alertmsg: AlertMessage) {}

  ngOnInit(): void {}


  SaveAccessPermission() {
    this.alertmsg.displayMessageDailog(ERROR_CODES["M2JAC001"]);
  }
}
