import { AuthenticationService } from './../../_services/authentication.service';
import { SettingsService } from 'src/app/_services/settings.service';
import { Component, OnInit } from '@angular/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { PolicyPermission, RoleAccess } from 'src/app/_models/_provider/_settings/settings';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'access-permission-settings',
  templateUrl: './access.permission.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AccessPermissionComponent implements OnInit {
  accessPermissionColumns = ['policyname','policymethod', 'admin', 'back_office', 'dentist', 'ehr1_administrator', 'front_desk', 'hygientist'];

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

  rolePermissions: PolicyPermission[];

  constructor(private alertmsg: AlertMessage,
    private authService: AuthenticationService,
    private settingsService:SettingsService) {}

  ngOnInit(): void {
    this.bindPolicyPermissions();
  }

  bindPolicyPermissions(){
    this.settingsService.RoleWisePermissions(this.authService.userValue.ClinicId).subscribe(resp=>{
      if(resp.IsSuccess){
        this.rolePermissions = resp.ListResult as PolicyPermission[];
      }
    });
  }

  checkRolePermission(roleAccess: RoleAccess[],roleName: string){
    var access = roleAccess.filter( fn => fn.RoleName == roleName);
    if(access.length == 1) return access[0].Allowed
    else return false;
  }

  toggleStatus(eventsource:MatCheckboxChange,roleAccess: RoleAccess[],roleName: string){
    var access = roleAccess.filter( fn => fn.RoleName == roleName);
    if(access.length == 1){
      access[0].Allowed = eventsource.checked;
    }
  }
  savingEnabled: boolean = false;
  SaveAccessPermission() {
    //this.alertmsg.displayMessageDailog(ERROR_CODES["M2JAC001"]);
    this.savingEnabled = true;
    this.settingsService.UpdateRolePermissions(this.rolePermissions).subscribe(resp =>{
      if(resp.IsSuccess){
        this.savingEnabled = false;
        this.bindPolicyPermissions();
        this.alertmsg.displayMessageDailog(ERROR_CODES["M2JAC001"]);
      }
    });
  }
}
