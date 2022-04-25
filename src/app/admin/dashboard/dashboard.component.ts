import { Component, OnInit, TemplateRef } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { AdminService } from 'src/app/_services/admin.service';
import { ComponentType } from '@angular/cdk/portal';
import { AddUserDailougeComponent } from 'src/app/dialogs/adduser.dailouge/adduser.dailouge.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageSize: number = 50;
  page: number = 1;
  ProviderList:any;
  TotalItems:number;
  UserDialogComponent = AddUserDailougeComponent;
  DialogResponse = null;

  constructor(private adminservice:AdminService,private overlayService :OverlayService) { }

  ngOnInit(): void {
    this.GetProivderList();
  }

  GetProivderList(){
    this.adminservice.GetProviderList().subscribe(resp => {
      if(resp.IsSuccess){
        this.ProviderList = resp.ListResult;
        this.TotalItems = this.ProviderList.length;
        this.ProviderList.map((e) => {
          if(e.Trial == 'Trial'){
            e.ToggleButton=false;
           }
          else{
             e.ToggleButton=true;
           }
          if(e.PrimaryPhone != null)
          {
            var phoneno = e.PrimaryPhone
            phoneno = phoneno.slice(0, 0) + phoneno.slice(1);
            phoneno = phoneno.slice(1, 1) + phoneno.slice(1);
            phoneno = Array.from(phoneno)
            phoneno.splice(0, 0, '(')
            phoneno.splice(4, 0, ')')
            phoneno.splice(5, 0, ' ')
            phoneno.splice(9, 0, '-')
            e.NewPhoneNo = phoneno.join('');
          }
          else{
            e.NewPhoneNo=null;
          }
          if(e.ActiveStatus == 'Active'){
            e.ActiveStatus = 'Activate';
          }
          else{
            e.ActiveStatus = 'Suspend';
          }
        });
      }
      else{
            this.ProviderList=[];
      }
    });
  }
  openComponentDialog(content: TemplateRef<any> | ComponentType<any> | string) {
    const ref = this.overlayService.open(content, null);

    ref.afterClosed$.subscribe(res => {
      if (typeof content === 'string') {
      //} else if (content === this.yesNoComponent) {
        //this.yesNoComponentResponse = res.data;
      }
      else if (content === this.UserDialogComponent) {
        this.DialogResponse = res.data;
      }
    });
  }
}
