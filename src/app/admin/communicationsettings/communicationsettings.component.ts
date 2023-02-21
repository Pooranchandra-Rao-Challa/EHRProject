import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { CommunicationSetting } from 'src/app/_models/_admin/adminsettings';

@Component({
  selector: 'app-communicationsettings',
  templateUrl: './communicationsettings.component.html',
  styleUrls: ['./communicationsettings.component.scss']
})
export class CommunicationsettingsComponent implements OnInit {
  data: CommunicationSetting;
  constructor(private adminService:AdminService) { }

  ngOnInit(): void {
    this.adminService.CommunicationSetting().subscribe((resp)=>{
      if(resp.IsSuccess){
        this.data = resp.Result as CommunicationSetting;
      }
    })
  }
  get Status(): string{
    return this.data.Status=='disabled' ? 'Disabled' : 'Enabled' ;
  }

  get ToggleStatus(): string{
    return this.data.Status=='disabled' ? 'Enabled' : 'Disabled' ;
  }

  get ActionStatus(): string{
    return this.data.Status=='disabled' ? 'Enable' : 'Disable' ;
  }



  UpdateStatus(status: string){
    this.data.Status = status.toLowerCase();
    this.adminService.UpdateCommunicationSetting(this.data).subscribe(resp=>{
      if(resp.Result){
        // show message as success.
      }else{
        // Show message as error.
      }
    });
  }
}
