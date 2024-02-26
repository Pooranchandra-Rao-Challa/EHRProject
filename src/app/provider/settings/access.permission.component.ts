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

  get CanUpdateAccessPermissions(): boolean{
    var permissions = this.authService.permissions();
    if(!permissions) return false;
    var providerpermissions = permissions.filter(fn => fn.RoleName == "provider");
    if(providerpermissions && providerpermissions.length == 1) return true;
    var temp = permissions.filter(fn => fn.PolicyName == "AccessPermissionsPolicy" && fn.MethodName == "update")
    if(temp.length == 0) return false;
    return temp[0].Allowed;
  }
}
