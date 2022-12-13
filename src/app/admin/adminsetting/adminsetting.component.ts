import { Component, OnInit } from '@angular/core';
import { AlertMessage, ERROR_CODES } from 'src/app/_alerts/alertMessage';
import { AdminSetting } from 'src/app/_models/_admin/adminsettings';
import { AdminService } from 'src/app/_services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminsetting',
  templateUrl: './adminsetting.component.html',
  styleUrls: ['./adminsetting.component.scss']
})
export class AdminsettingComponent implements OnInit {
  adminSettingVersion:AdminSetting = {};
  constructor(private adminservice: AdminService,  private alertmsg: AlertMessage) { }

  ngOnInit(): void {
    this.GetAdminSettingVersion();
  }

  GetAdminSettingVersion()
  {
   this.adminservice.GetAdminSettingVersion().subscribe(resp=>
  {
    if(resp.IsSuccess)
    {
      this.adminSettingVersion = resp.ListResult[0];
    }
  })
  }
  UpdateAdminSettingVersion()
  {
    this.adminSettingVersion.Cid = "5836d785f2e48f3058d45779";
    this.adminservice.UpdateAdminSettingVersion(this.adminSettingVersion).subscribe(
      resp=>
      {
        if(resp.IsSuccess)
        {
          this.GetAdminSettingVersion();
        //  this.alertmsg.displayMessageDailog(ERROR_CODES["M1AS001"]);
        this.alertWithSuccess();
        }
      }
    )
  }
  alertWithSuccess() {
    Swal.fire({
      title: 'App version is updated successfully' ,
      width: '700',
      customClass: {
        cancelButton: 'admin-cancel-button',
        title:"admin-swal2-styled"
      },
      background: '#f9f9f9',
      showCancelButton: true,
      cancelButtonText: 'Close',
      showConfirmButton:false,
      backdrop: true,
    });
  }
}
